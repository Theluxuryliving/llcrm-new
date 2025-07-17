// /pages/calendar.tsx
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Sidebar from "@/components/Sidebar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function CalendarPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [value, setValue] = useState<Date | null>(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newFollowUp, setNewFollowUp] = useState({ note: "", type: "", leadId: "" });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") {
      fetch("/api/followups")
        .then((res) => res.json())
        .then(setEvents)
        .finally(() => setLoading(false));
    }
  }, [status]);

  const getEventsForDate = (date: Date) => {
    const dayStr = date.toISOString().split("T")[0];
    return events.filter((e) => e.createdAt.startsWith(dayStr));
  };

  const tileContent = ({ date }: { date: Date }) => {
    const hasEvents = getEventsForDate(date).length > 0;
    return hasEvents ? <div className="bg-blue-500 w-2 h-2 rounded-full mx-auto mt-1" /> : null;
  };

  const handleCreate = async () => {
    if (!newFollowUp.leadId) return alert("Select a lead");
    await fetch("/api/followups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...newFollowUp,
        nextFollowup: value,
      }),
    });
    setShowModal(false);
    setNewFollowUp({ note: "", type: "", leadId: "" });
    const res = await fetch("/api/followups");
    setEvents(await res.json());
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 p-6 w-full bg-[#f8f8f8] min-h-screen">
        <h1 className="text-2xl font-bold mb-4">📅 Calendar</h1>

        <Calendar
          onChange={setValue}
          value={value}
          tileContent={tileContent}
          className="mb-6"
        />

        <button onClick={() => setShowModal(true)} className="mb-4 bg-blue-600 text-white px-4 py-2 rounded">
          ➕ Create Follow-Up
        </button>

        <div className="bg-white rounded shadow p-4">
          <h2 className="text-xl font-semibold mb-2">📝 Follow-ups on {value?.toDateString()}</h2>

          {getEventsForDate(value!).length === 0 ? (
            <p>No follow-ups for this day.</p>
          ) : (
            <ul className="space-y-3">
              {getEventsForDate(value!).map((fup) => (
                <li key={fup.id} className="border p-3 rounded">
                  <p><strong>Lead:</strong> {fup.leadName}</p>
                  <p><strong>Type:</strong> {fup.type}</p>
                  <p><strong>Note:</strong> {fup.note}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(fup.createdAt).toLocaleTimeString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow w-[400px]">
              <h3 className="text-xl font-bold mb-4">Create Follow-Up</h3>
              <input
                type="text"
                placeholder="Lead ID"
                className="border p-2 w-full mb-2"
                value={newFollowUp.leadId}
                onChange={(e) => setNewFollowUp({ ...newFollowUp, leadId: e.target.value })}
              />
              <input
                type="text"
                placeholder="Type"
                className="border p-2 w-full mb-2"
                value={newFollowUp.type}
                onChange={(e) => setNewFollowUp({ ...newFollowUp, type: e.target.value })}
              />
              <textarea
                placeholder="Note"
                className="border p-2 w-full mb-2"
                value={newFollowUp.note}
                onChange={(e) => setNewFollowUp({ ...newFollowUp, note: e.target.value })}
              />
              <button onClick={handleCreate} className="bg-blue-600 text-white px-4 py-2 rounded mr-2">
                Create
              </button>
              <button onClick={() => setShowModal(false)} className="bg-gray-400 text-white px-4 py-2 rounded">
                Cancel
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
