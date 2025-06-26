from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django_filters import rest_framework as django_filters
from django.db.models import Q, Avg
from django.db import models
from .models import User, Product, Apartment
from .serializers import (
    UserSerializer,
    ProductSerializer,
    ApartmentSerializer,
    ApartmentCreateUpdateSerializer,
)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class ApartmentFilter(django_filters.FilterSet):
    price_min = django_filters.NumberFilter(field_name="price", lookup_expr="gte")
    price_max = django_filters.NumberFilter(field_name="price", lookup_expr="lte")
    bedrooms = django_filters.MultipleChoiceFilter(
        field_name="bedroom_type", choices=Apartment.BEDROOM_CHOICES
    )
    property_type = django_filters.ChoiceFilter(choices=Apartment.PROPERTY_TYPE_CHOICES)
    furnishing = django_filters.ChoiceFilter(choices=Apartment.FURNISHING_CHOICES)
    city = django_filters.CharFilter(lookup_expr="icontains")
    location = django_filters.CharFilter(lookup_expr="icontains")
    parking = django_filters.BooleanFilter()

    class Meta:
        model = Apartment
        fields = [
            "price_min",
            "price_max",
            "bedrooms",
            "property_type",
            "furnishing",
            "city",
            "location",
            "parking",
            "is_available",
        ]


class ApartmentViewSet(viewsets.ModelViewSet):
    queryset = Apartment.objects.filter(is_available=True)
    serializer_class = ApartmentSerializer
    filter_backends = [
        DjangoFilterBackend,
        filters.OrderingFilter,
        filters.SearchFilter,
    ]
    filterset_class = ApartmentFilter
    ordering_fields = ["price", "created_at", "updated_at", "bedroom_type", "area_sqft"]
    ordering = ["-created_at"]  # Default ordering
    search_fields = ["title", "location", "city", "description", "amenities"]

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return ApartmentCreateUpdateSerializer
        return ApartmentSerializer

    def get_queryset(self):
        queryset = super().get_queryset()

        # Custom filtering for rent range 15000-25000 as specified in requirements
        budget_range = self.request.query_params.get("budget_range")
        if budget_range == "affordable":
            queryset = queryset.filter(price__gte=15000, price__lte=25000)

        # Multi-level sorting
        sort_by = self.request.query_params.get("sort")
        if sort_by == "price_date":
            queryset = queryset.order_by("price", "-created_at")
        elif sort_by == "newest_first":
            queryset = queryset.order_by("-created_at")
        elif sort_by == "price_low_high":
            queryset = queryset.order_by("price")
        elif sort_by == "price_high_low":
            queryset = queryset.order_by("-price")

        return queryset

    @action(detail=False, methods=["get"])
    def featured(self, request):
        """Get featured apartments - recently added and reasonably priced"""
        featured_apartments = self.queryset.filter(
            price__gte=15000, price__lte=25000, bedroom_type__in=["1", "2", "3"]
        ).order_by("-created_at")[:10]

        serializer = self.get_serializer(featured_apartments, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def stats(self, request):
        """Get statistics about available apartments"""
        total_count = self.queryset.count()
        avg_price = self.queryset.aggregate(avg_price=Avg("price"))["avg_price"] or 0

        bedroom_stats = {}
        for choice in Apartment.BEDROOM_CHOICES:
            bedroom_stats[choice[1]] = self.queryset.filter(
                bedroom_type=choice[0]
            ).count()

        return Response(
            {
                "total_apartments": total_count,
                "average_price": round(avg_price, 2),
                "bedroom_distribution": bedroom_stats,
            }
        )

    @action(detail=True, methods=["post"])
    def toggle_availability(self, request, pk=None):
        """Toggle apartment availability"""
        apartment = self.get_object()
        apartment.is_available = not apartment.is_available
        apartment.save()

        return Response(
            {
                "message": f'Apartment availability updated to {"Available" if apartment.is_available else "Not Available"}',
                "is_available": apartment.is_available,
            }
        )

    def perform_create(self, serializer):
        """Set the listed_by field to the current user when creating"""
        # For now, we'll use the first user. In a real app, this would be request.user
        first_user = User.objects.first()
        if not first_user:
            # Create a default user if none exists
            first_user = User.objects.create(
                name="Default User", email="default@example.com"
            )
        serializer.save(listed_by=first_user)
