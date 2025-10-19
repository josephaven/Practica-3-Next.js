import { db } from "@/lib/store";

export default async function StudentDetail(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const student = await db.get(id);

  if (!student) return <div className="text-red-600">No encontrado</div>;

  return (
    <div className="grid gap-4">
      <h1 className="text-xl font-semibold">Detalle del estudiante</h1>

      <div className="rounded-2xl border p-4 bg-white">
        <p><b>ID:</b> {student.id}</p>
        <p><b>Nombre:</b> {student.nombre}</p>
        <p><b>Apellido:</b> {student.apellido}</p>
        <p><b>Matrícula:</b> {student.matricula}</p>
        <p><b>Carrera:</b> {student.carrera}</p>
      </div>
    </div>
  );
}
