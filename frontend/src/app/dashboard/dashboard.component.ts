import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Employee, Leave, Attendance } from '../models/types';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
    employees: Employee[] = [];
    leaves: Leave[] = [];
    attendances: Attendance[] = [];

    totalEmployees = 0;
    pendingLeaves = 0;
    presentToday = 0;
    onLeave = 0;

    recentLeaves: Leave[] = [];


    constructor(private api: ApiService) { }

    ngOnInit() {
        this.fetchData();
    }

    fetchData() {
        this.api.getEmployees().subscribe(data => {
            this.employees = data;
            this.totalEmployees = data.length;


        });

        this.api.getLeaves().subscribe(data => {
            this.leaves = data;
            this.pendingLeaves = data.filter(l => l.status === 'pending').length;

            const today = new Date();
            this.onLeave = data.filter(l => l.status === 'approved' && new Date(l.start_date) <= today && new Date(l.end_date) >= today).length;
            this.recentLeaves = data.slice(0, 4);
        });

        const todayDate = new Date().toISOString().split('T')[0];
        this.api.getAttendance(todayDate).subscribe(data => {
            this.attendances = data;
            this.presentToday = data.filter(a => ['present', 'late', 'half_day'].includes(a.status)).length;
        });
    }

    getLeaveStatusClass(status: string) {
        if (status === 'approved') return 'bg-green-100 text-green-800';
        if (status === 'rejected') return 'bg-red-100 text-red-800';
        return 'bg-yellow-100 text-yellow-800';
    }

    getOfficeStatus(employeeId: number): string {
        const today = new Date();
        const isOnLeave = this.leaves.some(l =>
            l.employee_id === employeeId &&
            l.status === 'approved' &&
            new Date(l.start_date) <= today &&
            new Date(l.end_date) >= today
        );
        if (isOnLeave) return 'On Leave';

        const attendance = this.attendances.find(a => a.employee_id === employeeId);
        if (attendance && ['present', 'late', 'half_day'].includes(attendance.status)) {
            return 'In Office';
        }
        return 'Not Marked';
    }
}
