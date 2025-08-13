// TicketCreateModal.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Dialog } from "@headlessui/react";
import { X, Paperclip } from "lucide-react";

interface Ticket {
  req_date: string;
  status: "TODO" | "ACTIVE" | "DONE";
  requester: string;
  department: string;
  category: string;
  attachment: File[];
  content: string;
}

interface TicketCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (ticket: Ticket) => void;
}

export default function TicketCreateModal({ isOpen, onClose, onSubmit }: TicketCreateModalProps) {
  const [form, setForm] = useState<Ticket>({
    req_date: new Date().toISOString(),
    status: "TODO",
    requester: "",
    department: "",
    category: "Server",
    attachment: [],
    content: "",
  });

  const [departments] = useState(["전산팀", "인프라팀"]);
  const [categories] = useState(["Server", "Network", "OA"]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setForm((prev) => ({ ...prev, attachment: [...prev.attachment, ...files] }));
  };

  const handleRemoveFile = (index: number) => {
    setForm((prev) => ({
      ...prev,
      attachment: prev.attachment.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = () => {
    onSubmit(form);
    onClose();
  };

  const pasteRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      const items = event.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.indexOf("image") === 0) {
          const blob = item.getAsFile();
          if (blob) {
            const newFile = new File([blob], `clipboard-${Date.now()}.png`, {
              type: blob.type,
            });
            setForm((prev) => ({
              ...prev,
              attachment: [...(prev.attachment || []), newFile],
            }));
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />

      <Dialog.Panel className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 z-50 space-y-6 border border-gray-200">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>

        <Dialog.Title className="text-xl font-semibold text-gray-800">📝 새 티켓 등록</Dialog.Title>

        <div className="grid grid-cols-2 gap-4 text-sm" ref={pasteRef}>
          <div>
            <label className="block mb-1 font-medium text-gray-700">요청자</label>
            <input name="requester" value={form.requester} onChange={handleChange} className="w-full border border-gray-300 bg-white rounded-md p-2 text-gray-800" />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">요청부서</label>
            <input name="department" value={form.department} onChange={handleChange} className="w-full border border-gray-300 bg-white rounded-md p-2 text-gray-800" list="departments" />
            <datalist id="departments">
              {departments.map((d) => (
                <option key={d} value={d} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">분야</label>
            <input name="category" value={form.category} onChange={handleChange} className="w-full border border-gray-300 bg-white rounded-md p-2 text-gray-800" list="categories" />
            <datalist id="categories">
              {categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">상태</label>
            <select name="status" value={form.status} onChange={handleChange} className="w-full border border-gray-300 bg-white rounded-md p-2 text-gray-800">
              <option value="TODO">TODO</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="DONE">DONE</option>
            </select>
          </div>

          <div className="col-span-2 bg-gray-50 rounded-md p-4">
            <label className="block mb-2 font-medium text-gray-700 flex items-center gap-1">
              <Paperclip className="w-4 h-4 text-gray-500" /> 첨부 파일
            </label>
            <div className="relative inline-block mb-2">
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <button
                type="button"
                className="px-3 py-1 rounded-md bg-gray-100 border border-gray-300 text-gray-800 text-sm hover:bg-gray-200 transition"
              >
                📎 파일 선택
              </button>
            </div>
            <ul className="text-sm text-gray-700 space-y-1">
              {form.attachment.map((file, index) => (
                <li key={index} className="flex justify-between items-center">
                  📎 {file.name}
                  <button onClick={() => handleRemoveFile(index)} className="text-xs text-gray-500 hover:text-gray-700 underline">
                    삭제
                  </button>
                </li>
              ))}
            </ul>
            <p className="text-xs text-gray-400 mt-1">
              ⌨️ 클립보드에서 복사한 이미지를 붙여넣으면 자동 등록됩니다.
            </p>
          </div>


          <div className="col-span-2">
            <label className="block mb-1 font-medium text-gray-700">상세 내역</label>
            <textarea name="content" value={form.content} onChange={handleChange} rows={4} className="w-full border border-gray-300 bg-white rounded-md p-2 text-gray-800" />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-red-100 hover:bg-red-200 text-red-800 text-sm font-medium py-2.5 rounded-xl transition" >
          티켓 생성
        </button>

      </Dialog.Panel>
    </Dialog>
  );
}
