"use client";

import { useState } from "react";

export default function FilterBar({ onSearch }: { onSearch: (filters: any) => void }) {
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

  return (
    <div className="flex items-center space-x-2 w-full bg-white p-3 rounded-md">
      {/* ✅ 날짜 */}
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
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

      {/* ✅ 요청자 */}
      <input
        type="text"
        placeholder="요청자"
        value={requester}
        onChange={(e) => setRequester(e.target.value)}
        className="px-3 py-1.5 border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-gray-300 focus:outline-none"
      />

      {/* ✅ 요청부서 */}
      <input
        type="text"
        placeholder="요청부서"
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
        className="px-3 py-1.5 border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-gray-300 focus:outline-none"
      />

      {/* ✅ 처리자 */}
      <input
        type="text"
        placeholder="처리자"
        value={worker}
        onChange={(e) => setWorker(e.target.value)}
        className="px-3 py-1.5 border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-gray-300 focus:outline-none"
      />

      {/* ✅ 상태 */}
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="px-3 py-1.5 border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-gray-300 focus:outline-none"
      >
        <option value="">상태</option>
        <option value="TODO">TODO</option>
        <option value="ACTIVE">ACTIVE</option>
        <option value="DONE">DONE</option>
      </select>

      {/* ✅ 검색 */}
      <input
        type="text"
        placeholder="내용 검색"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="flex-1 px-3 py-1.5 border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-gray-300 focus:outline-none"
      />

      <button
        onClick={handleSearch}
        className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-md text-sm"
      >
        검색
      </button>
    </div>
  );
}