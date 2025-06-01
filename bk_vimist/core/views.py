from rest_framework import generics, viewsets, status, permissions
from .serializers import UserSerializer, RegistrationSerializer
from .models import User
from rest_framework.response import Response

# User
class UserViewSet(viewsets.ModelViewSet):
    '''
    Standard CRUD for registered users.
    - only accessible by Admin or Manager Roles
    - List, Retrieve, update, de/re-activate users: soft delete
    '''
    queryset = User.objects.filter(deleted_at__isnull=True)
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        user = self.request.user
        # only admins can create new users via this ViewSet
        if self.action in ['create', 'destroy', 'partial_update', 'update']:
            if user.role != 'Admin':
                self.permission_denied(self.request, message="Only Admins can modify users")
        return super().get_permissions()
    
    def destroy(self, request, *args, **kwargs):
        '''
        override destroy() to perform soft delete:
        Instead of deleting the row, we set deleted_at = now()
        '''
        user = self.get_object()
        user.delete() # calls TimestampedModel.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class RegistrationView(generics.CreateAPIView):
    '''
    Endpoint to handle first-time signup (Admin + Company)
    or Add new users under an existing Company
    URL: /api/register
    '''
    serializer_class = RegistrationSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        # override to return a custom response:
        # - with token / special message
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # optionally, automatically create a Token for this user
        from rest_framework.authtoken.models import Token
        token, _ = Token.objects.get_or_create(user=user)

        data = {
            'message':'User registered successfully',
            'user_id':user.id,
            'token':token.key
        }
        return Response(data, status=status.HTTP_201_CREATED)