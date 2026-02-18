from datetime import datetime
import json
from django.conf import settings
from django.http import HttpResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status, generics
from django.conf import settings
from .serializers import RegisterSerializer, DeleteAccountSerializer, User, UserSerializer, ResetPasswordRequestSerializer, SetNewPasswordSerializer, ChangePasswordSerializer
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import smart_bytes
from django.utils.http import urlsafe_base64_encode
from django.core.mail import send_mail
import dotenv
from rest_framework_simplejwt.views import (
    TokenObtainPairView, TokenRefreshView
)
from .ChatbotApi import ChatbotApiManager
from pymongo import MongoClient
import numpy as np
import cv2
from .mymodels import plantmodel, CLASS_NAMES
import os

dotenv.load_dotenv()
FRONTEND_URL = os.getenv("FRONTEND_URL")

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
            tokens = response.data
            access_token = tokens['access']
            refresh_token = tokens['refresh']
            response = Response()
            response.data = {"success":True}

            response.set_cookie(key='access_token',value=access_token, httponly=True, secure=True, samesite='None', path='/') 

            response.set_cookie(key='refresh_token',value=refresh_token, httponly=True, secure=True, samesite='None', path='/') 

            return response
        except:
            return Response({"success":False})

class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.COOKIES.get('refresh_token')
            request.data['refresh'] = refresh_token
            response = super().post(request, *args, **kwargs)
            tokens = response.data
            access_token = tokens['access']
            response = Response()
            response.data = {"refreshed":True}
            response.set_cookie(key='access_token',value=access_token, httponly=True, secure=False, samesite='None', path='/')
            return response
        except:
            return Response()

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    data = {
        "email": request.data.get("email"),
        "phone": request.data.get("phone"),
        "username": request.data.get("uname"),
        "password": request.data.get("password"),
    }

    print("Received registration data:", data)
    
    serializer = RegisterSerializer(data=data)
    
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "User registered successfully!"}, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def is_authenticated(request):
    return Response({"authenticated":True})

