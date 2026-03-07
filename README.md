# 🎓 Course Enrollment Management System

A full-stack web application for managing student enrollments in courses. Built with Spring Boot, React, and MongoDB, this system provides a complete solution for educational institutions to manage students, courses, and enrollments efficiently.

![Java](https://img.shields.io/badge/Java-21-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.3-brightgreen)
![React](https://img.shields.io/badge/React-19.2.0-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Screenshots](#-screenshots)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### Student Management
- ✅ Register new students with personal details
- ✅ View all registered students
- ✅ Update student information
- ✅ Delete student records
- ✅ Search students by name or email
- ✅ Email uniqueness validation

### Course Management
- ✅ Add new courses with details (code, name, instructor, duration, fees)
- ✅ View all available courses
- ✅ Update course information
- ✅ Delete courses (only if no students enrolled)
- ✅ Search courses by name or instructor
- ✅ Real-time seat availability tracking

### Enrollment Management
- ✅ Enroll students in available courses
- ✅ View all enrollments with filtering
- ✅ View enrollments by student or course
- ✅ Withdraw students from courses
- ✅ Prevent duplicate enrollments
- ✅ Automatic seat management
- ✅ Enrollment status tracking (CONFIRMED/CANCELLED)

### Additional Features
- ✅ Responsive UI with Bootstrap 5
- ✅ Real-time data updates
- ✅ Comprehensive error handling
- ✅ Input validation on both frontend and backend
- ✅ RESTful API design
- ✅ CORS enabled for cross-origin requests

---

## 🛠 Tech Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Java | 21 | Programming Language |
| Spring Boot | 3.4.3 | Backend Framework |
| Spring Data MongoDB | 4.4.3 | Database Integration |
| Spring Web | 6.2.3 | REST API |
| Spring Validation | 6.2.3 | Input Validation |
| Maven | 3.9+ | Build Tool |
| MongoDB | Latest | NoSQL Database |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.0 | UI Framework |
| Vite | 7.3.1 | Build Tool |
| React Router DOM | 7.13.1 | Routing |
| Bootstrap | 5.3.8 | UI Components |
| React Bootstrap | 2.10.10 | React Bootstrap Components |
| Axios | 1.13.6 | HTTP Client |
| Bootstrap Icons | 1.13.1 | Icons |

---

## 🏗 Architecture

### Backend Architecture (Layered)
```
┌─────────────────────────────────────┐
│         Controller Layer            │  ← REST Endpoints
├─────────────────────────────────────┤
│          Service Layer              │  ← Business Logic
├─────────────────────────────────────┤
│        Repository Layer             │  ← Data Access
├─────────────────────────────────────┤
│          Model Layer                │  ← Domain Entities
└─────────────────────────────────────┘
```

### Frontend Architecture (Component-Based)
```
┌─────────────────────────────────────┐
│           App Component             │
├─────────────────────────────────────┤
│         Page Components             │
│  (Dashboard, Students, Courses,     │
│   Enrollments)                      │
├─────────────────────────────────────┤
│         Service Layer               │
│  (API Communication)                │
└─────────────────────────────────────┘
```

---

## 🌐 Website Structure
The web application exposes a simple navigation structure, mirroring the core features:

1. **Dashboard** – landing page with system metrics and quick links.
2. **Students** – manage student records (list, add, edit, delete).
3. **Courses** – view and maintain course catalog.
4. **Enrollments** – oversee student enrollments and statuses.

Each page is implemented under `Frontend/src/pages` and is reachable via the top navigation bar. This layout ensures a user-friendly flow between the main sections of the site.

---

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Java Development Kit (JDK)** 17 or higher
  - [Download JDK](https://www.oracle.com/java/technologies/downloads/)
  - Verify: `java -version`

- **Maven** 3.6 or higher
  - [Download Maven](https://maven.apache.org/download.cgi)
  - Verify: `mvn -version`

- **Node.js** 18 or higher
  - [Download Node.js](https://nodejs.org/)
  - Verify: `node -version`

- **MongoDB** 5.0 or higher
  - [Download MongoDB](https://www.mongodb.com/try/download/community)
  - Verify: `mongod --version`

- **Git** (for cloning the repository)
  - [Download Git](https://git-scm.com/downloads)
  - Verify: `git --version`

---

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/course-enrollment-system.git
cd course-enrollment-system
```

### 2. Backend Setup

#### Configure MongoDB Connection
Edit `Backend/src/main/resources/application.properties`:
```properties
spring.application.name=coursebooking
spring.data.mongodb.uri=mongodb://localhost:27017/coursebooking_db
server.port=8080
```

#### Install Dependencies
```bash
cd Backend
mvn clean install
```

### 3. Frontend Setup

#### Install Dependencies
```bash
cd Frontend
npm install
```

#### Configure API Base URL (if needed)
Edit `Frontend/src/services/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:8080/api';
```

---

## 🎯 Running the Application

### Step 1: Start MongoDB

#### Windows (as Service)
```powershell
net start MongoDB
```

#### Windows (Manual)
```powershell
mongod --dbpath "C:\data\db"
```

#### macOS/Linux
```bash
sudo systemctl start mongod
# or
mongod --dbpath /data/db
```

#### Docker
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Step 2: Start Backend Server

```bash
cd Backend
mvn spring-boot:run
```

**Expected Output:**
```
Started CoursebookingApplication in X.XXX seconds (JVM running for X.XXX)
```

The backend will be available at: `http://localhost:8080`

### Step 3: Start Frontend Development Server

```bash
cd Frontend
npm run dev
```

**Expected Output:**
```
VITE v7.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

The frontend will be available at: `http://localhost:5173`

---

## 📚 API Documentation

### Base URL
```
http://localhost:8080/api
```

### Student Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/students/register` | Register a new student |
| GET | `/students/all` | Get all students |
| GET | `/students/{id}` | Get student by ID |
| PUT | `/students/{id}` | Update student |
| DELETE | `/students/{id}` | Delete student |
| GET | `/students/search?keyword={keyword}` | Search students |

#### Example: Register Student
```bash
curl -X POST http://localhost:8080/api/students/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "1234567890"
  }'
```

### Course Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/courses/add` | Add a new course |
| GET | `/courses/all` | Get all courses |
| GET | `/courses/{courseNumber}` | Get course by course number |
| GET | `/courses/id/{id}` | Get course by ID |
| PUT | `/courses/{id}` | Update course |
| DELETE | `/courses/{id}` | Delete course |
| GET | `/courses/search?keyword={keyword}` | Search courses |

#### Example: Add Course
```bash
curl -X POST http://localhost:8080/api/courses/add \
  -H "Content-Type: application/json" \
  -d '{
    "courseNumber": "CS-101",
    "origin": "Introduction to Programming",
    "destination": "Dr. Smith",
    "departureTime": "2024-03-01T10:00:00",
    "totalSeats": 30,
    "price": 500.0
  }'
```

### Enrollment Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/enrollments/enroll` | Enroll a student |
| POST | `/enrollments/cancel/{id}` | Cancel enrollment |
| DELETE | `/enrollments/{id}` | Withdraw enrollment |
| GET | `/enrollments/all` | Get all enrollments |
| GET | `/enrollments/student/{studentId}` | Get enrollments by student |
| GET | `/enrollments/course/{courseId}` | Get enrollments by course |
| PUT | `/enrollments/{id}` | Update enrollment |

#### Example: Enroll Student
```bash
curl -X POST http://localhost:8080/api/enrollments/enroll \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "65e1abd...",
    "courseNumber": "CS-101",
    "passengerName": "John Doe"
  }'
```

### Standard Response Format
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

---

## 📁 Project Structure

```
course-enrollment-system/
├── Backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/example/coursebooking/
│   │       │       ├── config/              # Configuration classes
│   │       │       ├── controller/          # REST Controllers
│   │       │       ├── dto/                 # Data Transfer Objects
│   │       │       ├── exception/           # Exception handling
│   │       │       ├── model/               # Domain models
│   │       │       ├── repository/          # Data repositories
│   │       │       ├── service/             # Business logic
│   │       │       └── CoursebookingApplication.java
│   │       └── resources/
│   │           └── application.properties   # Configuration
│   ├── pom.xml                              # Maven dependencies
│   └── .gitignore
│
├── Frontend/
│   ├── public/                              # Static assets
│   ├── src/
│   │   ├── pages/                           # Page components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Customers.jsx               # Students page
│   │   │   ├── Flights.jsx                 # Courses page
│   │   │   └── Bookings.jsx                # Enrollments page
│   │   ├── services/
│   │   │   └── api.js                      # API service
│   │   ├── App.jsx                         # Main component
│   │   ├── main.jsx                        # Entry point
│   │   └── index.css                       # Global styles
│   ├── package.json                        # npm dependencies
│   ├── vite.config.js                      # Vite configuration
│   └── .gitignore
│
├── README.md                                # This file
└── Documentation/                           # Additional docs
    ├── API_VERIFICATION_REPORT.md
    ├── COMPILATION_FIXES.md
    ├── STARTUP_GUIDE.md
    └── TECH_STACK_VERIFICATION.md
```

---

## 📸 Screenshots

### Dashboard
![Dashboard](screenshots/dashboard.png)
*Overview of system statistics and metrics*

### Student Management
![Students](screenshots/students.png)
*Student directory with search and CRUD operations*

### Course Management
![Courses](screenshots/courses.png)
*Course catalog with availability tracking*

### Enrollment Management
![Enrollments](screenshots/enrollments.png)
*Enrollment center with filtering options*

---

## 🐛 Troubleshooting

### Backend Issues

#### Port 8080 Already in Use
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:8080 | xargs kill -9
```

#### MongoDB Connection Failed
- Ensure MongoDB is running: `mongod --version`
- Check connection string in `application.properties`
- Verify MongoDB is listening on port 27017

#### Compilation Errors
```bash
cd Backend
mvn clean install -U
```

### Frontend Issues

#### Port 5173 Already in Use
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5173 | xargs kill -9
```

#### Dependencies Not Installing
```bash
rm -rf node_modules package-lock.json
npm install
```

#### CORS Errors
- Verify backend is running on port 8080
- Check CORS configuration in `CorsConfig.java`

### Common Issues

#### 404 Errors
- **Cause:** Backend server not running
- **Solution:** Start backend with `mvn spring-boot:run`

#### "null null" in Student Names
- **Cause:** Old data in database
- **Solution:** Delete old students and create new ones

#### Search Not Working
- **Cause:** Backend not running or incorrect API endpoint
- **Solution:** Verify backend is running and check browser console for errors

---

## 🧪 Testing

### Backend Testing
```bash
cd Backend
mvn test
```

### Frontend Testing
```bash
cd Frontend
npm run test
```

### Manual Testing Checklist

#### Student Management
- [ ] Register a new student
- [ ] View all students
- [ ] Search for a student
- [ ] Update student information
- [ ] Delete a student
- [ ] Verify email uniqueness

#### Course Management
- [ ] Add a new course
- [ ] View all courses
- [ ] Search for a course
- [ ] Update course information
- [ ] Delete a course (without enrollments)
- [ ] Verify course number uniqueness

#### Enrollment Management
- [ ] Enroll a student in a course
- [ ] View all enrollments
- [ ] Filter enrollments by student
- [ ] Filter enrollments by course
- [ ] Withdraw a student from a course
- [ ] Verify duplicate enrollment prevention
- [ ] Verify seat availability updates

---

## 🚢 Deployment

### Backend Deployment

#### Build JAR File
```bash
cd Backend
mvn clean package
```

The JAR file will be created in `Backend/target/coursebooking-0.0.1-SNAPSHOT.jar`

#### Run JAR File
```bash
java -jar target/coursebooking-0.0.1-SNAPSHOT.jar
```

### Frontend Deployment

#### Build for Production
```bash
cd Frontend
npm run build
```

The production files will be in `Frontend/dist/`

#### Deploy to Netlify/Vercel
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variable: `VITE_API_URL=your-backend-url`

---

## 🔒 Security Considerations

- ✅ Input validation on both frontend and backend
- ✅ Email format validation
- ✅ Duplicate prevention (email, course number, enrollments)
- ✅ CORS configuration for cross-origin requests
- ⚠️ **TODO:** Add authentication and authorization
- ⚠️ **TODO:** Add JWT token-based security
- ⚠️ **TODO:** Add password encryption for users
- ⚠️ **TODO:** Add role-based access control (RBAC)

---

## 🎯 Future Enhancements

- [ ] User authentication and authorization
- [ ] Role-based access control (Admin, Teacher, Student)
- [ ] Email notifications for enrollments
- [ ] Payment integration for course fees
- [ ] Attendance tracking
- [ ] Grade management
- [ ] Report generation (PDF/Excel)
- [ ] Dashboard analytics with charts
- [ ] Course prerequisites management
- [ ] Waiting list for full courses
- [ ] Mobile application (React Native)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards
- Follow Java naming conventions (PascalCase for classes, camelCase for methods)
- Use meaningful variable and method names
- Add comments for complex logic
- Write unit tests for new features
- Update documentation as needed

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

---

## 🙏 Acknowledgments

- Spring Boot Documentation
- React Documentation
- MongoDB Documentation
- Bootstrap Documentation
- Stack Overflow Community

---

## 📞 Support

For support, email your-email@example.com or open an issue in the GitHub repository.

---

## 📊 Project Status

**Current Version:** 1.0.0

**Status:** ✅ Production Ready

**Last Updated:** March 2026

---

## 🔗 Links

- [Live Demo](https://your-demo-url.com) (if available)
- [API Documentation](https://your-api-docs-url.com) (if available)
- [Project Board](https://github.com/yourusername/course-enrollment-system/projects)
- [Issue Tracker](https://github.com/yourusername/course-enrollment-system/issues)

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

Made with ❤️ by Chandrakant.

</div>
