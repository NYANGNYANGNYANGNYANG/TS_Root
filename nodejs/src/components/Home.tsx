// src/components/Home.tsx
"use client";

import { useState } from "react";
import { ClipboardList } from "lucide-react";
import { Ticket, NewTicket, CommentItem } from "@/types/ticket";
import FilterBar from "./FilterBar";
import TicketTable from "./TicketTable";
import TicketDetail from "./TicketDetail";
import CommentSection from "./CommentSection";
import EditModal from "./EditModal";
import TicketCreateModal from "./TicketCreateModal";
import { getJSON, patchJSON, del, postForm } from "@/lib/api";

interface HomeProps {
  initialTickets: Ticket[];
  commentsMap?: Record<number, CommentItem[]>;
}

export default function Home({ initialTickets, commentsMap = {} }: HomeProps) {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(
    initialTickets[0] ?? null
  );
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    requester: "",
    department: "",
    worker: "",
    status: "",
    keyword: "",
  });

  const qs = new URLSearchParams(
    Object.entries(filters).filter(([, v]) => v)
  ).toString();

  // 목록 재조회
  const refresh = async () => {
    const url = qs ? `/api/tickets?${qs}` : `/api/tickets`;
    const items = await getJSON<Ticket[]>(url);
    setTickets(items);
    if (items.length > 0) setSelectedTicket(items[0]);
    else setSelectedTicket(null);
  };

  // 필터 적용
  const handleSearch = async (f: typeof filters) => {
    setFilters(f);
    const url = Object.values(f).some(Boolean)
      ? `/api/tickets?${new URLSearchParams(f).toString()}`
      : `/api/tickets`;
    const items = await getJSON<Ticket[]>(url);
    setTickets(items);
    setSelectedTicket(items[0] ?? null);
  };

  // multipart/form-data
  const handleCreate = async (newTicket: NewTicket) => {
    const fd = new FormData();
    fd.append("requester", newTicket.requester);
    fd.append("department", newTicket.department);
    fd.append("content", newTicket.content);

    // 자유입력/옵션값 그대로 전달(백엔드 정규화 전제)
    fd.append("category", String(newTicket.category ?? "ETC"));
    fd.append("priority", String(newTicket.priority ?? "NORMAL"));
    fd.append("status", "TODO"); // 생성은 TODO로 시작
    if ((newTicket as any).worker) fd.append("worker", (newTicket as any).worker);
    for (const f of newTicket.attachment || []) {
      fd.append("attachment", f, (f as File).name);
    }


    const created = await postForm<Ticket>(`/api/tickets`, fd);
    setTickets((prev) => [created, ...prev]);
    setSelectedTicket(created);
    setCreateModalOpen(false);
  };

  // 공통 업데이트 (PATCH는 JSON 사용 중)
  const handleUpdateTicket = async (updated: Ticket) => {
    const saved = await patchJSON<Ticket>(`/api/tickets/${updated.id}`, updated);
    setTickets((prev) => prev.map((t) => (t.id === saved.id ? saved : t)));
    setSelectedTicket((prev) => (prev && prev.id === saved.id ? saved : prev));
  };

  // 요청접수 → ACTIVE + acp_date
  const handleAccept = async (ticket: Ticket) => {
    const payload = { status: "ACTIVE", acp_date: new Date().toISOString() };
    const saved = await patchJSON<Ticket>(`/api/tickets/${ticket.id}`, payload);
    setTickets((prev) => prev.map((t) => (t.id === saved.id ? saved : t)));
    setSelectedTicket(saved);
  };

  // 삭제
  const handleDelete = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await del(`/api/tickets/${id}`);
    setTickets((prev) => prev.filter((t) => t.id !== id));
    setSelectedTicket(null);
  };

  // 편집 저장 (EditModal)
  const handleEditSave = async (updated: Ticket) => {
    await handleUpdateTicket(updated);
    setEditModalOpen(false);
  };

  return (
    <div className="flex flex-col h-screen text-gray-900">
      {/* 헤더 */}
      <div className="p-4 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-2 text-xl font-semibold text-gray-800">
          <ClipboardList size={20} className="text-blue-500" />
          <span>HBAMC sys</span>
        </div>
        <div className="flex items-center mb-3">
          <div className="flex-1">
            <FilterBar onSearch={handleSearch} />
          </div>
          <button
            type="button"
            onClick={refresh}
            className="ml-2 px-3 py-1.5 bg-white border border-gray-300 text-gray-800 rounded-md shadow-sm text-sm hover:bg-gray-100 transition"
          >
            새로고침
          </button>
        </div>
      </div>

      {/* 본문 */}
      <div className="flex flex-1 divide-x divide-gray-100">
        {/* 티켓 리스트 */}
        <div className="w-2/3 bg-gray-50 p-6 flex flex-col">
          <div className="flex justify-end mb-2">
            <button
              onClick={() => setCreateModalOpen(true)}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-800 rounded-md shadow-sm text-sm hover:bg-gray-100 transition font-medium"
            >
              ➕ 티켓 추가
            </button>
          </div>
          <TicketTable
            tickets={tickets}
            onSelectTicket={setSelectedTicket}
            clampLines={2}
          />
        </div>

        {/* 티켓 상세 + 댓글 */}
        <div className="w-1/3 bg-gray-100 p-6 flex flex-col">
          {selectedTicket && (
            <>
              <TicketDetail
                ticket={selectedTicket}
                onUpdateTicket={handleUpdateTicket}
                // 필요 시 요청접수 버튼을 TicketDetail에서 handleAccept로 연결
                // onAccept={handleAccept}
              />
              <CommentSection
                ticketId={selectedTicket.id}
                initialComments={commentsMap?.[selectedTicket.id] ?? []}
              />
            </>
          )}
        </div>
      </div>

      {/* 수정 모달 */}
      {selectedTicket && (
        <EditModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          ticket={selectedTicket}
          onSubmit={handleEditSave}
        />
      )}

      {/* 생성 모달 */}
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

