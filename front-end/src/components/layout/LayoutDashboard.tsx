import type { ReactNode } from "react";
import Sidebar from "./Sidebar";

export default function LayoutDashboards({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-base-200 text-base-content">
      <Sidebar />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
