import { useState } from "react";

interface FollowUpFormProps {
  leadId: string;
  onRefresh: () => void;
}

export default function FollowUpForm({ leadId, onRefresh }: FollowUpFormProps) {
  const [type, setType] = useState("Call");
  const [note, setNote] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/followups", {
      method: "POST",
      body: JSON.stringify({ leadId, type, note }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      setNote("");
      onRefresh();
    } else {
      alert("❌ Error saving follow-up");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 p-4 border rounded bg-white">
      <div className="flex items-center gap-4 mb-2">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="p-2 border rounded"
        >
          <option>Call</option>
          <option>WhatsApp</option>
          <option>Email</option>
          <option>Meeting</option>
        </select>
        <input
          type="text"
          placeholder="Enter note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="flex-1 p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Save
        </button>
      </div>
    </form>
  );
}
