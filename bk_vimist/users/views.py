from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from users.models import User
from django.contrib.auth import authenticate, get_user_model
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
    permission_classes = [permissions.AllowAny,]


    def post(self, request, *args, **kwargs):
        """
        Method to login a user
        """

        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        username = serializer.validated_data.get('username')
        password = serializer.validated_data.get('password')

        user = authenticate(username=username, password=password)
        if user is not None:
            # Generate JWT token for the user
            refresh = RefreshToken.for_user(user)
            refresh['role'] = user.role
            refresh['contact'] = user.contact if user.contact else user.email
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token)
            }, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)