// TicketDetail.tsx
"use client";

import { CalendarDays, Building, User2, CheckCircle, Paperclip } from "lucide-react";
import { useState } from "react";
import TicketEditModal from "./EditModal";

export default function TicketDetail({ ticket }) {
  const [editOpen, setEditOpen] = useState(false);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);

  if (!ticket) return <div className="text-gray-400">티켓을 선택하세요.</div>;

  return (
    <div className="p-4 bg-white rounded-2xl shadow-md border border-gray-100 mt-4 space-y-6 text-sm">
      {/* 상태 + 요청 접수 버튼 */}
      <div className="flex items-center space-x-2">
        <span className={`text-xs font-semibold px-2 py-1 rounded-md inline-block ${
          ticket.status === "TODO"
            ? "bg-yellow-100 text-yellow-800"
            : ticket.status === "ACTIVE"
            ? "bg-blue-100 text-blue-800"
            : "bg-pink-100 text-pink-800"
        }`}>
          {ticket.status}
        </span>
        {ticket.status === "TODO" && (
          <button
            onClick={() => setEditOpen(true)}
            className="text-xs text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 px-2 py-1 rounded-md transition"
          >
            요청 접수
          </button>
        )}
      </div>

      {/* 요청 내역 */}
      <div className="space-y-2">
        <div className="text-sm font-semibold text-gray-700">📥 요청 내역</div>

        <div className="flex items-center">
          <CalendarDays size={16} className="text-gray-500 mr-2" />
          <span className="w-20 font-medium text-gray-600">요청일시</span>
          <span>{ticket.req_date}</span>
        </div>
        <div className="flex items-center">
          <Building size={16} className="text-gray-500 mr-2" />
          <span className="w-20 font-medium text-gray-600">요청부서</span>
          <span>{ticket.department}</span>
        </div>
        <div className="flex items-center">
          <User2 size={16} className="text-gray-500 mr-2" />
          <span className="w-20 font-medium text-gray-600">요청자</span>
          <span>{ticket.requester}</span>
        </div>

        <div className="bg-gray-100 rounded-lg px-4 py-3 text-gray-800 whitespace-pre-line">
          {ticket.content}
        </div>

        {/* 첨부파일 섹션 */}
        console.log("🔍 현재 attachment 값:", ticket.attachment);

        <div className="bg-gray-50 rounded-xl p-4 mt-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
            <Paperclip className="w-4 h-4 text-gray-500" />
            첨부파일
          </h3>console.log("🔍 현재 attachment 값:", ticket.attachment);

          {Array.isArray(ticket.attachment) && ticket.attachment.filter(f => f).length > 0 ? (
            <ul className="space-y-2">
              {ticket.attachment.map((file: any, idx: number) => {
                const url = typeof file === "string" ? file : file?.url;
                if (!url) return null;console.log("🔍 현재 attachment 값:", ticket.attachment);

                const filename = decodeURIComponent(url.split("/").pop() || `file-${idx}`);
                const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(filename);

                return (
                  <li
                    key={idx}
                    className="bg-white border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-800 flex justify-between items-center"
                  >
                    <span className="truncate">{filename}</span>
                    <div className="flex items-center gap-2">
                      {isImage && (
                        <button
                          className="text-xs text-blue-500 hover:underline"
                          onClick={() => window.open(url, "_blank")}
                        >
                          미리보기
                        </button>
                      )}
                      <a href={url} download className="text-xs text-gray-500 hover:underline">
                        다운로드
                      </a>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="text-gray-400 text-sm">첨부파일이 없습니다.</div>
          )}
        </div>

      </div> {/* 요청내역 전체 닫힘 */}

      {/* 처리 내역 */}
      <div className="space-y-2 border-t pt-4 border-gray-200">
        <div className="text-sm font-semibold text-gray-700">🛠 처리 내역</div>

        <div className="flex items-center">
          <User2 size={16} className="text-gray-500 mr-2" />
          <span className="w-20 font-medium text-gray-600">처리자</span>
          <span>{ticket.worker}</span>
        </div>

        <div className="flex items-center">
          <CalendarDays size={16} className="text-gray-500 mr-2" />
          <span className="w-20 font-medium text-gray-600">접수일시</span>
          <span>{ticket.acp_date || <span className="italic text-gray-400">-</span>}</span>
        </div>

        {ticket.status === "DONE" && ticket.fin_date && (
          <div className="flex items-center">
            <CheckCircle size={16} className="text-green-500 mr-2" />
            <span className="w-20 font-medium text-gray-600">완료일시</span>
            <span>{ticket.fin_date}</span>
          </div>
        )}

        <div className="bg-gray-100 rounded-lg px-4 py-3 text-gray-800 whitespace-pre-line">
          {ticket.result ? (
            ticket.result
          ) : (
            <span className="italic text-gray-400">작성된 처리 내역이 없습니다.</span>
          )}
        </div>
      </div>

      <TicketEditModal isOpen={editOpen} onClose={() => setEditOpen(false)} ticket={ticket} />

      {/* 이미지 원본 보기 */}
      {previewSrc && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center cursor-zoom-out"
          onClick={() => setPreviewSrc(null)}
        >
          <img
            src={previewSrc}
            alt="첨부파일 미리보기"
            className="max-w-full max-h-full object-contain rounded shadow-lg"
          />
        </div>
      )}
    </div>
  );
}
