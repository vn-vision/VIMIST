from django.shortcuts import render
from rest_framework.response import Response
from .models import Config
from rest_framework import status, permissions, viewsets
from .serializers import ConfigSerializer
from users.mixins import RoleBasedAccessMixin

# Create your views here.
class ConfigView(viewsets.ModelViewSet, RoleBasedAccessMixin):
    queryset = Config.objects.all().order_by('id')
    serializer_class = ConfigSerializer

    def create(self, request):
        serializer = ConfigSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk=None):
        config = Config.objects.get(pk=pk)
        serializer = ConfigSerializer(instance=config, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def partial_update(self, request, pk=None):
        config = Config.objects.get(pk=pk)
        serializer = ConfigSerializer(instance=config, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        config = Config.objects.get(pk=pk)
        config.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)