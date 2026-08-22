import Sidebar from "@/components/shared/Sidebar";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 min-h-screen justify-between">
        <div className="flex-1">
          <Navbar />
          <main className="p-6 pb-20">{children}</main>
        </div>
        <Footer />
      </div>
    </div>
  );
}
