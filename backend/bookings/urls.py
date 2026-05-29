from django.urls import path
from . import views

urlpatterns = [
    path('', views.BookingListCreateView.as_view(), name='booking-list'),
    path('<int:pk>/', views.BookingDetailView.as_view(), name='booking-detail'),
    path('<int:pk>/status/', views.UpdateBookingStatusView.as_view(), name='booking-status'),
    path('tours/<int:tour_id>/reviews/', views.ReviewListView.as_view(), name='tour-reviews'),
]
