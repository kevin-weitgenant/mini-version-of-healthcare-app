# Healthcare Management System

🌐 **Live Website**: [https://mini-version-of-healthcare-app.vercel.app](https://mini-version-of-healthcare-app.vercel.app)

A full-stack healthcare application that allows patients to register, book appointments with doctors, view treatment plans, and track their health progress.

**Deployment:**
- **Frontend**: Deployed on Vercel
- **Backend**: Deployed on Railway

## 🏥 Features

### Authentication
- **Patient Registration**: Create account with name, email, and password
- **Secure Login**: JWT-based authentication with email and password
- **Protected Routes**: Automatic redirection to dashboard after login

### Appointment Management
- **Doctor Selection**: View available doctors with specialties and ratings
- **Appointment Booking**: Schedule appointments with date, time, and visit reason
- **Appointment History**: View all booked appointments with status tracking

### Treatment Plans
- **Auto-generated Plans**: Sample treatment plans created after appointment booking
- **Comprehensive Details**: Includes diagnosis, medications, lifestyle advice, and doctor notes
- **Medicine Management**: Detailed medication information with dosage and frequency

### Health Tracking
- **Progress Monitoring**: Track pain levels (1-10) and energy levels (1-10)
- **Personal Notes**: Add detailed notes for each tracking entry
- **Historical Data**: View all tracking entries with timestamps
- **Visual Analytics**: Charts and graphs for health progress visualization

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 with React 19
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Query for server state, React useState for client state
- **UI Components**: Radix UI primitives with custom styling
- **Data Fetching**: React Query (TanStack Query) for efficient server state management
- **API Architecture**: Centralized API client pattern with custom hooks

### Backend
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT tokens with bcrypt password hashing


### Database
- **PostgreSQL**: Primary database with timezone-aware timestamps
- **ORM**: Drizzle ORM with type-safe queries
- **Migrations**: Automated schema management

## 📁 Project Structure

```
├── frontend-health-app/          # Next.js frontend application
│   ├── app/                     # Next.js app router pages
│   ├── components/              # Reusable React components
│   ├── api/                     # API client and React Query hooks
│   ├── hooks/                   # Custom React hooks
│   └── lib/                     # Utility functions and configurations
├── backend/                     # Express.js backend application
│   ├── src/
│   │   ├── routes/              # API route handlers
│   │   ├── db/                  # Database schema and configurations
│   │   ├── middleware/          # Authentication middleware
│   │   ├── utils/               # Utility functions
│   │   └── types/               # TypeScript type definitions
│   ├── drizzle/                 # Database migrations
│   └── scripts/                 # Database seeding and health check scripts
└── tests/                       # HTTP test files for API endpoints
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd assignment
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend-health-app
   npm install
   ```

3. **Database Setup**
   ```bash
   # Navigate to backend directory
   cd ../backend
   
   # Create a .env file with your database credentials
   cp .env.example .env
   # Edit .env with your PostgreSQL connection details
   
   # Run database migrations
   npm run db:migrate
   
   # Seed the database with sample doctors
   npm run db:seed
   ```

4. **Environment Configuration**
   
   Create `.env` files in both directories:
   
   **Backend (.env)**:
   ```env
   DATABASE_URL=postgresql://your_username:your_password@localhost:5432/your_database_name
   JWT_SECRET=your-super-secure-secret-key-here
   PORT=3001
   ```
   
   **Frontend (.env.local)**:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```
   Backend will be available at `http://localhost:3001`

2. **Start the frontend application**
   ```bash
   cd frontend-health-app
   npm run dev
   ```
   Frontend will be available at `http://localhost:3000`

## 📊 API Endpoints

### Authentication
- `POST /auth/register` - Register a new patient
- `POST /auth/login` - Login with email and password

### Doctors
- `GET /doctors` - Get list of available doctors

### Appointments
- `GET /appointments` - Get user's appointments
- `POST /appointments` - Book a new appointment

### Treatment Plans
- `GET /treatment-plans` - Get user's treatment plans
- `POST /treatment-plans` - Create a new treatment plan

### Health Tracking
- `GET /track` - Get health tracking entries
- `POST /track` - Add a new tracking entry

## 🧪 Testing

The project includes HTTP test files for all API endpoints. You can test the API using tools like REST Client or Postman:

```bash
# Navigate to the tests directory
cd backend/tests

# Use the .http files to test endpoints:
# - auth.http (authentication endpoints)
# - doctors.http (doctor endpoints)
# - appointments.http (appointment endpoints)
# - treatment-plans.http (treatment plan endpoints)
# - track.http (health tracking endpoints)
```

## 🗄️ Database Schema

The application uses the following main tables:

- **users**: Patient accounts with authentication details
- **doctors**: Available doctors with specialties and ratings
- **appointments**: Scheduled appointments with timezone support
- **treatment_plans**: Generated treatment plans with medications
- **health_tracking**: Patient health progress tracking



## 🎨 UI Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern Components**: shadcn/ui component library
- **Dark/Light Mode**: Theme switching capability
- **Interactive Charts**: Health progress visualization with Recharts
- **Form Validation**: Real-time validation with helpful error messages

## 🔧 Development Scripts

### Backend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Drizzle Studio

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📝 Assignment Requirements

This project fulfills all the core requirements specified in the assignment:

✅ **Authentication**: Patient registration and login with JWT  
✅ **Appointment Booking**: Doctor selection and appointment scheduling  
✅ **Treatment Plans**: Auto-generated sample treatment plans  
✅ **Health Tracking**: Pain/energy level tracking with notes  
✅ **Modern Tech Stack**: Next.js, Express.js, PostgreSQL  
✅ **Clean Architecture**: Separate frontend and backend folders  



