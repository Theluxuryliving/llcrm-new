import Sidebar from "@/components/Sidebar";

export default function HomePage() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="p-6 w-full bg-[#f8f8f8] min-h-screen">
        <h1 className="text-2xl font-bold">Welcome to Luxury CRM</h1>
      </main>
    </div>
  );
}
