import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Sidebar from "@/components/Sidebar";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";

type CalendarValue = Date | null;

export default function CalendarPage() {
  const [value, setValue] = useState<CalendarValue>(new Date());
  const [events, setEvents] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newFollowup, setNewFollowup] = useState({ note: "", type: "Call", leadId: "" });

  useEffect(() => {
    fetch("/api/followups")
      .then((res) => res.json())
      .then((data) => setEvents(data));
  }, []);

  const getEventsForDate = (date: Date) => {
    const dayStr = date.toISOString().split("T")[0];
    return events.filter((e) => e.createdAt.startsWith(dayStr));
  };

  const tileClassName = ({ date, view }: any) => {
    if (view === "month") {
      const dayStr = date.toISOString().split("T")[0];
      const hasEvents = events.some((e) => e.createdAt.startsWith(dayStr));
      return hasEvents ? "bg-blue-100 rounded-full" : null;
    }
    return null;
  };

  const handleCreateFollowup = async () => {
    const res = await fetch("/api/followups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...newFollowup,
        nextFollowup: value,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      setEvents((prev) => [...prev, data]);
      setShowModal(false);
      setNewFollowup({ note: "", type: "Call", leadId: "" });
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 p-6 w-full bg-[#f8f8f8] min-h-screen">
        <h1 className="text-2xl font-bold mb-4">📅 Calendar</h1>

        <Calendar
          onChange={(val) => setValue(val as Date)}
          value={value}
          tileClassName={tileClassName}
          className="mb-6"
        />

        <Button onClick={() => setShowModal(true)} className="mb-4">
          ➕ Add Follow-up
        </Button>

        <div className="bg-white rounded shadow p-4">
          <h2 className="text-xl font-semibold mb-2">
            📝 Follow-ups on {value?.toDateString()}
          </h2>

          {value && getEventsForDate(value).length === 0 ? (
            <p>No follow-ups for this day.</p>
          ) : (
            <ul className="space-y-3">
              {value &&
                getEventsForDate(value).map((fup) => (
                  <li key={fup.id} className="border p-3 rounded">
                    <p>
                      <strong>Lead:</strong> {fup.leadName}
                    </p>
                    <p>
                      <strong>Type:</strong> {fup.type}
                    </p>
                    <p>
                      <strong>Note:</strong> {fup.note}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(fup.createdAt).toLocaleTimeString()}
                    </p>
                  </li>
                ))}
            </ul>
          )}
        </div>

        <Modal open={showModal} onOpenChange={setShowModal}>
          <div className="p-4 space-y-4">
            <h3 className="text-lg font-semibold">Create New Follow-up</h3>
            <input
              className="w-full p-2 border rounded"
              placeholder="Lead ID"
              value={newFollowup.leadId}
              onChange={(e) => setNewFollowup({ ...newFollowup, leadId: e.target.value })}
            />
            <select
              className="w-full p-2 border rounded"
              value={newFollowup.type}
              onChange={(e) => setNewFollowup({ ...newFollowup, type: e.target.value })}
            >
              <option value="Call">Call</option>
              <option value="Email">Email</option>
              <option value="Visit">Visit</option>
            </select>
            <textarea
              className="w-full p-2 border rounded"
              placeholder="Note"
              value={newFollowup.note}
              onChange={(e) => setNewFollowup({ ...newFollowup, note: e.target.value })}
            />
            <Button onClick={handleCreateFollowup}>Submit</Button>
          </div>
        </Modal>
      </main>
    </div>
  );
}
