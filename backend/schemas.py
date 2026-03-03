from pydantic import BaseModel, EmailStr
from datetime import date
from typing import Optional, List

class EmployeeBase(BaseModel):
    name: str
    email: EmailStr
    phone: str
    join_date: date
    status: str = "active"

class EmployeeCreate(EmployeeBase):
    pass

class EmployeeUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    join_date: Optional[date] = None
    status: Optional[str] = None

class EmployeeResponse(EmployeeBase):
    id: int
    class Config:
        from_attributes = True

class LeaveBase(BaseModel):
    employee_id: int
    leave_type: str
    start_date: date
    end_date: date
    reason: str
    status: str = "pending"

class LeaveCreate(LeaveBase):
    pass

class LeaveResponse(LeaveBase):
    id: int
    employee: Optional[EmployeeResponse] = None
    class Config:
        from_attributes = True

class AttendanceBase(BaseModel):
    employee_id: int
    date: date
    status: str

class AttendanceCreate(AttendanceBase):
    pass

class AttendanceResponse(AttendanceBase):
    id: int
    employee: Optional[EmployeeResponse] = None
    class Config:
        from_attributes = True
