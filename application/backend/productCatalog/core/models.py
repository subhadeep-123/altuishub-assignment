from django.db import models
from django.utils import timezone


class User(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Product(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class Apartment(models.Model):
    BEDROOM_CHOICES = [
        ("1", "1 Bedroom"),
        ("2", "2 Bedroom"),
        ("3", "3 Bedroom"),
        ("4", "4+ Bedroom"),
    ]

    PROPERTY_TYPE_CHOICES = [
        ("apartment", "Apartment"),
        ("house", "Independent House"),
        ("villa", "Villa"),
        ("studio", "Studio"),
    ]

    FURNISHING_CHOICES = [
        ("fully_furnished", "Fully Furnished"),
        ("semi_furnished", "Semi Furnished"),
        ("unfurnished", "Unfurnished"),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    price = models.IntegerField(help_text="Monthly rent in Rs.")
    bedroom_type = models.CharField(choices=BEDROOM_CHOICES, max_length=5)
    property_type = models.CharField(
        choices=PROPERTY_TYPE_CHOICES, max_length=20, default="apartment"
    )
    furnishing = models.CharField(
        choices=FURNISHING_CHOICES, max_length=20, default="unfurnished"
    )

    # Location details
    location = models.CharField(max_length=255)
    city = models.CharField(max_length=100, default="Mumbai")
    state = models.CharField(max_length=100, default="Maharashtra")
    pincode = models.CharField(max_length=10, blank=True)

    # Property details
    area_sqft = models.IntegerField(
        blank=True, null=True, help_text="Area in square feet"
    )
    bathrooms = models.IntegerField(default=1)
    balcony = models.IntegerField(default=0)
    parking = models.BooleanField(default=False)

    # Amenities
    amenities = models.TextField(blank=True, help_text="Comma-separated amenities")

    # User and timestamps
    listed_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_available = models.BooleanField(default=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.title} - ₹{self.price}/month"

    @property
    def bedroom_display(self):
        return f"{self.bedroom_type}BHK"

    @property
    def amenities_list(self):
        return [
            amenity.strip() for amenity in self.amenities.split(",") if amenity.strip()
        ]
