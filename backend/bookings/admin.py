from django.contrib import admin
from .models import Booking, Review


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'tour', 'num_guests', 'total_price', 'status', 'booked_at']
    list_filter = ['status', 'booked_at']
    search_fields = ['user__username', 'tour__title', 'email']
    list_editable = ['status']


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['user', 'tour', 'rating', 'created_at']
    list_filter = ['rating']
