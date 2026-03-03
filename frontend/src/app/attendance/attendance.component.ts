import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Attendance, Employee } from '../models/types';

@Component({
    selector: 'app-attendance',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './attendance.component.html'
})
export class AttendanceComponent implements OnInit {
    employees: Employee[] = [];
    attendances: Attendance[] = [];

    selectedDate: string = new Date().toISOString().split('T')[0];

    presentCount = 0;
    absentCount = 0;
    lateCount = 0;
    halfDayCount = 0;

    constructor(private api: ApiService) { }

    ngOnInit() {
        this.api.getEmployees().subscribe(data => {
            this.employees = data;
            this.fetchAttendance();
        });
    }

    fetchAttendance() {
        this.api.getAttendance(this.selectedDate).subscribe(data => {
            this.attendances = data;
            this.calculateStats();
        });
    }

    onDateChange() {
        this.fetchAttendance();
    }

    getAttendanceForEmployee(empId: number): Attendance | undefined {
        return this.attendances.find(a => a.employee_id === empId);
    }

    markAttendance(empId: number, status: string) {
        const data = {
            employee_id: empId,
            date: this.selectedDate,
            status: status
        };

        this.api.markAttendance(data).subscribe({
            next: () => this.fetchAttendance(),
            error: (err) => alert(err.error?.detail || 'Error marking attendance')
        });
    }

    calculateStats() {
        this.presentCount = this.attendances.filter(a => a.status === 'present').length;
        this.absentCount = this.attendances.filter(a => a.status === 'absent').length;
        this.lateCount = this.attendances.filter(a => a.status === 'late').length;
        this.halfDayCount = this.attendances.filter(a => a.status === 'half_day').length;
    }
}
