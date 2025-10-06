# Full Stack Developer Intern Assignment

## Objective

Build a **mini version of healthcare app** that allows patients to log in, book an appointment, view a sample treatment plan, and update their health progress.

**Duration:** ASAP

---

## Tech Stack (Flexible)

- **Frontend:** React.js / Next.js
- **Backend:** Node.js (Express.js) / Django
- **Database:** MongoDB / PostgreSQL
- **Authentication:** JWT
- **Styling:** TailwindCSS or basic CSS
- **Version Control:** GitHub

---

## Core Requirements

### 1. Authentication

- **Register:** Patient creates an account (Name, Email, Password).
- **Login:** Email & Password authentication using JWT.
- After login, redirect to **Dashboard**.

### 2. Appointment Booking

Patients can:
- View list of available doctors (hardcoded or from backend).
- Book an appointment with:
  - Doctor Name
  - Date
  - Time

**Backend Routes:**
- `GET /doctors` – Get doctor list
- `POST /appointment` – Book appointment
- `GET /appointments` – View booked appointments

### 3. Treatment Plan (Mock)

After booking, show a **sample treatment plan** (auto-generated). Example:

```json
{
  "diagnosis": "Migraine",
  "recommended_medicines": ["Medicine A", "Medicine B"],
  "lifestyle_advice": "Drink more water, sleep early"
}
```

**Frontend:**
- Display treatment plan on the dashboard.

### 4. Patient Tracking

Add a simple health tracking form:
- Pain Level (1–10)
- Energy Level (1–10)
- Notes

Show a list of all tracking entries below the form.

**Backend Routes:**
- `POST /track` – Add a tracking entry
- `GET /track` – Fetch all tracking entries for logged-in user

---

## Expected Deliverables

- GitHub repo with:
  - `/frontend` and `/backend` folders
  - Working instructions in **README.md**
- Deployed version of the web app