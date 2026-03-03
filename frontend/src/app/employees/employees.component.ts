import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Employee } from '../models/types';

@Component({
    selector: 'app-employees',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './employees.component.html'
})
export class EmployeesComponent implements OnInit {
    employees: Employee[] = [];
    filteredEmployees: Employee[] = [];
    searchTerm = '';

    showModal = false;
    isEditMode = false;
    newEmployee: Partial<Employee> = {
        name: '',
        email: '',
        phone: '',
        join_date: new Date().toISOString().split('T')[0],
        status: 'active'
    };

    constructor(private api: ApiService) { }

    ngOnInit() {
        this.fetchEmployees();
    }

    fetchEmployees() {
        this.api.getEmployees().subscribe(data => {
            this.employees = data;
            this.filterEmployees(); // Apply existing filter
        });
    }

    filterEmployees() {
        if (!this.searchTerm) {
            this.filteredEmployees = this.employees;
            return;
        }
        const term = this.searchTerm.toLowerCase();
        this.filteredEmployees = this.employees.filter(e =>
            e.name.toLowerCase().includes(term) ||
            e.email.toLowerCase().includes(term) ||
            e.phone.toLowerCase().includes(term)
        );
    }

    openAddModal() {
        this.isEditMode = false;
        this.newEmployee = {
            name: '',
            email: '',
            phone: '',
            join_date: new Date().toISOString().split('T')[0],
            status: 'active'
        };
        this.showModal = true;
    }

    editEmployee(emp: Employee) {
        this.isEditMode = true;
        this.newEmployee = { ...emp }; // Copy to avoid two-way binding directly to table
        this.showModal = true;
    }

    closeModal() {
        this.showModal = false;
    }

    saveEmployee() {
        if (this.isEditMode && this.newEmployee.id) {
            this.api.updateEmployee(this.newEmployee.id, this.newEmployee).subscribe({
                next: (res) => {
                    this.fetchEmployees();
                    this.closeModal();
                },
                error: (err) => {
                    alert(err.error?.detail || 'Error updating employee');
                }
            });
        } else {
            this.api.createEmployee(this.newEmployee).subscribe({
                next: (res) => {
                    this.fetchEmployees();
                    this.closeModal();
                },
                error: (err) => {
                    alert(err.error?.detail || 'Error creating employee');
                }
            });
        }
    }

    endEmployment() {
        if (this.newEmployee.id && confirm('Are you sure you want to end employment for this person? They will be marked as inactive.')) {
            this.newEmployee.status = 'inactive';
            this.saveEmployee();
        }
    }
}
