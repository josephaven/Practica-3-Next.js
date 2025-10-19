export type Student = {
  id: string;
  nombre: string;
  apellido: string;
  matricula: string;
  carrera: string;
};

let students: Student[] = [
  { id: '1', nombre: 'Joseph', apellido: 'Avendaño', matricula: 'S22021299', carrera: 'Licenciatura en Ingeniera de Software' },
];

export const db = {
  async list() {
    return students;
  },
  async get(id: string) {
    return students.find((s) => s.id === id);
  },
  async create(data: Omit<Student, 'id'>) {
    const id = String(Date.now());
    const newStudent: Student = { id, ...data };
    students = [newStudent, ...students];
    return newStudent;
  },
  async update(id: string, changes: Partial<Omit<Student, 'id'>>) {
    const index = students.findIndex((s) => s.id === id);
    if (index === -1) return null;
    students[index] = { ...students[index], ...changes };
    return students[index];
  },
  async remove(id: string) {
    const exists = students.some((s) => s.id === id);
    students = students.filter((s) => s.id !== id);
    return exists;
  },
};
