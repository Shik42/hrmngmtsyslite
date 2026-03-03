from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from typing import List
from datetime import date

import models, schemas
from database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="HRMS API", description="Simple backend for HRMS application")

# Configure CORS for local development and Vercel frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "HRMS API is running!"}

# --- Employees ---
@app.post("/api/employees", response_model=schemas.EmployeeResponse)
def create_employee(employee: schemas.EmployeeCreate, db: Session = Depends(get_db)):
    try:
        db_employee = db.query(models.Employee).filter(models.Employee.email == employee.email).first()
        if db_employee:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        new_employee = models.Employee(**employee.model_dump())
        db.add(new_employee)
        db.commit()
        db.refresh(new_employee)
        return new_employee
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Database error occurred while creating employee")

@app.get("/api/employees", response_model=List[schemas.EmployeeResponse])
def get_employees(db: Session = Depends(get_db)):
    return db.query(models.Employee).all()

@app.get("/api/employees/{employee_id}", response_model=schemas.EmployeeResponse)
def get_employee(employee_id: int, db: Session = Depends(get_db)):
    employee = db.query(models.Employee).filter(models.Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee

@app.put("/api/employees/{employee_id}", response_model=schemas.EmployeeResponse)
def update_employee(employee_id: int, employee_update: schemas.EmployeeUpdate, db: Session = Depends(get_db)):
    db_employee = db.query(models.Employee).filter(models.Employee.id == employee_id).first()
    if not db_employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    update_data = employee_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_employee, key, value)
        
    try:
        db.commit()
        db.refresh(db_employee)
        return db_employee
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Database error occurred while updating employee")

@app.delete("/api/employees/{employee_id}")
def delete_employee(employee_id: int, db: Session = Depends(get_db)):
    employee = db.query(models.Employee).filter(models.Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    try:
        db.delete(employee)
        db.commit()
        return {"message": "Employee deleted successfully"}
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Database error occurred while deleting employee")


# --- Leaves ---
@app.post("/api/leaves", response_model=schemas.LeaveResponse)
def create_leave(leave: schemas.LeaveCreate, db: Session = Depends(get_db)):
    employee = db.query(models.Employee).filter(models.Employee.id == leave.employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
        
    try:
        new_leave = models.Leave(**leave.model_dump())
        db.add(new_leave)
        db.commit()
        db.refresh(new_leave)
        return new_leave
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Database error occurred while requesting leave")

@app.get("/api/leaves", response_model=List[schemas.LeaveResponse])
def get_leaves(employee_id: int = None, db: Session = Depends(get_db)):
    query = db.query(models.Leave)
    if employee_id:
        query = query.filter(models.Leave.employee_id == employee_id)
    return query.all()

@app.put("/api/leaves/{leave_id}/status", response_model=schemas.LeaveResponse)
def update_leave_status(leave_id: int, status: str, db: Session = Depends(get_db)):
    if status not in ["pending", "approved", "rejected"]:
        raise HTTPException(status_code=400, detail="Invalid status. Must be pending, approved, or rejected.")
        
    leave = db.query(models.Leave).filter(models.Leave.id == leave_id).first()
    if not leave:
        raise HTTPException(status_code=404, detail="Leave request not found")
        
    if leave.status != "pending" and status != leave.status:
        raise HTTPException(status_code=400, detail=f"Leave request is already {leave.status} and cannot be changed.")
        
    try:
        leave.status = status
        db.commit()
        db.refresh(leave)
        return leave
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Database error occurred while updating leave status")


# --- Attendance ---
@app.post("/api/attendance", response_model=schemas.AttendanceResponse)
def mark_attendance(attendance: schemas.AttendanceCreate, db: Session = Depends(get_db)):
    employee = db.query(models.Employee).filter(models.Employee.id == attendance.employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
        
    if attendance.status not in ["present", "absent", "late", "half_day"]:
        raise HTTPException(status_code=400, detail="Invalid attendance status.")

    # Check if attendance already marked for this date
    existing_attendance = db.query(models.Attendance).filter(
        models.Attendance.employee_id == attendance.employee_id,
        models.Attendance.date == attendance.date
    ).first()
    
    try:
        if existing_attendance:
            existing_attendance.status = attendance.status
            db.commit()
            db.refresh(existing_attendance)
            return existing_attendance
            
        new_attendance = models.Attendance(**attendance.model_dump())
        db.add(new_attendance)
        db.commit()
        db.refresh(new_attendance)
        return new_attendance
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Database error occurred while marking attendance")

@app.get("/api/attendance", response_model=List[schemas.AttendanceResponse])
def get_attendance(target_date: date = None, employee_id: int = None, db: Session = Depends(get_db)):
    query = db.query(models.Attendance)
    if target_date:
        query = query.filter(models.Attendance.date == target_date)
    if employee_id:
        query = query.filter(models.Attendance.employee_id == employee_id)
    return query.all()
