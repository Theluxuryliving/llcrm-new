import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Sidebar from "@/components/Sidebar";

interface FollowUp {
  id: string;
  leadName: string;
  type: string;
  note: string;
  createdAt: string;
}

export default function CalendarPage() {
  const [value, setValue] = useState<Date>(new Date());
  const [events, setEvents] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFollowups = async () => {
      try {
        const res = await fetch("/api/followups");
        if (!res.ok) throw new Error("Failed to fetch follow-ups");
        const data = await res.json();
        setEvents(data);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchFollowups();
  }, []);

  const getEventsForDate = (date: Date): FollowUp[] => {
    const dayStr = date.toISOString().split("T")[0];
    return events.filter((e) => e.createdAt.startsWith(dayStr));
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 p-6 w-full bg-[#f8f8f8] min-h-screen">
        <h1 className="text-2xl font-bold mb-4">📅 Calendar</h1>

        <Calendar onChange={setValue} value={value} className="mb-6" />

        <div className="bg-white rounded shadow p-4">
          <h2 className="text-xl font-semibold mb-2">📝 Follow-ups on {value.toDateString()}</h2>

          {loading ? (
            <p className="text-gray-500">Loading follow-ups...</p>
          ) : error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : getEventsForDate(value).length === 0 ? (
            <p>No follow-ups for this day.</p>
          ) : (
            <ul className="space-y-3">
              {getEventsForDate(value).map((fup) => (
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
      </main>
    </div>
  );
}
