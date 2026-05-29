from django.contrib import admin
from .models import Category, Tour, TourImage, TourSchedule


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'icon']
    prepopulated_fields = {'slug': ('name',)}


class TourImageInline(admin.TabularInline):
    model = TourImage
    extra = 1


class TourScheduleInline(admin.TabularInline):
    model = TourSchedule
    extra = 1


@admin.register(Tour)
class TourAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'price', 'duration', 'difficulty', 'rating', 'is_featured', 'is_active']
    list_filter = ['category', 'difficulty', 'is_featured', 'is_active']
    search_fields = ['title', 'location', 'country']
    prepopulated_fields = {'slug': ('title',)}
    inlines = [TourImageInline, TourScheduleInline]
    list_editable = ['is_featured', 'is_active']


@admin.register(TourSchedule)
class TourScheduleAdmin(admin.ModelAdmin):
    list_display = ['tour', 'start_date', 'end_date', 'available_slots', 'booked_slots', 'is_active']
    list_filter = ['is_active']
