// src/components/CreatableSelect.tsx

"use client";


import { useId } from "react";

type Props = {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  onCreate?: (v: string) => void;
  required?: boolean;
};

export default function CreatableSelect({
  label,
  placeholder,
  value,
  onChange,
  options,
  onCreate,
  required,
}: Props) {
  const listId = useId();

  const handleAdd = () => {
    const v = (value || "").trim();
    if (!v) return;
    onCreate?.(v);
  };

  return (
    <div className="flex items-end gap-2">
      <div className="flex-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <input
          list={listId}
          className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
        />
        <datalist id={listId}>
          {options.map((opt) => (
            <option key={opt} value={opt} />
          ))}
        </datalist>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        className="px-3 h-10 border rounded-md text-sm bg-white hover:bg-gray-50"
        title="현재 입력값을 옵션에 추가"
      >
        추가
      </button>
    </div>
  );
}

