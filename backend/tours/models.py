from django.db import models
from django.utils.text import slugify


class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True, default='FaGlobe')

    class Meta:
        verbose_name_plural = 'Categories'

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Tour(models.Model):
    DIFFICULTY_CHOICES = [
        ('easy', 'Easy'),
        ('moderate', 'Moderate'),
        ('challenging', 'Challenging'),
    ]

    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='tours')
    description = models.TextField()
    summary = models.CharField(max_length=500)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    duration = models.CharField(max_length=50)
    max_group_size = models.IntegerField(default=15)
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES, default='moderate')
    cover_image = models.ImageField(upload_to='tours/covers/', blank=True, null=True)
    cover_image_url = models.URLField(blank=True)
    location = models.CharField(max_length=200)
    country = models.CharField(max_length=100)
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=4.5)
    rating_quantity = models.IntegerField(default=0)
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    highlights = models.TextField(blank=True, help_text='One highlight per line')
    includes = models.TextField(blank=True, help_text='One item per line')
    excludes = models.TextField(blank=True, help_text='One item per line')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

    @property
    def highlights_list(self):
        return [h.strip() for h in self.highlights.split('\n') if h.strip()]

    @property
    def includes_list(self):
        return [i.strip() for i in self.includes.split('\n') if i.strip()]

    @property
    def excludes_list(self):
        return [e.strip() for e in self.excludes.split('\n') if e.strip()]


class TourImage(models.Model):
    tour = models.ForeignKey(Tour, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='tours/images/', blank=True, null=True)
    image_url = models.URLField(blank=True)
    caption = models.CharField(max_length=200, blank=True)
    is_primary = models.BooleanField(default=False)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.tour.title} - Image {self.order}"


class TourSchedule(models.Model):
    tour = models.ForeignKey(Tour, related_name='schedules', on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField()
    price_override = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    available_slots = models.IntegerField(default=15)
    booked_slots = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)

    @property
    def remaining_slots(self):
        return self.available_slots - self.booked_slots

    @property
    def effective_price(self):
        return self.price_override or self.tour.price

    def __str__(self):
        return f"{self.tour.title} - {self.start_date}"
