"use client";

import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { Ticket } from "@/types/ticket";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: Ticket | null;
  onSubmit: (updated: Ticket) => void;
}

export default function EditModal({ isOpen, onClose, ticket, onSubmit }: EditModalProps) {
  const [form, setForm] = useState<Ticket | null>(null);

  useEffect(() => {
    if (isOpen && ticket) setForm({ ...ticket });
    if (!isOpen) setForm(null);
  }, [isOpen, ticket]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setForm((prev) =>
      prev
        ? {
            ...prev,
            // 기존 첨부 보존 + 새 파일 추가 (프론트 상태 유지)
            attachment: [...(prev as any).attachment ?? [], ...files],
          }
        : prev
    );
  };

  const handleSubmit = () => {
    if (!form) return;
    const now = new Date().toISOString();

    const next: Ticket = { ...form };
    // 상태 전이에 따른 날짜 자동 세팅
    if (next.status === "ACTIVE" && !next.acp_date) next.acp_date = now;
    if (next.status === "DONE" && !next.fin_date) next.fin_date = now;

    onSubmit(next);
    onClose();
  };

  // 폼 초기화 전이면 렌더링하지 않음
  if (!form) return null;

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
              value={form.worker ?? ""}
              onChange={handleChange}
              className="w-full border rounded p-2"
              placeholder="접수자 이름"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-600 font-medium">상태</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border rounded p-2"
            >
              <option value="TODO">TODO</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="DONE">DONE</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-gray-600 font-medium">분야</label>
            <select
              name="category"
              value={(form as any).category ?? "Server"}
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
            <input type="file" multiple onChange={handleFileChange} className="w-full border rounded p-2" />
            {(form as any).attachment?.map?.((file: any, idx: number) => (
              <p key={idx} className="text-xs text-gray-500 mt-1">
                📎 {file?.name ?? String(file)}
              </p>
            ))}
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

