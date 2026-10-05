# GROUP 11 – CONTACT MANAGEMENT SYSTEM

**A Full-Stack College Data Structures & Algorithms (DSA) Project**

This application is a complete, production-ready Contact Management System built with a **React.js Frontend**, a **C++17 Crow REST API Backend**, and **Google Cloud Firebase Firestore** (NoSQL Database) with persistent fallback.

---

## 1. Project Architecture

```
                               ┌────────────────────────────────┐
                               │     React.js Web Frontend      │
                               │   (Dashboard, Table, Cards)    │
                               └───────────────┬────────────────┘
                                               │ HTTP REST API (JSON)
                                               ▼
                               ┌────────────────────────────────┐
                               │       C++ REST API Server      │
                               │     (Crow Framework, C++17)    │
                               └───────────────┬────────────────┘
                                               │
                                               ▼
                               ┌────────────────────────────────┐
                               │   C++ Business & DSA Layer     │
                               │ (ContactService & std::vector) │
                               └───────────────┬────────────────┘
                                               │
                                               ▼
                               ┌────────────────────────────────┐
                               │   Firestore Database Layer     │
                               │   (FirestoreService / NoSQL)   │
                               └────────────────────────────────┘
```

> **Security & Layering Enforcement:**
> - The React frontend **never** connects directly to Firebase or exposes credentials.
> - The C++ backend performs all validation, searching, sorting, and database communications.

---

## 2. Directory Structure

```
.
├── backend/
│   ├── include/
│   │   ├── Contact.h           # Contact struct definition & JSON serialization
│   │   ├── ContactService.h    # Business logic & DSA algorithms header
│   │   ├── FirestoreService.h  # Database REST communication header
│   │   └── Utils.h             # Utility & string manipulation header
│   ├── src/
│   │   ├── main.cpp            # Crow REST API endpoints & CORS handler
│   │   ├── ContactService.cpp  # DSA implementation (search, sort, validation)
│   │   ├── FirestoreService.cpp# Firestore REST API & JSON persistence fallback
│   │   └── Utils.cpp           # String lowercase, trim, & validation logic
│   ├── CMakeLists.txt          # CMake build configuration
│   ├── .env.example            # Environment variable template
│   └── README.md               # Backend specific documentation
├── frontend/
│   ├── src/
│   │   ├── components/         # Modular UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── ContactTable.jsx
│   │   │   ├── ContactCard.jsx
│   │   │   ├── ContactForm.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── SearchFilters.jsx
│   │   │   ├── DeleteModal.jsx
│   │   │   ├── DeleteConfirmationModal.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── LoadingState.jsx
│   │   │   ├── ErrorMessage.jsx
│   │   │   └── Toast.jsx
│   │   ├── pages/              # Views
│   │   │   ├── Dashboard.jsx
│   │   │   ├── AddContact.jsx
│   │   │   └── ContactDetails.jsx
│   │   ├── services/
│   │   │   └── contactApi.js   # Centralized Axios API service layer
│   │   ├── styles/
│   │   │   └── index.css       # Modern dark glassmorphic styling
│   │   ├── App.jsx             # Main application orchestrator
│   │   └── main.jsx            # Vite React entrypoint
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
├── .gitignore
└── README.md
```

---

## 3. Technology Stack

- **Frontend:** React 18, Vite, JavaScript (ES6+), CSS3 (Modern Glassmorphic Dark Theme), Axios, Lucide React Icons.
- **Backend:** C++17, Crow C++ REST Framework, `nlohmann/json`, `libcurl` / HTTP client, CMake 3.14+.
- **Database:** Firebase Firestore REST API (NoSQL Document Database) with automatic persistent JSON fallback mode.

---

## 4. Setup and Installation

### Prerequisites
- Node.js (v18 or newer) and npm
- C++17 Compiler (GCC / MinGW-w64 / Clang / MSVC)
- CMake (v3.14 or newer)

---

### Step A: Setting Up Environment Variables

1. **Backend Environment Setup:**
   ```bash
   cd backend
   cp .env.example .env
   ```
   *Edit `backend/.env` with your Firebase Project ID and Web API Key:*
   ```env
   PORT=8080
   FIREBASE_PROJECT_ID=your-firebase-project-id
   FIREBASE_API_KEY=AIzaSyYourApiKeyHere
   ```
   *(Note: If left empty, the backend automatically uses persistent local JSON storage in `backend/data/contacts_db.json` so you can test immediately!)*

2. **Frontend Environment Setup:**
   ```bash
   cd ../frontend
   cp .env.example .env
   ```
   *Contents of `frontend/.env`:*
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api
   ```

---

### Step B: Building and Running the C++ Backend

```bash
cd backend
mkdir build
cd build
cmake ..
cmake --build . --config Release
```

Run the backend executable:
- **On Linux/macOS:** `./bin/contact_backend`
- **On Windows:** `.\bin\Release\contact_backend.exe` or `.\bin\contact_backend.exe`

The backend will start listening on **`http://localhost:8080`**.

---

### Step C: Installing and Running the React Frontend

Open a new terminal window:

```bash
cd frontend
npm install
npm run dev
```

The frontend web dashboard will open on **`http://localhost:5173`**.

---

## 5. REST API Documentation

