import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmployeesComponent } from './employees/employees.component';
import { LeaveComponent } from './leave/leave.component';
import { AttendanceComponent } from './attendance/attendance.component';

export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'employees', component: EmployeesComponent },
    { path: 'leave', component: LeaveComponent },
    { path: 'attendance', component: AttendanceComponent },
    { path: '**', redirectTo: '/dashboard' }
];
