import { StudentProvider } from "@/components/StudentContext";

export default function StudentsLayout({ children }: { children: React.ReactNode }) {
  return <StudentProvider>{children}</StudentProvider>;
}
