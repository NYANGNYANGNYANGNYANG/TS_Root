"use client";

import { useState, KeyboardEvent } from "react";

interface FilterBarProps {
  onSearch: (filters: {
    startDate: string;
    endDate: string;
    requester: string;
    department: string;
    worker: string;
    status: string;
    keyword: string;
  }) => void;
}

export default function FilterBar({ onSearch }: FilterBarProps) {
  const today = new Date().toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [requester, setRequester] = useState("");
  const [department, setDepartment] = useState("");
  const [worker, setWorker] = useState("");
  const [status, setStatus] = useState("");
  const [keyword, setKeyword] = useState("");

  const handleSearch = () => {
    onSearch({ startDate, endDate, requester, department, worker, status, keyword });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="flex items-center space-x-2 w-full bg-white p-3 rounded-md">
      <input
        type="date"
        value={startDate}
        onChange={(e) => {
          const v = e.target.value;
          setStartDate(v);
          if (endDate < v) setEndDate(v); // 유효성: 시작일 > 종료일 방지
        }}
        className="px-3 py-1.5 border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-gray-300 focus:outline-none"
      />
      <span className="text-gray-400">~</span>
      <input
        type="date"
        value={endDate}
        min={startDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="px-3 py-1.5 border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-gray-300 focus:outline-none"
      />

      <input
        type="text"
        placeholder="요청자"
        value={requester}
        onChange={(e) => setRequester(e.target.value)}
        onKeyDown={handleKeyDown}
        className="px-3 py-1.5 border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-gray-300 focus:outline-none"
      />

      <input
        type="text"
        placeholder="요청부서"
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
        onKeyDown={handleKeyDown}
        className="px-3 py-1.5 border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-gray-300 focus:outline-none"
      />

      <input
        type="text"
        placeholder="처리자"
        value={worker}
        onChange={(e) => setWorker(e.target.value)}
        onKeyDown={handleKeyDown}
        className="px-3 py-1.5 border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-gray-300 focus:outline-none"
      />

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="px-3 py-1.5 border border-gray-200 rounded-md text-sm bg-white focus:ring-1 focus:ring-gray-300 focus:outline-none"
      >
        <option value="">상태(전체)</option>
        <option value="TODO">TODO</option>
        <option value="ACTIVE">ACTIVE</option>
        <option value="DONE">DONE</option>
      </select>

      <input
        type="text"
        placeholder="검색어"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 px-3 py-1.5 border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-gray-300 focus:outline-none"
      />

      <button
        type="button"
        onClick={handleSearch}
        className="px-3 py-1.5 bg-white border border-gray-300 text-gray-800 rounded-md shadow-sm text-sm hover:bg-gray-100 transition"
      >
        검색
      </button>
    </div>
  );
}

