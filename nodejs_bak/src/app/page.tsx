"use client";

import { useState } from "react";
import { ClipboardList } from "lucide-react"
import FilterBar from "../components/FilterBar";
import TicketTable from "../components/TicketTable";
import TicketDetail from "../components/TicketDetail";
import CommentSection from "../components/CommentSection";
import EditModal from "../components/EditModal";
import TicketCreateModal from "../components/TicketCreateModal";

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
  worker: string;
  attachment: string | null;
  result?: string;
}

const ticketsData: Ticket[] = [
  {
    id: 1,
    req_date: "2025-08-03 09:12",
    status: "TODO",
    content: "네트워크 연결이 되지 않아 점검이 필요합니다.",
    priority: "보통",
    requester: "차으누",
    department: "총무팀",
    worker: "",
    attachment: null,
    result: ""
  },
  {
    id: 2,
    req_date: "2025-08-02 14:32",
    status: "ACTIVE",
    content: "업체 미팅 일정을 협의합니다.",
    priority: "긴급",
    requester: "차은우",
    department: "정보보호팀",
    worker: "정보보호팀",
    attachment: null,
    result: "논의 중"
  }
];

export default function Home() {
  const [tickets, setTickets] = useState<Ticket[]>(ticketsData);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(ticketsData[0]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Ticket Accept
  const handleCreate = (newTicket: Ticket) => {
    const nextId = tickets.length > 0 ? Math.max(...tickets.map(t => t.id)) + 1 : 1;
    const ticketWithId = {...newTicket, id: nextId};
    setTickets((prev) => [...prev, ticketWithId]);
    setSelectedTicket(ticketWithId);
  }

  const handleAccept = (ticket: Ticket) => {
    const updated = tickets.map((t) =>
      t.id === ticket.id ? { ...t, status: "ACTIVE", acp_date: new Date().toISOString() } : t
    );
    setTickets(updated);
    setSelectedTicket({ ...ticket, status: "ACTIVE", acp_date: new Date().toISOString() });
  };


  const handleEdit = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setEditModalOpen(true);
  };

  {/* 선택된 티켓 삭제 */}
  const handleDelete = (id: number) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const updated = tickets.filter((t) => t.id !== id);
      setTickets(updated);
      setSelectedTicket(null);
    }
  };

  const handleUpdate = (updatedTicket: Ticket) => {
    const updated = tickets.map((t) => (t.id === updatedTicket.id ? updatedTicket : t));
    setTickets(updated);
    setSelectedTicket(updatedTicket);
    setEditModalOpen(false);
  };

  return (
    <div className="flex flex-col h-screen text-gray-900">
      <div className="p-4 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-2 text-xl font-semibold text-gray-800">
          <ClipboardList size={20} className="text-blue-500" />
          <span>HBAMC sys</span>
        </div>

        <div className="flex items-center mb-3">
          {/* FilterBar*/}
          <div className="flex-1">
            <FilterBar onSearch={(filters) => console.log(filters)} />
          </div>
        </div>
      </div>

      <div className="flex flex-1 divide-x divide-gray-100">
        {/* Table Section */}
        <div className="w-2/3 bg-gray-50 p-6 flex flex-col">
            {/* 버튼 우측 정렬 */}
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setCreateModalOpen(true)}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-800 rounded-md shadow-sm text-sm hover:bg-gray-100 transition font-medium">
                ➕ 티켓 추가
              </button>
            </div>
          <TicketTable tickets={tickets} onSelectTicket={setSelectedTicket} />
        </div>

        {/* 티켓 처리 함수 */}
        <div className="w-1/3 bg-gray-100 p-6 flex flex-col">
          <TicketDetail
            ticket={selectedTicket}   // 현재 선택된 티켓 상세 내역
            onAccept={handleAccept}   // 접수 처리 핸들러
            onEdit={handleEdit}       // 티켓 수정 모달 열기
            onDelete={handleDelete}   // 티켓 삭제 처리
          />
          <CommentSection />
        </div>
      </div>

      {selectedTicket && (
        <EditModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          ticket={selectedTicket}
          onSave={handleUpdate}
        />
      )}

      {createModalOpen && (
        <TicketCreateModal
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSubmit={handleCreate}
        />
      )}

    </div>
  );
}