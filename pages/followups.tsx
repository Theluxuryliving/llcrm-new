import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import FollowUpForm from "@/components/FollowUpForm";

export default function FollowupsPage() {
  const [followUps, setFollowUps] = useState([]);

  useEffect(() => {
    fetch("/api/followups")
      .then((res) => res.json())
      .then((data) => setFollowUps(data));
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 p-6 w-full bg-[#f8f8f8] text-black min-h-screen">
        <h1 className="text-2xl font-bold mb-4">📌 Follow-ups</h1>
        <FollowUpForm />

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">📋 Recent Follow-Ups</h2>
          {followUps.length === 0 ? (
            <p>No follow-ups yet.</p>
          ) : (
            <ul className="space-y-2">
              {followUps.map((fup) => (
                <li key={fup.id} className="bg-white p-3 rounded shadow border">
                  <p><strong>Type:</strong> {fup.type}</p>
                  <p><strong>Note:</strong> {fup.note}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(fup.createdAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
