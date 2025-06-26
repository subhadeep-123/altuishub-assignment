from django.db import models


class User(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)


class Product(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)


class Apartment(models.Model):
    BEDROOM_CHOICES = [
        ("1BHK", "1 Bedroom"),
        ("2BHK", "2 Bedroom"),
        ("3BHK", "3 Bedroom"),
    ]
    title = models.CharField(max_length=255)
    price = models.IntegerField()
    bedroom_type = models.CharField(choices=BEDROOM_CHOICES, max_length=5)
    location = models.CharField(max_length=255)
    listed_by = models.ForeignKey(User, on_delete=models.CASCADE)
