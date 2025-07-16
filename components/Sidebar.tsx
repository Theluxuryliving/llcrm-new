"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function Sidebar() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <aside className="w-64 h-screen bg-black text-white flex flex-col p-4 fixed">
      <h2 className="text-2xl font-bold text-[#FFD700] mb-6">Luxury CRM</h2>

      {user && (
        <div className="mb-4 text-sm">
          Logged in as: <span className="font-semibold">{user.name}</span><br />
          Role: <span className="uppercase font-bold text-[#FFD700]">{user.role}</span>
        </div>
      )}

      <nav className="space-y-3 flex-1 overflow-y-auto">
        <Link href="/dashboard" className="hover:text-gray-300 block">📊 Dashboard</Link>
        <Link href="/leads" className="hover:text-gray-300 block">👥 Leads</Link>
        <Link href="/followups" className="hover:text-gray-300 block">📌 Follow-ups</Link>
        <Link href="/calendar" className="hover:text-gray-300 block">📅 Calendar</Link>
        <Link href="/projects" className="hover:text-gray-300 block">🏗️ Projects</Link>
        <Link href="/inventory" className="hover:text-gray-300 block">📦 Inventory</Link>
        <Link href="/deals" className="hover:text-gray-300 block">💼 Deals</Link>
        <Link href="/documents" className="hover:text-gray-300 block">📁 Documents</Link>
        <Link href="/affiliates" className="hover:text-gray-300 block">🌐 Affiliates</Link>
        <Link href="/settings" className="hover:text-gray-300 block">⚙️ Settings</Link>
      </nav>

      <button
        onClick={() => signOut()}
        className="bg-[#FFD700] text-black px-4 py-2 rounded shadow hover:opacity-90 mt-4"
      >
        🚪 Logout
      </button>
    </aside>
  );
}
