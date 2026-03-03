import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Leave, Employee } from '../models/types';

@Component({
    selector: 'app-leave',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './leave.component.html'
})
export class LeaveComponent implements OnInit {
    leaves: Leave[] = [];
    employees: Employee[] = [];

    pendingCount = 0;
    approvedCount = 0;
    rejectedCount = 0;

    currentFilter: 'All' | 'Pending' | 'Approved' | 'Rejected' = 'All';
    filters: Array<'All' | 'Pending' | 'Approved' | 'Rejected'> = ['All', 'Pending', 'Approved', 'Rejected'];

    showModal = false;
    newLeave: Partial<Leave> = {
        employee_id: undefined,
        leave_type: 'Annual Leave',
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date().toISOString().split('T')[0],
        reason: ''
    };

    constructor(private api: ApiService) { }

    ngOnInit() {
        this.api.getEmployees().subscribe(data => {
            this.employees = data;
            if (this.employees.length > 0) {
                this.newLeave.employee_id = this.employees[0].id;
            }
            this.fetchLeaves();
        });
    }

    fetchLeaves() {
        this.api.getLeaves().subscribe(data => {
            data.forEach(l => {
                if (!l.employee) {
                    l.employee = this.employees.find(e => e.id === l.employee_id);
                }
            });

            this.leaves = data;
            this.pendingCount = data.filter(l => l.status === 'pending').length;
            this.approvedCount = data.filter(l => l.status === 'approved').length;
            this.rejectedCount = data.filter(l => l.status === 'rejected').length;
        });
    }

    get filteredLeaves() {
        if (this.currentFilter === 'All') return this.leaves;
        return this.leaves.filter(l => l.status.toLowerCase() === this.currentFilter.toLowerCase());
    }

    setFilter(filter: 'All' | 'Pending' | 'Approved' | 'Rejected') {
        this.currentFilter = filter;
    }

    updateStatus(leaveId: number, status: string) {
        this.api.updateLeaveStatus(leaveId, status).subscribe({
            next: () => this.fetchLeaves(),
            error: (err: any) => alert(err.error?.detail || 'Error updating status')
        });
    }

    openAddModal() {
        this.showModal = true;
    }

    closeModal() {
        this.showModal = false;
    }

    submitLeave() {
        if (!this.newLeave.employee_id) return alert('Select an employee');
        this.api.createLeave(this.newLeave).subscribe({
            next: () => {
                this.fetchLeaves();
                this.closeModal();
            },
            error: (err: any) => alert(err.error?.detail || 'Error submitting leave')
        });
    }
}
