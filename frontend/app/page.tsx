"use client";

import Sidebar from "@/components/shared/Sidebar";
import Navbar from "@/components/shared/Navbar";
import DashboardOverviewPage from "@/app/(dashboard)/page";

export default function Home() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-6 flex-1">
          <DashboardOverviewPage />
        </main>
      </div>
    </div>
  );
}