@api_view(['POST'])
def logout_user(request):
    try:
        response = Response()
        response.data = {"success":True}
        response.delete_cookie("access_token",path="/",samesite = 'None')
        response.delete_cookie("refresh_token",path="/",samesite = 'None')
        return response
    except:
        return Response({"success":False})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user(request):
    logged_in_user = request.user 
    queryset = User.objects.filter(username=logged_in_user.username)
    serializer = UserSerializer(queryset, many = True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def download_chat_report(request, session_id):
    client = MongoClient(settings.MONGO_CLIENT)
    db = client[settings.MONGO__DB]
    
    session_meta = db.sessions.find_one({"session_id": session_id, "user_id": request.user.id})
    if not session_meta:
        return Response({"error": "Unauthorized"}, status=403)

    response = HttpResponse(content_type='text/plain')
    
    filename = f"DrFlora_Report_{session_id[:8]}.txt"
    response['Content-Disposition'] = f'attachment; filename="{filename}"'

    cursor = db.chathistory.find({"SessionId": session_id}).sort("_id", 1)
    
    lines = [f"DR. FLORA GARDEN REPORT\nSession: {session_meta.get('title')}\n\n"]
    for doc in cursor:
        data = json.loads(doc.get('History')) if isinstance(doc.get('History'), str) else doc.get('History')
        role = "USER" if data['type'] == "human" else "DR. FLORA"
        lines.append(f"[{role}]: {data['data']['content']}\n\n")

    response.writelines(lines)
    return response

chatbot_manager = ChatbotApiManager()
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def chat_with_dr_flora(request):
    session_id = request.data.get("session_id")
    user_message = request.data.get("message", "")
    image_file = request.FILES.get("image")

    if not session_id:
        return Response({"error": "Invalid Session ID"}, status=403)

    try:
        if image_file:

            file_bytes = np.frombuffer(image_file.read(), np.uint8)
            img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
            if img is None:
                return Response({"error": "Failed to decode image"}, status=400)
            img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            img_resized = cv2.resize(img, (224, 224))
            img_array = np.expand_dims(img_resized, axis=0)

            predictions = plantmodel.predict(img_array)
            class_idx = np.argmax(predictions[0])
            confidence = float(predictions[0][class_idx]) * 100
            
            raw_label = CLASS_NAMES[class_idx]
            display_name = raw_label.replace('___', ': ').replace('_', ' ')

            is_healthy = "healthy" in display_name.lower()
            
            if is_healthy:
                user_query = user_message if user_message else f"How do I keep my plant {display_name} healthy (Confidence:{confidence:.2f}%)?"
            else:
                user_query = user_message if user_message else f"What are the treatments and prevention steps for my plant ({display_name}). (Confidence: {confidence:.2f}%)?"

            bot_response = chatbot_manager.call_chatbot(user_query, session_id, disease_name=display_name)
            client = MongoClient(settings.MONGO_CLIENT)
            db = client[settings.MONGO__DB]
            if not db.sessions.find_one({"session_id": session_id}):
                summary_prompt = f"Summarize this gardening query into a single 3-word title: {user_query}"
                raw_title = chatbot_manager.llm.invoke(summary_prompt).content
                clean_title = raw_title.strip().replace('"', '').replace("'", "")
                
                db.sessions.insert_one({
                    "session_id": session_id,
                    "user_id": request.user.id,
                    "title": ' '.join(clean_title.split()[:4]),
                    "created_at": datetime.now().strftime("%b %d")
                })

            return Response({
                "status": "success",
                "display_name": display_name,
                "confidence": round(confidence, 2),
                "is_healthy": is_healthy,
                "reply": bot_response
            }, status=status.HTTP_200_OK)

        else:
            bot_response = chatbot_manager.call_chatbot(user_message, session_id)
            
            client = MongoClient(settings.MONGO_CLIENT)
            db = client[settings.MONGO__DB]
            if not db.sessions.find_one({"session_id": session_id}):
                summary_prompt = f"Summarize this gardening query into a single 3-word title: {user_message}"
                raw_title = chatbot_manager.llm.invoke(summary_prompt).content
                clean_title = raw_title.strip().replace('"', '').replace("'", "")

                db.sessions.insert_one({
                    "session_id": session_id,
                    "user_id": request.user.id,
                    "title": ' '.join(clean_title.split()[:4]),
                    "created_at": datetime.now().strftime("%b %d")
                })
            return Response({
                "status": "success",
                "reply": bot_response
            }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=500)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_sessions(request):
    client = MongoClient(settings.MONGO_CLIENT)
    db = client[settings.MONGO__DB]

    cursor = db.sessions.find({"user_id": request.user.id}).sort("_id", -1)
    
    history_data = []
    for doc in cursor:
        history_data.append({
            "id": doc.get("session_id"), 
            "label": doc.get("title", "Garden Chat"),
            "date": doc.get("created_at", "Jan 25")
        })

    return Response({"history": history_data})

@api_view(['GET'])
def get_chat_history(request, session_id):
    client = MongoClient(settings.MONGO_CLIENT)
    db = client[settings.MONGO__DB]
    collection = db['chathistory']
    
    cursor = collection.find({"SessionId": session_id}).sort("_id", 1)
    
    clean_messages = []
    for doc in cursor:
        raw_history = doc.get('History')
        data = json.loads(raw_history) if isinstance(raw_history, str) else raw_history
        
        content = data['data']['content']
        sender = "user" if data['type'] == "human" else "bot"
        
        is_diagnosis = False
        is_healthy = False
        if sender == "bot" and ("Vision Diagnosis:" in content or "Confidence:" in content):
            is_diagnosis = True
            is_healthy = "healthy" in content.lower()

        clean_messages.append({
            "text": content,
            "sender": sender,
            "is_diagnosis": is_diagnosis,
            "is_healthy": is_healthy
        })
    
    return Response({"messages": clean_messages})

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_session(request, session_id):
    client = MongoClient(settings.MONGO_CLIENT)
    db = client[settings.MONGO__DB]
    
    session_meta = db.sessions.find_one({"session_id": session_id, "user_id": request.user.id})
    
    if not session_meta:
        return Response({"error": "Unauthorized or not found"}, status=404)

    db.sessions.delete_one({"session_id": session_id})
    db.chathistory.delete_many({"SessionId": session_id})

    return Response({"status": "deleted"}, status=200)

class RequestPasswordResetEmail(generics.GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = ResetPasswordRequestSerializer

    def post(self, request):
        email = request.data.get('email', '')
        if User.objects.filter(email=email).exists():
            user = User.objects.get(email=email)
            uidb64 = urlsafe_base64_encode(smart_bytes(user.id))
            token = PasswordResetTokenGenerator().make_token(user)

            reset_link = f"{FRONTEND_URL}{uidb64}/{token}"
            
            send_mail(
                'Password Reset Request',
                f'Click the link below to reset your password: \n{reset_link}',
                'noreply@backend.com',
                [user.email],
                fail_silently=False,
            )
        return Response({'success': 'If an account exists, a reset link has been sent.','resetLink': reset_link}, status=status.HTTP_200_OK)

class SetNewPasswordAPIView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = SetNewPasswordSerializer

    def patch(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({'success': True, 'message': 'Password reset success'}, status=status.HTTP_200_OK)
    
class ChangePasswordView(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = request.user
        if not user.check_password(serializer.data.get("old_password")):
            return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(serializer.data.get("new_password"))
        user.save()

        response = Response(
            {"message": "Password updated successfully. Please log in again."}, 
            status=status.HTTP_200_OK
        )

        return response
    
class DeleteUserView(generics.GenericAPIView):
    serializer_class = DeleteAccountSerializer
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        
        user = request.user

        try:
            
            client = MongoClient(settings.MONGO_CLIENT)
            db = client[settings.MONGO__DB]
            
            db.sessions.delete_many({"user_id": user.id})
            db.chathistory.delete_many({"SessionId": {"$in": [s['session_id'] for s in db.sessions.find({"user_id": user.id})]}})

            user.delete()

            response = Response({"message": "Account deleted successfully."}, status=status.HTTP_200_OK)
            response.delete_cookie("access_token", path="/", samesite='None')
            response.delete_cookie("refresh_token", path="/", samesite='None')
            
            return response

        except Exception as e:
            return Response({"error": "An error occurred during deletion."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)