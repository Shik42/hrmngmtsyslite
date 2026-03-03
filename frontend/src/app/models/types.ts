export interface Employee {
    id: number;
    name: string;
    email: string;
    phone: string;
    join_date: string;
    status: string;
}

export interface Leave {
    id: number;
    employee_id: number;
    leave_type: string;
    start_date: string;
    end_date: string;
    reason: string;
    status: string;
    employee?: Employee;
}

export interface Attendance {
    id: number;
    employee_id: number;
    date: string;
    status: string;
    employee?: Employee;
}
