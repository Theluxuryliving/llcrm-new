// components/Sidebar.tsx
import Link from "next/link";
import { useRouter } from "next/router";

export default function Sidebar() {
  const router = useRouter();

  const links = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Leads", href: "/leads" },
    { name: "Calendar", href: "/calendar" },
    { name: "Import", href: "/import" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("crm_token");
    document.cookie = "crm_token=; Max-Age=0; path=/;";
    router.push("/login");
  };

  return (
    <aside className="h-screen w-64 bg-gray-900 text-white p-4 fixed left-0 top-0">
      <h2 className="text-xl font-bold mb-6">CRM Menu</h2>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="hover:underline">
              {link.name}
            </Link>
          </li>
        ))}
        <li className="mt-6">
          <button onClick={handleLogout} className="bg-red-600 px-4 py-2 rounded">
            Logout
          </button>
        </li>
      </ul>
    </aside>
  );
}
