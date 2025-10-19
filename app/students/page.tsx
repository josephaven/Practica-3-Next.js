import StudentForm from "@/components/StudentForm";
import StudentList from "@/components/StudentList";

export default function Page() {
  return (
    <section className="grid gap-6">
      <h1 className="text-2xl font-semibold">Estudiantes</h1>
      <StudentForm />
      <StudentList />
    </section>
  );
}
