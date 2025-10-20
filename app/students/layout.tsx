import { StudentProvider } from "@/components/students/StudentContext";

export default function StudentsLayout({ children }: { children: React.ReactNode }) {
    return <StudentProvider>{children}</StudentProvider>;
}
