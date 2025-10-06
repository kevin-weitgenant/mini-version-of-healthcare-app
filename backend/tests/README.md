# REST API Tests

This directory contains minimalistic REST tests for all API endpoints using the VS Code REST Client extension format.

## Setup

1. **Install VS Code REST Client Extension**: 
   - Open VS Code
   - Go to Extensions (Ctrl+Shift+X)
   - Search for "REST Client" by Huachao Mao
   - Install it

2. **Start your backend server**:
   ```bash
   npm run dev
   ```
   Server will run on http://localhost:5000

3. **Update tokens**: 
   - First run the auth tests to get a valid token
   - Replace `YOUR_TOKEN_HERE` in the test files with the actual token

## Test Files

### `auth.http`
Tests authentication endpoints:
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login  
- `GET /api/auth/me` - Get current user

### `doctors.http`
Tests doctor endpoints:
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get doctor by ID

### `appointments.http`
Tests appointment endpoints:
- `GET /api/appointments` - Get user's appointments
- `POST /api/appointments` - Create new appointment

### `treatment-plans.http`
Tests treatment plan endpoints:
- `GET /api/treatment-plans` - Get all user's treatment plans
- `GET /api/treatment-plans/:appointmentId` - Get treatment plan by appointment ID

### `track.http`
Tests health tracking endpoints:
- `GET /api/track` - Get all health tracking entries
- `POST /api/track` - Create new health tracking entry

## How to Run Tests

1. **Open any `.http` file** in VS Code
2. **Click "Send Request"** above each request
3. **View response** in the right panel

## Test Scenarios Covered

Each file includes tests for:
- ✅ **Happy path** - Valid requests with expected responses
- ❌ **Error cases** - Invalid data, missing fields, unauthorized access
- 🔐 **Authentication** - Protected endpoints with/without valid tokens
- 📝 **Validation** - Input validation for required fields and data types

## Tips

- Run auth tests first to get a valid token
- Copy the token from login response to other test files
- Some tests depend on existing data (doctors, appointments) - make sure your database is seeded
- Check server console for detailed error logs
- Use the "Send Request" button above each request line

## Expected Response Format

All endpoints return JSON with this structure:
```json
{
  "ok": true|false,
  "error": "Error message (if ok: false)",
  "data": "Response data (if ok: true)"
}
```

## Authentication

Protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

Get a token by calling the login endpoint first.
