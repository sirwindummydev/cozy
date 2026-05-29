from django.urls import path
from . import views

urlpatterns = [
    path('', views.TourListView.as_view(), name='tour-list'),
    path('featured/', views.FeaturedToursView.as_view(), name='featured-tours'),
    path('categories/', views.CategoryListView.as_view(), name='category-list'),
    path('categories/<int:pk>/', views.CategoryDetailView.as_view(), name='category-detail'),

    # Admin routes — must come BEFORE <slug:slug>/ or Django matches "admin" as a slug
    path('admin/all/', views.AdminTourListView.as_view(), name='admin-tour-list'),
    path('admin/<int:pk>/', views.AdminTourDetailView.as_view(), name='admin-tour-detail'),
    path('admin/<int:tour_id>/images/', views.TourImageCreateView.as_view(), name='tour-image-create'),
    path('admin/images/<int:pk>/', views.TourImageDeleteView.as_view(), name='tour-image-delete'),

    # Numeric ID route
    path('<int:tour_id>/schedules/', views.TourScheduleView.as_view(), name='tour-schedules'),

    # Slug route last — catch-all for named tour detail pages
    path('<slug:slug>/', views.TourDetailView.as_view(), name='tour-detail'),
]
