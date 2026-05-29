from rest_framework import generics, permissions, filters, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Tour, TourImage, TourSchedule
from .serializers import (CategorySerializer, TourListSerializer,
                           TourDetailSerializer, TourWriteSerializer,
                           TourImageSerializer, TourScheduleSerializer)


class CategoryListView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]


class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAdminUser]


class TourListView(generics.ListAPIView):
    queryset = Tour.objects.filter(is_active=True).select_related('category').prefetch_related('images')
    serializer_class = TourListSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'difficulty', 'is_featured']
    search_fields = ['title', 'location', 'country', 'summary']
    ordering_fields = ['price', 'rating', 'created_at']
    ordering = ['-created_at']


class TourDetailView(generics.RetrieveAPIView):
    queryset = Tour.objects.filter(is_active=True).select_related('category').prefetch_related('images', 'schedules')
    serializer_class = TourDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'


class AdminTourListView(generics.ListCreateAPIView):
    queryset = Tour.objects.all().select_related('category').order_by('-created_at')
    permission_classes = [permissions.IsAdminUser]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return TourWriteSerializer
        return TourListSerializer


class AdminTourDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Tour.objects.all()
    permission_classes = [permissions.IsAdminUser]

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return TourWriteSerializer
        return TourDetailSerializer

    def get_object(self):
        return Tour.objects.get(pk=self.kwargs['pk'])


class TourImageCreateView(generics.CreateAPIView):
    serializer_class = TourImageSerializer
    permission_classes = [permissions.IsAdminUser]

    def perform_create(self, serializer):
        tour = Tour.objects.get(pk=self.kwargs['tour_id'])
        serializer.save(tour=tour)


class TourImageDeleteView(generics.DestroyAPIView):
    queryset = TourImage.objects.all()
    permission_classes = [permissions.IsAdminUser]


class TourScheduleView(generics.ListCreateAPIView):
    serializer_class = TourScheduleSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        return TourSchedule.objects.filter(tour_id=self.kwargs['tour_id'], is_active=True)

    def perform_create(self, serializer):
        tour = Tour.objects.get(pk=self.kwargs['tour_id'])
        serializer.save(tour=tour)


class FeaturedToursView(generics.ListAPIView):
    queryset = Tour.objects.filter(is_active=True, is_featured=True).select_related('category')[:6]
    serializer_class = TourListSerializer
    permission_classes = [permissions.AllowAny]
