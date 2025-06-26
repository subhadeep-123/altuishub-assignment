from rest_framework import serializers
from .models import User, Product, Apartment


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"


class ApartmentSerializer(serializers.ModelSerializer):
    bedroom_display = serializers.ReadOnlyField()
    amenities_list = serializers.ReadOnlyField()
    listed_by_name = serializers.CharField(source="listed_by.name", read_only=True)
    days_ago = serializers.SerializerMethodField()

    class Meta:
        model = Apartment
        fields = [
            "id",
            "title",
            "description",
            "price",
            "bedroom_type",
            "bedroom_display",
            "property_type",
            "furnishing",
            "location",
            "city",
            "state",
            "pincode",
            "area_sqft",
            "bathrooms",
            "balcony",
            "parking",
            "amenities",
            "amenities_list",
            "listed_by",
            "listed_by_name",
            "created_at",
            "updated_at",
            "is_available",
            "days_ago",
        ]

    def get_days_ago(self, obj):
        from django.utils import timezone

        delta = timezone.now() - obj.created_at
        return delta.days


class ApartmentCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating and updating apartments with validation"""

    class Meta:
        model = Apartment
        fields = [
            "title",
            "description",
            "price",
            "bedroom_type",
            "property_type",
            "furnishing",
            "location",
            "city",
            "state",
            "pincode",
            "area_sqft",
            "bathrooms",
            "balcony",
            "parking",
            "amenities",
            "listed_by",
            "is_available",
        ]

    def validate_price(self, value):
        if value < 5000:
            raise serializers.ValidationError("Rent must be at least ₹5,000")
        if value > 500000:
            raise serializers.ValidationError("Rent cannot exceed ₹5,00,000")
        return value

    def validate_bedroom_type(self, value):
        if value not in ["1", "2", "3", "4"]:
            raise serializers.ValidationError("Invalid bedroom type")
        return value
