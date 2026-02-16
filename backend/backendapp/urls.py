from django.urls import path, re_path
from . import views
from .views import CustomTokenObtainPairView,CustomTokenRefreshView

urlpatterns = [
    path('register/', views.register_user, name='register_user'),
    path('logout/',views.logout_user),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('user/', views.get_user, name='get_user'),
    path('authenticated/',views.is_authenticated),
    path('chat/', views.chat_with_dr_flora, name='chat'),
    path('sessions/', views.get_user_sessions, name='get_chat_sessions'),
    path('delete-session/<path:session_id>/', views.delete_session, name='delete_session'),
    re_path(r'^chat-history/(?P<session_id>[\w]+)/?$', views.get_chat_history, name='get_chat_history'),
    path('request-reset-email/', views.RequestPasswordResetEmail.as_view(), name="request-reset-email"),
    path('password-reset-complete/', views.SetNewPasswordAPIView.as_view(), name="password-reset-complete"),
    path('change-password/', views.ChangePasswordView.as_view(), name='change-password'),
    path('delete-account/', views.DeleteUserView.as_view(), name='delete-account'),
    path('download-report/<path:session_id>/', views.download_chat_report, name='download_report'),
]