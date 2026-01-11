# Express User API

A Node.js Express.js REST API application that serves user data from static JSON files. This project includes two separate APIs: one for basic user information and another for detailed user profiles.

## Project Structure

```
API/
├── server.js                 # Main application entry point
├── package.json              # Project dependencies and scripts
├── controllers/
│   └── userController.js     # Business logic for user endpoints
├── routes/
│   └── userRoutes.js         # API route definitions
└── data/
    ├── basicUsers.json       # 20 basic user records
    └── detailedUsers.json    # 20 detailed user records
```

## Features

- **Two Separate APIs**:
  - **Basic Users API**: Simple user data with id, name, and email
  - **Detailed Users API**: Comprehensive user profiles with personal info, contact details, employment, preferences, and more

- **RESTful Endpoints**:
  - `GET /api/users` - Retrieve all basic users
  - `GET /api/users/:id` - Retrieve a single basic user by ID
  - `GET /api/users/details` - Retrieve all detailed users
  - `GET /api/users/details/:id` - Retrieve a single detailed user by ID

- **Proper HTTP Status Codes**:
  - `200` - Success
  - `404` - User not found
  - `400` - Invalid user ID
  - `500` - Server error

- **Clean Architecture**: Organized with separate routes, controllers, and data layers

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

## Installation

1. **Navigate to the project directory**:
   ```bash
   cd d:\projects\API
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

## Running the Application

### Option 1: Standard Mode
```bash
npm start
```

### Option 2: Development Mode (with auto-reload)
```bash
npm run dev
```

The server will start on `http://localhost:3000`

You should see output similar to:
```
Server is running on http://localhost:3000
Available endpoints:
  GET http://localhost:3000/api/users
  GET http://localhost:3000/api/users/:id
  GET http://localhost:3000/api/users/details
  GET http://localhost:3000/api/users/details/:id
```

## API Documentation

### Basic Users API

#### Get All Basic Users
```http
GET /api/users
```

**Response Example**:
```json
{
  "success": true,
  "count": 20,
  "data": [
    {
      "id": 1,
      "name": "Ahmed Hassan",
      "email": "ahmed.hassan@example.com"
    },
    ...
  ]
}
```

#### Get Basic User by ID
```http
GET /api/users/:id
```

**Parameters**:
- `id` (number) - User ID (1-20)

**Success Response (200)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Ahmed Hassan",
    "email": "ahmed.hassan@example.com"
  }
}
```

**Not Found Response (404)**:
```json
{
  "success": false,
  "error": "User not found",
  "message": "User with ID 99 does not exist"
}
```

### Detailed Users API

#### Get All Detailed Users
```http
GET /api/users/details
```

**Response Example**:
```json
{
  "success": true,
  "count": 20,
  "data": [
    {
      "id": 1,
      "personalInfo": {
        "firstName": "Ahmed",
        "lastName": "Hassan",
        "gender": "male",
        "dateOfBirth": "1995-08-21",
        "age": 30,
        "nationality": "Egyptian"
      },
      "contactInfo": {
        "email": "ahmed.hassan@example.com",
        "phone": "+20-101-234-5678",
        "alternatePhone": "+20-109-987-6543"
      },
      ...
    }
  ]
}
```

#### Get Detailed User by ID
```http
GET /api/users/details/:id
```

**Parameters**:
- `id` (number) - User ID (1-20)

**Success Response (200)**:
Returns the complete detailed user object with all fields.

**Not Found Response (404)**:
```json
{
  "success": false,
  "error": "User not found",
  "message": "Detailed user with ID 99 does not exist"
}
```

## Testing the API

### Using cURL

**Get all basic users**:
```bash
curl http://localhost:3000/api/users
```

**Get basic user by ID**:
```bash
curl http://localhost:3000/api/users/1
```

**Get all detailed users**:
```bash
curl http://localhost:3000/api/users/details
```

**Get detailed user by ID**:
```bash
curl http://localhost:3000/api/users/details/5
```

### Using Browser

Simply open your browser and navigate to:
- http://localhost:3000/api/users
- http://localhost:3000/api/users/1
- http://localhost:3000/api/users/details
- http://localhost:3000/api/users/details/1

### Using Postman or Thunder Client

1. Create a new GET request
2. Enter the endpoint URL (e.g., `http://localhost:3000/api/users`)
3. Send the request

## Data Schema

### Basic User Schema
```json
{
  "id": 1,
  "name": "Ahmed Hassan",
  "email": "ahmed.hassan@example.com"
}
```

### Detailed User Schema
```json
{
  "id": 1,
  "personalInfo": {
    "firstName": "Ahmed",
    "lastName": "Hassan",
    "gender": "male",
    "dateOfBirth": "1995-08-21",
    "age": 30,
    "nationality": "Egyptian"
  },
  "contactInfo": {
    "email": "ahmed.hassan@example.com",
    "phone": "+20-101-234-5678",
    "alternatePhone": "+20-109-987-6543"
  },
  "address": {
    "street": "12 Tahrir St",
    "city": "Cairo",
    "state": "Cairo",
    "country": "Egypt",
    "postalCode": "11511"
  },
  "employment": {
    "jobTitle": "Software Engineer",
    "department": "IT",
    "company": "Tech Corp",
    "yearsOfExperience": 5,
    "skills": ["Node.js", "Express", "MongoDB", "REST APIs"],
    "employmentType": "Full-time"
  },
  "account": {
    "username": "ahmedhassan",
    "role": "admin",
    "status": "active",
    "createdAt": "2022-03-15T10:30:00Z",
    "lastLogin": "2025-01-08T18:45:00Z"
  },
  "preferences": {
    "language": "en",
    "timezone": "Africa/Cairo",
    "notifications": {
      "email": true,
      "sms": false,
      "push": true
    }
  },
  "activity": {
    "loginCount": 152,
    "lastActions": [
      {
        "action": "LOGIN",
        "date": "2025-01-08T18:45:00Z"
      },
      {
        "action": "UPDATE_PROFILE",
        "date": "2025-01-02T12:10:00Z"
      }
    ]
  },
  "metadata": {
    "createdBy": "system",
    "updatedAt": "2025-01-08T18:46:00Z",
    "version": 3
  }
}
```

## Error Handling

The API includes comprehensive error handling:

- **Invalid ID Format**: Returns 400 with error message
- **User Not Found**: Returns 404 with descriptive message
- **File Read Errors**: Returns 500 with error details
- **Undefined Routes**: Returns 404 with route information

## Technologies Used

- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **File System (fs)**: Native Node.js module for reading JSON files
- **Path**: Native Node.js module for file path handling

## Development

### Adding More Users

1. Edit `data/basicUsers.json` or `data/detailedUsers.json`
2. Ensure each user has a unique numeric ID
3. Maintain the same schema structure
4. Restart the server to load new data

### Modifying Endpoints

1. Update route definitions in `routes/userRoutes.js`
2. Add/modify controller logic in `controllers/userController.js`
3. Restart the server

## License

ISC

## Author

Your Name

---

**Note**: This application uses static JSON files for data storage. For production use, consider integrating a proper database system.
