"use client";

import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import { useState } from "react";

interface Ticket {
  id: number;
  req_date: string;
  acp_date?: string;
  fin_date?: string;
  status: "TODO" | "ACTIVE" | "DONE";
  content: string;
  priority: "낮음" | "보통" | "긴급";
  requester: string;
  department: string;
  category: string;
  attachment: string | null;
  worker: string;
  result?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  ticket: Ticket;
  onSubmit: (updated: Ticket) => void;
}

export default function TicketRequestModal({ isOpen, onClose, ticket, onSubmit }: Props) {
  const [form, setForm] = useState<Ticket>({ ...ticket });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, attachment: file ? file.name : null }));
  };

  const handleSubmit = () => {
    const now = new Date().toISOString();
    onSubmit({ ...form, acp_date: now });
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />

      <Dialog.Panel className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-5">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>

        <Dialog.Title className="text-lg font-semibold">요청 접수</Dialog.Title>

        <div className="space-y-3 text-sm">
          <div>
            <label className="block mb-1 text-gray-600 font-medium">접수자</label>
            <input
              name="worker"
              value={form.worker}
              onChange={handleChange}
              className="w-full border rounded p-2"
              placeholder="접수자 이름"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-600 font-medium">상태</label>
            <select name="status" value={form.status} onChange={handleChange} className="w-full border rounded p-2">
              <option value="TODO">TODO</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="DONE">DONE</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-gray-600 font-medium">분야</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border rounded p-2"
            >
              <option value="Server">Server</option>
              <option value="Network">Network</option>
              <option value="OA">OA</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-gray-600 font-medium">첨부파일</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full border rounded p-2"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-xl font-medium transition"
        >
          요청 접수
        </button>
      </Dialog.Panel>
    </Dialog>
  );
}