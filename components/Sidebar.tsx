import Link from "next/link";

type SidebarProps = {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
  };
};

const Sidebar = ({ user }: SidebarProps) => {
  return (
    <div className="w-64 fixed h-full bg-white border-r shadow-sm">
      <div className="p-4 font-bold text-lg border-b">Luxury CRM</div>

      <div className="p-4 text-sm text-gray-600">
        Role: {user?.role || "N/A"}
        <form method="POST" action="/api/auth/signout">
          <button type="submit" className="text-blue-500 underline mt-2">
            Logout
          </button>
        </form>
      </div>

      <nav className="flex flex-col p-4 space-y-2 text-sm">
        <Link href="/dashboard" className="hover:text-blue-600">
          Dashboard
        </Link>
        <Link href="/leads" className="hover:text-blue-600">
          Leads
        </Link>
        <Link href="/followups" className="hover:text-blue-600">
          Follow Ups
        </Link>
        <Link href="/calendar" className="hover:text-blue-600">
          Calendar
        </Link>
        <Link href="/admin/leads" className="hover:text-blue-600">
          Admin
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
