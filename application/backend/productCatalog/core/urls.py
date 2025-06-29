from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, ProductViewSet, ApartmentViewSet

router = DefaultRouter()
router.register(r"users", UserViewSet)
router.register(r"products", ProductViewSet)
router.register(r"apartments", ApartmentViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
