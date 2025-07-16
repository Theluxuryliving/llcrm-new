"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  country: string;
  city: string;
  area: string;
  project: string;
  createdBy: {
    name: string;
    email: string;
  };
}

// Extend the default user type to include role
type CustomUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
};

export default function AdminLeadDashboard() {
  const { data: session } = useSession();
  const user = session?.user as CustomUser;

  const [leads, setLeads] = useState<Lead[]>([]);
  const [filtered, setFiltered] = useState<Lead[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    const res = await fetch("/api/leads");
    const data = await res.json();
    setLeads(data);
    setFiltered(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this lead?")) return;
    const res = await fetch(`/api/leads/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setLeads((prev) => prev.filter((l) => l.id !== id));
      setFiltered((prev) => prev.filter((l) => l.id !== id));
    } else {
      alert("❌ Error deleting lead");
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase();
    setSearch(val);
    const filtered = leads.filter((lead) =>
      (lead.name + lead.phone + lead.project).toLowerCase().includes(val)
    );
    setFiltered(filtered);
  };

  return (
    <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-black">Lead Dashboard</h2>
        <input
          type="text"
          placeholder="Search by name/phone/project"
          value={search}
          onChange={handleSearch}
          className="p-2 border rounded w-72"
        />
      </div>

      {loading ? (
        <p className="text-center text-black">Loading leads...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-sm text-black border">
            <thead className="bg-black text-[#FFD700]">
              <tr>
                <th className="p-2">Name</th>
                <th className="p-2">Phone</th>
                <th className="p-2">Email</th>
                <th className="p-2">Project</th>
                <th className="p-2">City</th>
                <th className="p-2">Area</th>
                <th className="p-2">Agent</th>
                {user?.role === "ADMIN" && <th className="p-2">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => (
                <tr key={lead.id} className="border-t">
                  <td className="p-2">{lead.name}</td>
                  <td className="p-2">{lead.phone}</td>
                  <td className="p-2">{lead.email}</td>
                  <td className="p-2">{lead.project}</td>
                  <td className="p-2">{lead.city}</td>
                  <td className="p-2">{lead.area}</td>
                  <td className="p-2">{lead.createdBy?.name}</td>
                  {user?.role === "ADMIN" && (
                    <td className="p-2">
                      <button
                        onClick={() => handleDelete(lead.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
