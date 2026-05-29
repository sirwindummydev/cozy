from rest_framework import serializers
from .models import Category, Tour, TourImage, TourSchedule


class CategorySerializer(serializers.ModelSerializer):
    tour_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'icon', 'tour_count']

    def get_tour_count(self, obj):
        return obj.tours.filter(is_active=True).count()


class TourImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = TourImage
        fields = ['id', 'image', 'image_url', 'caption', 'is_primary', 'order']


class TourScheduleSerializer(serializers.ModelSerializer):
    remaining_slots = serializers.ReadOnlyField()
    effective_price = serializers.ReadOnlyField()

    class Meta:
        model = TourSchedule
        fields = ['id', 'start_date', 'end_date', 'price_override', 'available_slots',
                  'booked_slots', 'remaining_slots', 'effective_price', 'is_active']


class TourListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    cover = serializers.SerializerMethodField()

    class Meta:
        model = Tour
        fields = ['id', 'title', 'slug', 'category', 'category_name', 'summary', 'price',
                  'discount_price', 'duration', 'max_group_size', 'difficulty',
                  'cover', 'location', 'country', 'rating', 'rating_quantity',
                  'is_featured', 'is_active']

    def get_cover(self, obj):
        if obj.cover_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.cover_image.url)
        return obj.cover_image_url or ''


class TourDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    images = TourImageSerializer(many=True, read_only=True)
    schedules = TourScheduleSerializer(many=True, read_only=True)
    cover = serializers.SerializerMethodField()
    highlights_list = serializers.ReadOnlyField()
    includes_list = serializers.ReadOnlyField()
    excludes_list = serializers.ReadOnlyField()

    class Meta:
        model = Tour
        fields = ['id', 'title', 'slug', 'category', 'description', 'summary',
                  'price', 'discount_price', 'duration', 'max_group_size', 'difficulty',
                  'cover', 'images', 'schedules', 'location', 'country',
                  'rating', 'rating_quantity', 'is_featured', 'is_active',
                  'highlights', 'includes', 'excludes',
                  'highlights_list', 'includes_list', 'excludes_list',
                  'created_at', 'updated_at']

    def get_cover(self, obj):
        if obj.cover_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.cover_image.url)
        return obj.cover_image_url or ''


class TourWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tour
        fields = ['title', 'category', 'description', 'summary', 'price', 'discount_price',
                  'duration', 'max_group_size', 'difficulty', 'cover_image', 'cover_image_url',
                  'location', 'country', 'is_featured', 'is_active',
                  'highlights', 'includes', 'excludes']
