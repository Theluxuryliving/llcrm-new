"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const citiesInPakistan = [
  "Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Gujranwala", "Sialkot"
];

const lahoreAreas = [
  "Bahria", "DHA", "Etihad Town", "Pine Avenue", "Lake City", "Park Lane", "Central Park", "Gulberg",
  "Walled City", "Gawalmandi", "Faisal Town", "Johar Town"
];

const countries = [
  "Pakistan", "UAE", "Saudi Arabia", "Qatar", "Bahrain", "Oman", "Kuwait",
  "UK", "USA", "Australia", "Europe", "Japan", "China", "South Korea"
];

const planOptions = ["Offplan", "Ready to Move", "Tenant", "To Let", "To Sell"];
const propertyTypes = [
  "Apartment", "Townhouse", "Residential Plot", "Commercial Plot", "Shop",
  "Penthouse", "Villa", "Farmhouse", "Agricultural Land"
];
const purchaseTimelines = ["Immediately", "3 Months", "6 Months", "1 Year"];
const leadSources = ["Facebook", "Instagram", "YouTube", "X", "Google", "Event", "Reference", "Cold Call"];

export default function LeadForm() {
  const { data: session } = useSession();
  const user = session?.user;

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    country: "Pakistan",
    city: "",
    area: "",
    plan: "",
    propertyType: "",
    project: "",
    budget: 5000000,
    timeline: "",
    source: "",
  });

  const [projectList, setProjectList] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [showImport, setShowImport] = useState(false);

  useEffect(() => {
    // Fetch project list from API (placeholder)
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        setProjectList(data.map((p: any) => p.name));
      } catch (err) {
        console.error("Error loading projects", err);
      }
    };

    fetchProjects();
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        createdBy: user?.name,
      }),
    });

    if (res.ok) {
      setMessage("✅ Lead submitted");
      setForm({
        name: "",
        phone: "",
        email: "",
        country: "Pakistan",
        city: "",
        area: "",
        plan: "",
        propertyType: "",
        project: "",
        budget: 5000000,
        timeline: "",
        source: "",
      });
    } else {
      setMessage("❌ Error adding lead");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-black">Add New Lead</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Name / Phone / Email */}
        <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Client Name" required className="w-full p-2 border rounded" />
        <input type="text" name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" required className="w-full p-2 border rounded" />
        <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full p-2 border rounded" />

        {/* Country */}
        <select name="country" value={form.country} onChange={handleChange} className="w-full p-2 border rounded">
          {countries.map((c) => (
            <option key={c} value={c}>
              {c === "Pakistan" ? "🇵🇰 Pakistan" : c}
            </option>
          ))}
        </select>

        {/* City */}
        {form.country === "Pakistan" ? (
          <select name="city" value={form.city} onChange={handleChange} className="w-full p-2 border rounded">
            {citiesInPakistan.map((city) => (
              <option key={city}>{city}</option>
            ))}
          </select>
        ) : (
          <input type="text" name="city" value={form.city} onChange={handleChange} placeholder="City" className="w-full p-2 border rounded" />
        )}

        {/* Area */}
        <select name="area" value={form.area} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="">Select Area</option>
          {lahoreAreas.map((area) => (
            <option key={area}>{area}</option>
          ))}
        </select>

        {/* Plan / Property Type */}
        <select name="plan" value={form.plan} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="">Plan Interested In</option>
          {planOptions.map((opt) => (
            <option key={opt}>{opt}</option>
          ))}
        </select>

        <select name="propertyType" value={form.propertyType} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="">Property Type</option>
          {propertyTypes.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>

        {/* Project Interested In */}
        <select name="project" value={form.project} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="">Select Project</option>
          {projectList.map((project) => (
            <option key={project}>{project}</option>
          ))}
        </select>

        {/* Budget */}
        <label className="text-sm font-medium text-black">Budget: {form.budget.toLocaleString()} PKR</label>
        <input type="range" name="budget" min={1000000} max={500000000} step={1000000} value={form.budget} onChange={handleChange} className="w-full" />

        {/* Plan on Purchasing */}
        <select name="timeline" value={form.timeline} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="">Plan on Purchasing</option>
          {purchaseTimelines.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>

        {/* Lead Source */}
        <select name="source" value={form.source} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="">Lead Source</option>
          {leadSources.map((src) => (
            <option key={src}>{src}</option>
          ))}
        </select>

        {/* Submit + Import */}
        <div className="flex justify-between items-center">
          <button type="submit" className="bg-black text-[#FFD700] font-semibold py-2 px-4 rounded hover:bg-gray-800">
            Save Lead
          </button>
          <button type="button" onClick={() => setShowImport(true)} className="text-sm text-blue-600 underline">
            Import from Excel / Google Sheets
          </button>
        </div>

        {message && <p className="text-black text-sm mt-2">{message}</p>}
      </form>

      {/* Import Modal Placeholder */}
      {showImport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Import Leads</h3>
            <p>Coming soon: Upload Excel or connect Google Sheets</p>
            <button className="mt-4 px-4 py-2 bg-black text-white rounded" onClick={() => setShowImport(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
