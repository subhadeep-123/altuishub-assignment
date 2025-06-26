# Real Estate Portal - Product Catalogue

A simple real estate portal built with Django REST Framework and React for apartment listings management.

## Project Overview

This is a full-stack web application that allows users to browse, filter, and manage apartment listings. The application includes both backend API and frontend interface.

## Features

- **CRUD Operations**: Create, Read, Update, Delete apartment listings
- **Filtering**: Filter apartments by price range, bedrooms, and location
- **Sorting**: Sort listings by price and date
- **Pagination**: Browse through listings with pagination
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

### Backend
- Django 5.2.3
- Django REST Framework
- SQLite Database

### Frontend
- React 19.1.0
- Axios for API calls
- Tailwind CSS for styling
- Vite for development

## Project Structure

```
application/
├── backend/productCatalog/     # Django backend
│   ├── core/                   # Main app with models, views, serializers
│   └── productCatalog/         # Project settings
├── frontend/                   # React frontend
│   └── src/
└── requirements.txt           # Python dependencies
```

## Setup Instructions

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend/productCatalog
   ```

2. Install dependencies:
   ```bash
   pip install -r ../../requirements.txt
   ```

3. Run migrations:
   ```bash
   python manage.py migrate
   ```

4. Start server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

## API Endpoints

- `GET /api/apartments/` - List all apartments
- `POST /api/apartments/` - Create new apartment
- `GET /api/apartments/{id}/` - Get apartment details
- `PUT /api/apartments/{id}/` - Update apartment
- `DELETE /api/apartments/{id}/` - Delete apartment

### Query Parameters
- `search` - Search in title and location
- `price_min` - Minimum price filter
- `price_max` - Maximum price filter
- `bedrooms` - Filter by number of bedrooms
- `ordering` - Sort by price or date

## Usage

1. Start both backend and frontend servers
2. Open http://localhost:5173 in your browser
3. Browse apartment listings
4. Use filters to find specific apartments
5. Create, edit, or delete listings as needed

## Assignment Requirements Met

- ✅ Apartments for rent in India
- ✅ Price range filtering (₹15,000 - ₹25,000)
- ✅ Bedroom filtering (1, 2, 3 BHK)
- ✅ Sorting by newest first
- ✅ Complete CRUD operations
- ✅ Backend and frontend integration

## Dependencies

See `requirements.txt` for Python dependencies and `package.json` for Node.js dependencies. 