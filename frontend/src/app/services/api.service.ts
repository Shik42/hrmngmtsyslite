import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee, Leave, Attendance } from '../models/types';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getEmployees(): Observable<Employee[]> { return this.http.get<Employee[]>(`${this.apiUrl}/employees`); }
    createEmployee(data: any): Observable<Employee> { return this.http.post<Employee>(`${this.apiUrl}/employees`, data); }
    updateEmployee(id: number, data: any): Observable<Employee> { return this.http.put<Employee>(`${this.apiUrl}/employees/${id}`, data); }

    getLeaves(): Observable<Leave[]> { return this.http.get<Leave[]>(`${this.apiUrl}/leaves`); }
    createLeave(data: any): Observable<Leave> { return this.http.post<Leave>(`${this.apiUrl}/leaves`, data); }
    updateLeaveStatus(id: number, status: string): Observable<Leave> { return this.http.put<Leave>(`${this.apiUrl}/leaves/${id}/status?status=${status}`, {}); }

    getAttendance(date: string): Observable<Attendance[]> { return this.http.get<Attendance[]>(`${this.apiUrl}/attendance?target_date=${date}`); }
    markAttendance(data: any): Observable<Attendance> { return this.http.post<Attendance>(`${this.apiUrl}/attendance`, data); }
}