| Method | Endpoint | Description | Status Codes |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/health` | Health Check | `200 OK` |
| **GET** | `/api/contacts` | Fetch all contacts | `200 OK` |
| **GET** | `/api/contacts/:id` | Fetch single contact | `200 OK`, `404 Not Found` |
| **POST** | `/api/contacts` | Add new contact | `201 Created`, `400 Bad Request`, `409 Conflict` |
| **PUT** | `/api/contacts/:id` | Update contact details | `200 OK`, `400 Bad Request`, `404 Not Found`, `409 Conflict` |
| **DELETE** | `/api/contacts/:id` | Delete contact | `200 OK`, `404 Not Found` |
| **GET** | `/api/contacts/search/name?name=rahul` | Case-insensitive linear search by name | `200 OK` |
| **GET** | `/api/contacts/search/phone?phone=9876` | Partial/exact search by phone | `200 OK` |
| **GET** | `/api/contacts/sort/name` | Sort contacts alphabetically A-Z | `200 OK` |

---

## 6. DSA Concepts Demonstrated (College Viva Guide)

### A. STRUCTURES (`struct Contact`)
- **Concept:** A user-defined structure `struct Contact` aggregates multiple data fields (`id`, `name`, `phone`, `email`, `address`, `category`, `createdAt`, `updatedAt`).
- **Why `struct`?** In C++, a `struct` provides lightweight contiguous memory layout with default public accessors, making it ideal for Data Transfer Objects (DTOs).

### B. STRINGS (`std::string`)
- **Concept:** String manipulation using `std::string`.
- **Why `std::string` for Phone Numbers?** Phone numbers are numerical identifiers that can have leading zeroes (e.g. `09876543210`), international prefixes (`+91`), or formatting dashes. Storing them as integers would strip leading zeroes and fail on special characters.

### C. STL CONTAINERS (`std::vector<Contact>`)
- **Concept:** In-memory collection management via `std::vector<Contact>`.
- **Why `std::vector`?** Provides contiguous dynamic array storage with \\(O(1)\\) random access and sequential memory cache line friendliness during linear searches and sorting.

### D. SEARCHING ALGORITHMS
- **Linear Search by Name \\(O(n)\\):** Traverses `std::vector<Contact>`, converts string fields to lowercase via `Utils::toLowerCase()`, and performs substring matching.
- **Linear Search by Phone \\(O(n)\\):** Traverses `std::vector<Contact>` to match exact or partial phone digits.
- **Time Complexity:** \\(O(n \cdot m)\\) where \\(n\\) is contact count and \\(m\\) is query length.

### E. SORTING ALGORITHMS
- **Alphabetical Sorting \\(O(n \log n)\\):** Implemented via `std::sort()` with custom lambda comparator:
  ```cpp
  std::sort(contacts.begin(), contacts.end(), [](const Contact& a, const Contact& b) {
      return Utils::toLowerCase(a.name) < Utils::toLowerCase(b.name);
  });
  ```
- **Time Complexity:** \\(O(n \log n)\\) using introspective sort.

### F. INPUT VALIDATION & EDGE CASE HANDLING
- **Duplicate Phone Number Check:** Prevents duplicate phone entries by performing an \\(O(n)\\) duplicate search prior to inserting or updating. Returns `HTTP 409 Conflict`.
- **Field Validation:** Rejects empty names, empty phone numbers, malformed emails, and invalid phone digit lengths with `HTTP 400 Bad Request`.

---

## 7. Step-by-Step Demo Sequence for Evaluators

Follow this 10-step demo script during your college evaluation:

1. **Step 1 (Launch & Dashboard):** Open `http://localhost:5173`. Show the real-time C++ API status badge and live statistics breakdown.
2. **Step 2 (Add Contact):** Click **+ Add Contact**, enter `Rahul Sharma`, phone `9876543210`, category `Friends`. Click Save.
3. **Step 3 (Firestore Sync):** Show that the contact appears in the table and is saved in Firestore / JSON storage.
4. **Step 4 (Multiple Additions):** Add contacts `Preetham Reddy` (`9876543211`), `Ananya Verma` (`9876543212`), `Zoya Khan` (`9876543214`).
5. **Step 5 (Search by Name):** Select **Search Name ▼**, type `rahul`. Demonstrate case-insensitivity matching `Rahul Sharma`.
6. **Step 6 (Search by Phone):** Select **Search Phone ▼**, type `9876`. Show partial substring matches.
7. **Step 7 (Update Contact):** Edit `Rahul Sharma`'s address to `Hyderabad`. Verify instant updates.
8. **Step 8 (Sort A-Z):** Click **Sort A-Z**. Demonstrate `std::sort()` returning contacts in alphabetical order: Ananya -> Preetham -> Rahul -> Zoya.
9. **Step 9 (Edge Case 1 - Duplicate Phone):** Try adding a contact with existing phone `9876543210`. Verify the error message: *"A contact with this phone number already exists"* (`HTTP 409`).
10. **Step 10 (Edge Case 2 - Delete Contact):** Click **Delete** on a contact. Confirm in the modal. Verify deletion.

---

## 8. Team Details

- **Project:** Contact Management System
- **Group:** Group 11
- **Course:** Data Structures & Algorithms (DSA)
- **Year/Semester:** 2026 Academic Session
