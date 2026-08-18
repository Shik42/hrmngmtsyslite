# HRMS – Human Resource Management System

HRMS is a full-stack Human Resource Management System designed to streamline employee management, leave tracking, and daily attendance monitoring.

Built using Angular 17 + Tailwind CSS for the frontend and FastAPI + SQLAlchemy for the backend, the system provides a clean, responsive dashboard for HR administrators to manage workforce operations efficiently.

🌐 **Live Demo:** [https://hrmngmtsyslite-poz3.vercel.app/dashboard](https://hrmngmtsyslite-poz3.vercel.app/dashboard)
🔌 **API:** [https://hrmngmtsyslite.onrender.com](https://hrmngmtsyslite.onrender.com)

## 🎯 Project Objective

The goal of HRMS is to:

- Digitize employee records
- Simplify leave approval workflows
- Track daily attendance
- Provide HR-level visibility via dashboard insights
- Maintain clean separation between frontend and backend architecture

## 🏗️ Architecture

```text
Angular (Frontend UI)
        ↓
FastAPI REST API
        ↓
SQLAlchemy ORM
        ↓
SQLite / PostgreSQL Database
```

**Frontend handles:**
- UI
- State management
- API integration

**Backend handles:**
- Business logic
- Data validation
- Database operations
- REST endpoints

## ✨ Core Modules

### 👥 Employee Management
- Create, update, deactivate, delete employees
- View employee directory
- Status tracking (Active / Inactive)

### 📝 Leave Management
- Submit leave requests
- Approve / Reject workflow
- Leave status filtering
- Pending / Approved / Rejected analytics

### 📅 Attendance Tracking
- Daily attendance marking
- Present / Absent / Late / Half Day
- Date-based attendance view

### 📊 Dashboard
- Total employees
- Pending leaves
- Present today
- Employees on leave
- Quick overview of system health

## 🛠 Tech Stack

**Frontend:**
- Angular 17
- TypeScript
- Tailwind CSS

**Backend:**
- FastAPI
- SQLAlchemy
- Uvicorn
- SQLite (local)
- PostgreSQL (production ready)

## 🚀 How to Run Locally

### 1. Clone the repository
```bash
git clone <repository-url>
cd hrms
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload
```
The backend API should now be running cleanly at `http://127.0.0.1:8000`.

### 3. Frontend Setup
```bash
cd frontend
npm install
ng serve
```
The frontend application will now be running on `http://localhost:4200/`.
