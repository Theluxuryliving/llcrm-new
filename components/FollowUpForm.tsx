"use client";

import { useState } from "react";

interface FollowUpFormProps {
  leadId: string;
  onRefresh: () => void;
}

export default function FollowUpForm({ leadId, onRefresh }: FollowUpFormProps) {
  const [type, setType] = useState("Call");
  const [note, setNote] = useState("");

  const handleSubmit = async () => {
    const res = await fetch("/api/followups", {
      method: "POST",
      body: JSON.stringify({ leadId, type, note }),
    });

    if (res.ok) {
      setNote("");
      onRefresh();
    } else {
      alert("❌ Error saving follow-up");
    }
  };

  return (
    <div className="flex gap-2 mt-2">
      <select
        className="border p-1 rounded"
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option>Call</option>
        <option>Meeting</option>
        <option>WhatsApp</option>
        <option>Email</option>
      </select>
      <input
        type="text"
        placeholder="Follow-up note"
        className="border p-1 rounded flex-1"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        className="bg-black text-white px-3 py-1 rounded"
      >
        Add
      </button>
    </div>
  );
}
