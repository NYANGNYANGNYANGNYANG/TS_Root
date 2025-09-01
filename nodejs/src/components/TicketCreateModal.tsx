// src/app/components/TicketCreateModal.tsx

"use client";

import { useMemo, useState } from "react";
import { Dialog, DialogBackdrop } from "@headlessui/react";
import { X, Paperclip } from "lucide-react";
import { NewTicket, Status, Priority, Category } from "@/types/ticket";
import CreatableSelect from "@/components/CreatableSelect";

interface TicketCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (ticket: NewTicket) => void;
}

export default function TicketCreateModal({
  isOpen,
  onClose,
  onSubmit,
}: TicketCreateModalProps) {
  const [form, setForm] = useState<NewTicket>({
    req_date: new Date().toISOString(),
    status: Status.TODO,
    requester: "",
    department: "",
    category: Category.SERVER,
    content: "",
    priority: Priority.NORMAL,
    worker: "",
    attachment: [],
  });

  // 사용자 자유입력 + 옵션 확장
  const initialCategoryOptions = useMemo(
    () => Array.from(new Set(Object.values(Category).map(String))),
    []
  );
  const initialPriorityOptions = useMemo(
    () => Array.from(new Set(Object.values(Priority).map(String))),
    []
  );

  const [categoryInput, setCategoryInput] = useState<string>(String(form.category));
  const [priorityInput, setPriorityInput] = useState<string>(String(form.priority));
  const [categoryOptions, setCategoryOptions] = useState<string[]>(initialCategoryOptions);
  const [priorityOptions, setPriorityOptions] = useState<string[]>(initialPriorityOptions);

  const addCategoryOption = (v: string) =>
    setCategoryOptions((prev) => (prev.includes(v) ? prev : [...prev, v]));
  const addPriorityOption = (v: string) =>
    setPriorityOptions((prev) => (prev.includes(v) ? prev : [...prev, v]));

  // 값 변경 핸들러 (status/requester/department/content/worker만 처리)
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => {
      if (name === "status") return { ...prev, status: value as Status };
      return { ...prev, [name]: value };
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setForm((prev) => ({
      ...prev,
      attachment: [...prev.attachment, ...files],
    }));
  };

  const handleRemoveFile = (index: number) => {
    setForm((prev) => ({
      ...prev,
      attachment: prev.attachment.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = () => {
    if (!form.requester || !form.department || !form.content) {
      alert("요청자/요청부서/내용은 필수입니다.");
      return;
    }

    const payload: NewTicket = {
      ...form,
      // 자유 입력값 그대로 전달(백엔드에서 정규화/사전처리)
      status: Status.TODO,
      category: categoryInput as unknown as Category,
      priority: priorityInput as unknown as Priority,
    };

    onSubmit(payload);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50">
      <div className="flex items-center justify-center min-h-screen">
        <DialogBackdrop className="fixed inset-0 bg-black/30" />

        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg mx-auto p-6">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>

          <Dialog.Title className="text-lg font-semibold mb-4">
            📝 새 티켓 등록
          </Dialog.Title>

          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-gray-700">요청자</label>
              <input
                name="requester"
                value={form.requester}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">요청부서</label>
              <input
                name="department"
                value={form.department}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <div>
              <CreatableSelect
                label="분야"
                placeholder="예: Server / Network / ... (직접 입력 가능)"
                value={categoryInput}
                onChange={setCategoryInput}
                options={categoryOptions}
                onCreate={addCategoryOption}
                required
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block mb-1 font-medium text-gray-700">상태</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                >
                  {Object.values(Status).map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1">
                <CreatableSelect
                  label="우선순위"
                  placeholder="예: NORMAL / CRITICAL / ... (직접 입력 가능)"
                  value={priorityInput}
                  onChange={setPriorityInput}
                  options={priorityOptions}
                  onCreate={addPriorityOption}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">내용</label>
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 min-h-28"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700 flex items-center gap-1">
                <Paperclip size={16} /> 첨부파일
              </label>
              <input type="file" multiple onChange={handleFileChange} />
              <ul className="mt-2 space-y-1">
                {form.attachment.map((file, i) => (
                  <li key={i} className="flex justify-between items-center text-sm">
                    <span>{file.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(i)}
                      className="text-red-500 hover:underline"
                    >
                      제거
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              취소
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              생성
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}

