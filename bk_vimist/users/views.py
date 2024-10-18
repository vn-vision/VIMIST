from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from users.models import User
from users.serializers import UserRegSerializer, UserLogSerializer, SuperAdminRegSerializer
from rest_framework_simplejwt.tokens import RefreshToken

class SuperAdminRegisterView(generics.CreateAPIView):
    """
    APIView to register a new user
    """
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny,]
    serializer_class = SuperAdminRegSerializer


class UserRegisterView(generics.CreateAPIView):
    """
    APIView to register a new user
    """
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny,]
    serializer_class = UserRegSerializer
class LoginView(APIView):
    """
    APIView to login a user
    """
    serializer_class = UserLogSerializer
    permission_classes = []


    def post(self, request, *args, **kwargs):
        """
        Method to login a user
        """
        username = request.data.get('username')
        password = request.data.get('password')

        try:
            user = User.objects.get(username=username)
            if not user.check_password(password):
                return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
            
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token)
            })
        except User.DoesNotExist:
            return Response({'error': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)