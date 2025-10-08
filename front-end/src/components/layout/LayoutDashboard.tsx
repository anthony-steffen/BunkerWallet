import Sidebar from "./Sidebar";

export default function LayoutDashboards({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-base-200">
      {/* Sidebar (desktop) */}
      <Sidebar />

      {/* Main content */}

        {/* Conteúdo dinâmico */}
        <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
