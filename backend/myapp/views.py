from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate, login, logout
from django.db.models import Q
from .models import Item
from .serializers import ItemSerializer, UserSerializer, RegisterSerializer
from django.contrib.auth.models import User

class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    
    def get_permissions(self):
        """
        Allow any user to view items, but require authentication for create, update, delete
        """
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    def list(self, request):
        search = request.query_params.get('search', None)
        if search:
            items = Item.objects.filter(
                Q(name__icontains=search) | 
                Q(description__icontains=search) |
                Q(category__icontains=search)
            )
        else:
            items = Item.objects.all()
            
        serializer = self.serializer_class(items, many=True)
        return Response(serializer.data)

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        # Log the user in after registration
        login(request, user)
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response({"message": "Username and password are required"}, status=status.HTTP_400_BAD_REQUEST)
    
    user = authenticate(request, username=username, password=password)
    
    if user is not None:
        login(request, user)
        return Response(UserSerializer(user).data)
    else:
        return Response({"message": "Invalid username or password"}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
def logout_user(request):
    logout(request)
    return Response({"message": "Logged out successfully"})

@api_view(['GET'])
def get_user(request):
    if not request.user.is_authenticated:
        return Response({"message": "Not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)
        
    return Response(UserSerializer(request.user).data)