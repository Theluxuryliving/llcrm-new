import { useState } from "react";

export default function FollowUpForm({ leadId, onRefresh }) {
  const [type, setType] = useState("Call");
  const [note, setNote] = useState("");

  const submitFollowUp = async () => {
    await fetch(`/api/leads/${leadId}/followups`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, note })
    });
    setNote("");
    if (onRefresh) onRefresh();
  };

  return (
    <div className="flex gap-2 my-3">
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="border p-1"
      >
        <option>Call</option>
        <option>Visit</option>
        <option>WhatsApp</option>
      </select>
      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="border p-1 flex-1"
        placeholder="Follow-up note"
      />
      <button onClick={submitFollowUp} className="bg-black text-gold px-3 py-1">
        + Add
      </button>
    </div>
  );
}
