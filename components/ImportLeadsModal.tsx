"use client";

import { useRef, useState } from "react";
import { Dialog } from "@headlessui/react";

export default function ImportLeadsModal({ open, setOpen }: any) {
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) return alert("Choose a file first");
    // TODO: upload to API
    alert(`You selected file: ${file.name}`);
    setOpen(false);
  };

  const handleGoogleSheet = () => {
    const sheetUrl = prompt("Paste Google Sheet URL here:");
    if (sheetUrl) {
      // TODO: send to API
      alert(`URL entered: ${sheetUrl}`);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <Dialog.Title className="text-xl font-bold mb-4 text-black">Import Leads</Dialog.Title>
          <div className="space-y-4">
            <input
              type="file"
              accept=".xlsx, .csv"
              ref={inputRef}
              onChange={handleFileChange}
              className="block w-full border p-2 rounded text-black"
            />
            <button
              onClick={handleUpload}
              className="bg-black text-[#FFD700] px-4 py-2 rounded hover:opacity-90 w-full"
            >
              Import Excel File
            </button>

            <button
              onClick={handleGoogleSheet}
              className="bg-[#FFD700] text-black px-4 py-2 rounded hover:opacity-90 w-full"
            >
              Import from Google Sheets
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
