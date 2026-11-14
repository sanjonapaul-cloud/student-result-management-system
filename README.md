# Student Result Management System

A full-stack MERN application for managing students, subjects, examinations, marks, and academic results. The system provides role-based access for administrators and students, along with academic performance analytics and student-specific performance insights.

## Live Application

- **Frontend:** https://student-result-management-system-eight.vercel.app/
- **Backend:** Deployed on Render
- **GitHub Repository:** https://github.com/sanjonapaul-cloud/student-result-management-system

## Features

### Authentication and Authorization
- User registration and login
- JWT-based authentication
- Password hashing using bcrypt
- Role-based access control for Admin and Student
- Protected routes and API endpoints

### Admin Module
- Dashboard with academic statistics
- Create, view, update, and delete student records
- Manage subjects
- Manage examinations
- Enter and update student marks
- Automatic percentage, grade, and pass/fail calculation
- View and manage examination results

### Academic Performance Analytics (Admin)
- Overall average percentage
- Overall pass rate
- Passed and failed result counts
- Grade distribution across A+, A, B, C, D, E, and F
- Subject-wise average percentage
- Subject-wise pass rate and recorded result counts
- Identification of highest- and lowest-performing subjects

### Student Module
- Student dashboard with academic statistics
- View personal profile
- View individual examination results
- Access marks, percentages, grades, and result status
- Students can only access their own results

### Student Performance Insights
- Individual average percentage
- Strongest-performing subject
- Examination-wise performance trend
- Total passed and failed results

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React.js, Vite, React Router, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcryptjs |
| API Testing | Postman |
| Version Control | Git, GitHub |
| Frontend Deployment | Vercel |
| Backend Deployment | Render |

## Project Structure

```text
student-result-management-system/
├── client/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       └── services/
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── services/
│   └── utils/
└── README.md
```

## Getting Started

### Prerequisites

- Node.js and npm
- MongoDB Atlas account or a local MongoDB instance
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/sanjonapaul-cloud/student-result-management-system.git
cd student-result-management-system
```

### 2. Configure the Backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret

ADMIN_NAME=System Administrator
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_secure_admin_password

CLIENT_URL=http://localhost:5173
```

Use your own MongoDB connection string and secure credentials. Never commit your `.env` file.

### 3. Create the Admin Account

```bash
npm run create-admin
```

### 4. Start the Backend

```bash
npm run dev
```

The backend runs at:

`http://localhost:5000`

### 5. Configure the Frontend

Open a second terminal from the project root:

```bash
cd client
npm install
```

Create a `.env` file inside the `client` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

### 6. Start the Frontend

```bash
npm run dev
```

The frontend runs at:

`http://localhost:5173`

## API Overview

Base URL:

`http://localhost:5000/api`

| Module | Endpoint | Access | Purpose |
|---|---|---|---|
| Authentication | `POST /auth/register` | Public | Student registration |
| Authentication | `POST /auth/login` | Public | User login |
| Authentication | `GET /auth/me` | Authenticated | Get logged-in user |
| Students | `/students` | Admin | Student management |
| Subjects | `/subjects` | Admin | Subject management |
| Examinations | `/exams` | Admin | Examination management |
| Results | `/results` | Admin | Result management |
| Results | `GET /results/my-results` | Student | View personal results |
| Analytics | `GET /analytics/overview` | Admin | Overall academic analytics |
| Analytics | `GET /analytics/subjects` | Admin | Subject-wise performance analytics |
| Analytics | `GET /analytics/student` | Student | Individual performance insights |

Protected endpoints require a valid JWT access token. Administrative endpoints require the Admin role, while student-specific endpoints restrict access to the authenticated student.

## Result Calculation

The application automatically calculates:

- **Percentage:** Marks obtained divided by total marks, multiplied by 100.
- **Grade:** Assigned according to the following percentage ranges.

| Percentage | Grade |
|---|---|
| 90% and above | A+ |
| 80% – below 90% | A |
| 70% – below 80% | B |
| 60% – below 70% | C |
| 50% – below 60% | D |
| 40% – below 50% | E |
| Below 40% | F |

- **Status:** Pass or Fail based on whether marks obtained meet the examination's passing marks.

Grade and pass/fail status are calculated independently.

## Analytics Calculations

- **Average Percentage:** Average of the recorded result percentages.
- **Pass Rate:** Passed results divided by total recorded results, multiplied by 100.
- **Grade Distribution:** Number of recorded results in each grade category.
- **Subject-wise Performance:** Average percentage and pass rate calculated using recorded results for each subject.
- **Student Performance Trend:** Examination-wise percentages, grades, and result statuses displayed chronologically.

## Security and Data Integrity

- Passwords are hashed before storage.
- JWT authentication protects private routes.
- Role-based authorization restricts administrative operations.
- Students can access only their own results.
- Duplicate results for the same student and examination are prevented.
- Records with dependent data cannot be deleted.
- Input validation protects examination and result data integrity.

## Deployment

The application is deployed using:

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas

The backend provides a health-check endpoint:

`/api/health`

## Developer

**Sanjona Paul**

GitHub: https://github.com/sanjonapaul-cloud

## Project Status

The Student Result Management System has been implemented and deployed successfully.

Core modules include authentication, student management, subject management, examination management, result management, academic performance analytics, and student performance insights.

The application has undergone local testing, production builds, deployment verification, role-based access testing, and live functional testing.
