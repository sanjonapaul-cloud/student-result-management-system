# Student Result Management System

A full-stack MERN application for managing students, subjects, examinations, marks, and academic results. The system provides role-based access for administrators and students.

## Features

### Authentication and Authorization
- User registration and login
- JWT-based authentication
- Password hashing using bcrypt
- Role-based access control for Admin and Student

### Admin Module
- Dashboard with academic statistics
- Create, view, update, and delete student records
- Manage subjects
- Manage examinations
- Enter and update student marks
- Automatic percentage, grade, and pass/fail calculation
- View and manage examination results

### Student Module
- Student dashboard with academic statistics
- View personal profile
- View individual examination results
- Access marks, percentages, grades, and result status
- Students can only access their own results

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React.js, Vite, React Router, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcryptjs |
| API Testing | Postman |
| Version Control | Git, GitHub |

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

### 1. Clone the repository

```bash
git clone https://github.com/sanjonapaul-cloud/student-result-management-system.git
cd student-result-management-system
```

### 2. Configure the backend

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
```

Use your own MongoDB connection string and secure credentials. Never commit your `.env` file.

### 3. Create the Admin account

```bash
npm run create-admin
```

### 4. Start the backend

```bash
npm run dev
```

The backend runs at:

`http://localhost:5000`

### 5. Configure the frontend

Open a second terminal from the project root:

```bash
cd client
npm install
npm run dev
```

The frontend runs at:

`http://localhost:5173`

## API Overview

Base URL: `http://localhost:5000/api`

| Module | Endpoint | Purpose |
|---|---|---|
| Authentication | `/auth/register` | Student registration |
| Authentication | `/auth/login` | User login |
| Authentication | `/auth/me` | Get logged-in user |
| Students | `/students` | Student management |
| Subjects | `/subjects` | Subject management |
| Examinations | `/exams` | Examination management |
| Results | `/results` | Result management |
| Results | `/results/my-results` | View personal results |

Protected endpoints require a valid JWT access token. Administrative endpoints require the Admin role.

## Result Calculation

The application calculates:

- **Percentage:** Marks obtained divided by total marks, multiplied by 100.
- **Grade:** Assigned according to the configured percentage ranges.
- **Status:** Pass or Fail based on the examination's passing marks.

## Security and Data Integrity

- Passwords are hashed before storage.
- JWT authentication protects private routes.
- Role-based authorization restricts administrative operations.
- Students can access only their own results.
- Duplicate results for the same student and examination are prevented.
- Records with dependent data cannot be deleted.

## Developer

**Sanjona Paul**

GitHub: [sanjonapaul-cloud](https://github.com/sanjonapaul-cloud)

## Project Status

Core authentication, student management, subject management, examination management, result management, and role-based dashboards have been implemented and tested. Further improvements and deployment preparation are in progress.
