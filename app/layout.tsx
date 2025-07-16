import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { getServerSession } from "next-auth"; // Optional: for auth

export const metadata = {
  title: "Luxury CRM",
  description: "CRM for The Luxury Living",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(); // optional for auth

  return (
    <html lang="en">
      <body className="flex">
        <Sidebar user={session?.user} /> {/* Sidebar shows role + logout */}
        <main className="ml-64 w-full p-6 bg-[#f8f8f8] min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
