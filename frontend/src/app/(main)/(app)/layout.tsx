import { AppSidebar } from "@/components/common/AppSidebar";
import { StudentGuard } from "@/components/common/StudentGuard";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <StudentGuard>
      <div className="flex flex-1 flex-col sm:flex-row">
        <AppSidebar />
        <main className="flex-1">{children}</main>
      </div>
    </StudentGuard>
  );
}
