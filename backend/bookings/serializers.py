from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Booking, Review
from tours.serializers import TourListSerializer


class BookingSerializer(serializers.ModelSerializer):
    tour_title = serializers.CharField(source='tour.title', read_only=True)
    tour_cover = serializers.SerializerMethodField()
    user_name = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = ['id', 'user', 'tour', 'tour_title', 'tour_cover', 'user_name',
                  'schedule', 'num_guests', 'total_price', 'status',
                  'first_name', 'last_name', 'email', 'phone',
                  'special_requests', 'booked_at', 'updated_at']
        read_only_fields = ['user', 'booked_at', 'updated_at']

    def get_tour_cover(self, obj):
        return obj.tour.cover_image_url or ''

    def get_user_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}".strip() or obj.user.username

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        tour = validated_data['tour']
        num_guests = validated_data.get('num_guests', 1)
        validated_data['total_price'] = tour.price * num_guests
        return super().create(validated_data)


class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = ['id', 'user', 'tour', 'rating', 'comment', 'user_name', 'created_at']
        read_only_fields = ['user']

    def get_user_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}".strip() or obj.user.username

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
