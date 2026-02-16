from rest_framework_simplejwt.authentication import JWTAuthentication

class CookiesJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        access_token = request.COOKIES.get('access_token') or None
        if access_token is None:
            return None
        validated_token = self.get_validated_token(access_token)
        try:
            user = self.get_user(validated_token)
        except:
            return None
        return (user, validated_token)