import { useState } from "react";
import { addEmployee } from "@/api/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Props {
  onAdded: () => void;
}

const EmployeeForm = ({ onAdded }: Props) => {
  const [form, setForm] = useState({ employee_id: "", full_name: "", email: "", department: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.employee_id.trim()) e.employee_id = "Required";
    if (!form.full_name.trim()) e.full_name = "Required";
    if (!form.email.trim()) e.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    if (!form.department.trim()) e.department = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await addEmployee(form);
      toast.success("Employee added successfully");
      setForm({ employee_id: "", full_name: "", email: "", department: "" });
      setErrors({});
      onAdded();
    } catch {
      toast.error("Failed to add employee. Check your API connection.");
    } finally {
      setLoading(false);
    }
  };

  const update = (key: string, value: string) => {
    setForm((p) => ({ ...p, [key]: value }));
    if (errors[key]) setErrors((p) => ({ ...p, [key]: "" }));
  };

  const fields = [
    { key: "employee_id", label: "Employee ID", placeholder: "EMP-001" },
    { key: "full_name", label: "Full Name", placeholder: "Jane Doe" },
    { key: "email", label: "Email", placeholder: "jane@company.com", type: "email" },
    { key: "department", label: "Department", placeholder: "Engineering" },
  ] as const;

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border bg-card p-5">
      <h3 className="mb-4 text-base font-semibold text-card-foreground">Add Employee</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map(({ key, label, placeholder, ...rest }) => (
          <div key={key} className="space-y-1.5">
            <Label htmlFor={key}>{label}</Label>
            <Input
              id={key}
              placeholder={placeholder}
              value={form[key as keyof typeof form]}
              onChange={(e) => update(key, e.target.value)}
              {...rest}
            />
            {errors[key] && <p className="text-xs text-destructive">{errors[key]}</p>}
          </div>
        ))}
      </div>
      <Button type="submit" className="mt-4" disabled={loading}>
        {loading ? "Adding…" : "Add Employee"}
      </Button>
    </form>
  );
};

export default EmployeeForm;
