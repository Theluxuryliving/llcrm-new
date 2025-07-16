// UPDATED pages/leads/index.tsx
import { useEffect, useState } from "react";
import Link from "next/link";
import { getCurrentUser } from "../../lib/auth"; // hypothetical auth util
import { useRouter } from "next/router";

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const router = useRouter();

  const fetchLeads = async () => {
    const user = getCurrentUser();
    if (!user) return router.push("/login");

    const res = await fetch("/api/leads");
    const allLeads = await res.json();
    const filtered =
      user.role === "ADMIN" || user.role === "DIRECTOR" || user.role === "MANAGER"
        ? allLeads
        : allLeads.filter((lead: any) => lead.createdBy === user.name);
    setLeads(filtered);
  };

  const addLead = async () => {
    const user = getCurrentUser();
    if (!user) return;

    await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, createdBy: user.name }),
    });
    setName(""); setPhone("");
    fetchLeads();
  };

  useEffect(() => { fetchLeads(); }, []);

  return (
    <div className="p-6 font-poppins">
      <h2 className="text-2xl font-semibold mb-4">All Leads</h2>

      <div className="mb-6 space-x-2">
  <input
    placeholder="Name"
    value={name}
    onChange={(e) => setName(e.target.value)}
    className="border p-2"
  />
  <input
    placeholder="Phone"
    value={phone}
    onChange={(e) => setPhone(e.target.value)}
    className="border p-2"
  />
  <input
    placeholder="Project Name"
    value={project}
    onChange={(e) => setProject(e.target.value)}
    className="border p-2"
  />
  <input
    placeholder="Inventory Unit"
    value={inventory}
    onChange={(e) => setInventory(e.target.value)}
    className="border p-2"
  />
  <button onClick={addLead} className="bg-black text-gold px-4 py-2">
    + Add Lead
  </button>
</div>

      <ul className="space-y-2">
        {leads.map((lead: any) => (
          <li key={lead.id} className="border p-3 rounded shadow flex justify-between">
            <span>
              <strong>{lead.name}</strong> ({lead.phone}) - {lead.stage}
            </span>
            <Link href={`/leads/${lead.id}`} className="text-blue-500 underline">View</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}


