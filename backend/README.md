# GROUP 11 – CONTACT MANAGEMENT SYSTEM (C++ BACKEND)

This is the C++17 REST API backend for the **Group 11 Contact Management System**, implementing key Data Structures & Algorithms (DSA) concepts and connecting to Google Cloud Firestore via REST API.

## Architecture

```
React Frontend (Port 5173)
       ↓  HTTP REST API
C++ Crow Backend (Port 8080)
       ↓  Business & DSA Layer (std::vector<Contact>, linear search, std::sort)
Firebase Firestore (NoSQL Document Database) / JSON Persistence Fallback
```

## DSA Concepts Demonstrated

1. **Structures (`struct Contact`)**: Plain Old Data structure aggregating contact properties (`id`, `name`, `phone`, `email`, `address`, `category`, `createdAt`, `updatedAt`).
2. **Strings (`std::string`)**: Phone numbers, names, and emails stored as strings to preserve formatting and leading zeroes.
3. **STL Containers (`std::vector<Contact>`)**: In-memory storage for sequential processing, iteration, searching, and sorting.
4. **Linear Search (`O(n)`)**: `searchByName()` and `searchByPhone()` iterate through `std::vector<Contact>` using `Utils::toLowerCase()` for case-insensitive matching.
5. **Alphabetical Sorting (`O(n log n)`)**: `sortContactsAlphabetically()` uses `std::sort()` with a custom lambda comparator.
6. **Functions & Modularization**: Clean separation into `ContactService`, `FirestoreService`, and `Utils`.

## API Endpoints

- `GET /api/health` - API health check
- `GET /api/contacts` - Fetch all contacts
- `GET /api/contacts/:id` - Fetch single contact details
- `POST /api/contacts` - Create new contact (validates duplicate phone)
- `PUT /api/contacts/:id` - Update contact details
- `DELETE /api/contacts/:id` - Delete contact
- `GET /api/contacts/search/name?name=...` - Case-insensitive name search
- `GET /api/contacts/search/phone?phone=...` - Phone substring search
- `GET /api/contacts/sort/name` - Sort contacts alphabetically A-Z

## Building and Running

```bash
mkdir build
cd build
cmake ..
cmake --build .
./bin/contact_backend
```
