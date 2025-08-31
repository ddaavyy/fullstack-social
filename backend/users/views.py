from django.shortcuts import get_object_or_404
from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth import authenticate
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer, BasicUserSerializer
from .models import CustomUser


class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer


class LoginView(generics.GenericAPIView):
    permission_classes = (AllowAny,)
    serializer_class = LoginSerializer
    
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        
        user_data = BasicUserSerializer(user).data
        
        return Response({
            'user': user_data,
            'token': str(refresh.access_token),
            'refresh': str(refresh)
        })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    try:
        refresh_token = request.data.get('refresh_token')
        if refresh_token:
            RefreshToken(refresh_token).blacklist()
        return Response({'message': 'Logout realizado com sucesso'})
    except Exception:
        return Response({'message': 'Logout realizado com sucesso'})


@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def user_profile(request, pk=None):
    target = request.user if pk is None else get_object_or_404(CustomUser, pk=pk)
    
    if target.pk != request.user.pk and not request.user.is_staff:
        return Response(
            {'detail': 'Você não tem permissão para acessar este perfil.'},
            status=status.HTTP_403_FORBIDDEN
        )

    if request.method == 'GET':
        return Response(UserSerializer(target, context={'request': request}).data)

    serializer = UserSerializer(
        target, data=request.data, partial=True, context={'request': request}
    )
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data, status=status.HTTP_200_OK)