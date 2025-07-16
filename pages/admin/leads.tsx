import AdminLeadDashboard from "@/components/AdminLeadDashboard";
import ImportLeadsModal from "@/components/ImportLeadsModal";
import { useState } from "react";

export default function LeadsPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-black">Leads</h1>
        <button
          onClick={() => setOpen(true)}
          className="bg-[#FFD700] text-black px-4 py-2 rounded shadow"
        >
          Import Leads
        </button>
      </div>
      <AdminLeadDashboard />
      <ImportLeadsModal open={open} setOpen={setOpen} />
    </div>
  );
}
