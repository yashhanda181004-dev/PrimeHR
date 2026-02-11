import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const client = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export interface Employee {
  employee_id: string;
  full_name: string;
  email: string;
  department: string;
}

export interface AttendanceRecord {
  employee_id: string;
  date: string;
  status: "Present" | "Absent";
}

export const getEmployees = () => client.get<Employee[]>("/employees");

export const addEmployee = (data: Omit<Employee, "employee_id"> & { employee_id: string }) =>
  client.post<Employee>("/employees", data);

export const deleteEmployee = (employee_id: string) =>
  client.delete(`/employees/${employee_id}`);

export const markAttendance = (data: AttendanceRecord) =>
  client.post("/attendance", data);

export const getAttendance = (employee_id: string) =>
  client.get<AttendanceRecord[]>(`/attendance/${employee_id}`);
