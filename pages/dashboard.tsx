import { useEffect, useState } from "react";
import { getCurrentUser } from "../lib/auth";
import { useRouter } from "next/router";
import Sidebar from "@/components/Sidebar";

export default function DashboardPage() {
  const [summary, setSummary] = useState<any>({});
  const router = useRouter();

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) return router.push("/login");

    fetch("/api/dashboard-summary", {
      headers: {
        Authorization: user?.id,
      },
    })
      .then((res) => res.json())
      .then((data) => setSummary(data));
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 p-6 w-full bg-[#f8f8f8] text-black min-h-screen">
        <h1 className="text-2xl font-bold mb-6">📊 Dashboard Summary</h1>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-black text-[#FFD700] p-4 rounded shadow">
            <h2 className="text-lg font-semibold">Total Leads</h2>
            <p className="text-3xl">{summary.totalLeads || 0}</p>
          </div>

          <div className="bg-black text-[#FFD700] p-4 rounded shadow">
            <h2 className="text-lg font-semibold">Total Follow-Ups</h2>
            <p className="text-3xl">{summary.totalFollowUps || 0}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
