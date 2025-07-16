import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import AdminLeadDashboard from "@/components/AdminLeadDashboard";
import ImportLeadsModal from "@/components/ImportLeadsModal";

export default function LeadsPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 p-6 w-full bg-[#f8f8f8] text-black min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">👥 Leads</h1>
          <button
            onClick={() => setOpen(true)}
            className="bg-[#FFD700] text-black px-4 py-2 rounded shadow hover:opacity-90"
          >
            ➕ Import Leads
          </button>
        </div>
        <AdminLeadDashboard />
        <ImportLeadsModal open={open} setOpen={setOpen} />
      </main>
    </div>
  );
}
