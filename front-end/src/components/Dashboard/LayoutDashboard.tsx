import Sidebar from "./Sidebar";
import Header from "./DashboardHeader";

export default function LayoutDashboards({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-base-200">
      {/* Sidebar (desktop) */}
      <Sidebar />

      {/* Main content */}
      <div className="flex flex-col flex-1">
        {/* Header fixo no topo */}
        <Header />

        {/* Conteúdo dinâmico */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>

        {/* Navbar (mobile) */}
        {/* <div className="md:hidden">
          <Navbar />
        </div> */}
      </div>
    </div>
  );
}
