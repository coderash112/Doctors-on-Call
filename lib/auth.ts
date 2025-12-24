import employees from "@/data/employees.json";

export function authenticate(email: string, password: string) {
  return employees.find(
    (u) => u.email === email && u.password === password
  );
}
