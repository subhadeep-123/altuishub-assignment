from core.models import Apartment
from django.contrib.auth.models import User

apartments = [
    {
        "title": "2BHK near Salt Lake",
        "price": 22000,
        "bedroom_type": "2BHK",
        "location": "Salt Lake, Kolkata",
    },
    {
        "title": "3BHK in South City",
        "price": 28000,
        "bedroom_type": "3BHK",
        "location": "South City, Kolkata",
    },
    {
        "title": "1BHK in Behala",
        "price": 18000,
        "bedroom_type": "1BHK",
        "location": "Behala, Kolkata",
    },
    {
        "title": "2BHK in Howrah",
        "price": 20000,
        "bedroom_type": "2BHK",
        "location": "Howrah, West Bengal",
    },
    {
        "title": "3BHK near New Town",
        "price": 27000,
        "bedroom_type": "3BHK",
        "location": "New Town, Kolkata",
    },
    {
        "title": "1BHK near Garia",
        "price": 19000,
        "bedroom_type": "1BHK",
        "location": "Garia, Kolkata",
    },
    {
        "title": "2BHK in Dum Dum",
        "price": 24000,
        "bedroom_type": "2BHK",
        "location": "Dum Dum, Kolkata",
    },
    {
        "title": "3BHK in Rajarhat",
        "price": 26000,
        "bedroom_type": "3BHK",
        "location": "Rajarhat, Kolkata",
    },
    {
        "title": "1BHK in Barasat",
        "price": 17500,
        "bedroom_type": "1BHK",
        "location": "Barasat, Kolkata",
    },
    {
        "title": "2BHK near Sealdah",
        "price": 22500,
        "bedroom_type": "2BHK",
        "location": "Sealdah, Kolkata",
    },
]

for data in apartments:
    Apartment.objects.create(**data, listed_by=User)
