import { supabase } from "@/lib/supabase";

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

export const getEmployees = async () => {
  const { data, error } = await supabase
    .from("employees")
    .select("employee_id, full_name, email, department")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return { data: data || [] };
};

export const addEmployee = async (employee: Employee) => {
  const { data, error } = await supabase
    .from("employees")
    .insert([employee])
    .select("employee_id, full_name, email, department")
    .single();

  if (error) throw error;
  return { data };
};

export const deleteEmployee = async (employee_id: string) => {
  const { error } = await supabase
    .from("employees")
    .delete()
    .eq("employee_id", employee_id);

  if (error) throw error;
  return { data: null };
};

export const markAttendance = async (attendance: AttendanceRecord) => {
  const { data, error } = await supabase
    .from("attendance")
    .insert([attendance])
    .select()
    .single();

  if (error) throw error;
  return { data };
};

export const getAttendance = async (employee_id: string) => {
  const { data, error } = await supabase
    .from("attendance")
    .select("employee_id, date, status")
    .eq("employee_id", employee_id)
    .order("date", { ascending: false });

  if (error) throw error;
  return { data: data || [] };
};
