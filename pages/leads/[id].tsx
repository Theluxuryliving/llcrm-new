// UPDATED pages/leads/[id].tsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../../lib/auth";

export default function LeadDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [lead, setLead] = useState<any>(null);
  const [followUps, setFollowUps] = useState([]);
  const [note, setNote] = useState("");
  const [type, setType] = useState("Call");

  const fetchLead = async () => {
    const user = getCurrentUser();
    if (!user) return router.push("/login");

    const res = await fetch(`/api/leads/${id}`);
    const data = await res.json();
    setLead(data.lead);
    setFollowUps(data.followUps);
  };

  const addFollowUp = async () => {
    await fetch(`/api/leads/${id}/followups`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note, type }),
    });
    setNote("");
    fetchLead();
  };

  const updateStage = async (stage: string) => {
    await fetch(`/api/leads/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage }),
    });
    fetchLead();
  };

  useEffect(() => {
    if (id) fetchLead();
  }, [id]);

  if (!lead) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 font-poppins space-y-4">
      <h2 className="text-xl font-semibold">{lead.name} ({lead.phone})</h2>

      <div>
        <label className="mr-2 font-medium">Stage:</label>
        <select
          value={lead.stage}
          onChange={(e) => updateStage(e.target.value)}
          className="border px-2 py-1"
        >
          {["New", "Inquiry", "Info Shared", "Meeting Done", "Token Received", "Downpayment", "SPA", "Closed-Won", "Closed-Lost"]
            .map(stage => <option key={stage}>{stage}</option>)}
        </select>
      </div>

      <hr className="my-4" />

      <h3 className="font-semibold">Follow-Ups</h3>
      <div className="flex gap-2 items-center">
        <select value={type} onChange={(e) => setType(e.target.value)} className="border p-1">
          <option>Call</option>
          <option>Visit</option>
          <option>WhatsApp</option>
        </select>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="border p-1 w-full"
          placeholder="Note"
        />
        <button onClick={addFollowUp} className="bg-black text-gold px-3 py-1">+ Add</button>
      </div>

      <ul className="mt-4 space-y-1">
        {followUps.map((f: any) => (
          <li key={f.id} className="text-sm border rounded p-2">
            <strong>{f.type}</strong>: {f.note} <span className="text-gray-500">({new Date(f.createdAt).toLocaleString()})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}