"use client";

import { useEffect, useMemo, useRef, useState, KeyboardEvent } from "react";

export interface CommentItem {
  id: number;
  ticket_id: number;
  author: string;
  content: string;
  created_at: string; // ISO 8601
}

interface Props {
  ticketId: number;
  initialComments: CommentItem[];            // ✅ SSR로 주입
  onCreate?: (c: Omit<CommentItem, "id" | "created_at">) => Promise<CommentItem>; 
  // ↑ 옵션: 상위에서 API 호출을 맡기고 싶을 때 사용 (권장)
}

/**
 * SSR 친화:
 * - initialComments를 반드시 props로 주입
 * - 클라이언트에서는 추가만 수행 (낙관적 업데이트)
 * - 엔터로 등록(Shift+Enter는 줄바꿈), 등록 후 자동 스크롤
 */
export default function CommentSection({ ticketId, initialComments, onCreate }: Props) {
  const [comments, setComments] = useState<CommentItem[]>(initialComments || []);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  // SSR → CSR 전환 시, 서버에서 내려준 초기값을 1회 동기화
  useEffect(() => {
    setComments(initialComments || []);
  }, [initialComments]);

  // 새 댓글 생성 (상위 onCreate가 있으면 위임, 없으면 기본 /api 호출)
  const createComment = async (payload: Omit<CommentItem, "id" | "created_at">): Promise<CommentItem> => {
    if (onCreate) return onCreate(payload);

    // 기본 POST (FastAPI 예시 엔드포인트)
    const res = await fetch(`/api/tickets/${payload.ticket_id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Failed to create comment: ${res.status}`);
    return res.json() as Promise<CommentItem>;
  };

  const scrollToEnd = () => endRef.current?.scrollIntoView({ behavior: "smooth" });

  const handleSubmit = async () => {
    const content = comment.trim();
    if (!content || loading) return;

    // 작성자 표시는 임시(추후 로그인 연계)
    const author = "작성자";

    // 낙관적 반영
    const temp: CommentItem = {
      id: Date.now(),
      ticket_id: ticketId,
      author,
      content,
      created_at: new Date().toISOString(),
    };
    setComments((prev) => [...prev, temp]);
    setComment("");
    scrollToEnd();

    try {
      setLoading(true);
      const saved = await createComment({ ticket_id: ticketId, author, content });
      // temp 교체 (id/created_at 보정)
      setComments((prev) =>
        prev.map((c) => (c.id === temp.id ? saved : c))
      );
    } catch (e) {
      // 실패 시 롤백
      setComments((prev) => prev.filter((c) => c.id !== temp.id));
      setComment(content); // 입력 복구
      alert("댓글 등록에 실패했습니다.");
    } finally {
      setLoading(false);
      scrollToEnd();
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const hasComments = useMemo(() => comments.length > 0, [comments]);

  return (
    <div className="p-4 mt-4 bg-white border rounded-2xl text-sm text-gray-600">
      {/* 댓글 목록 */}
      <div className="max-h-48 overflow-auto space-y-3 pr-1">
        {hasComments ? (
          comments.map((c) => (
            <div key={c.id} className="flex items-start gap-2">
              <div className="mt-1 h-2 w-2 rounded-full bg-gray-400" />
              <div className="flex-1">
                <div className="text-gray-800 whitespace-pre-wrap">{c.content}</div>
                <div className="text-xs text-gray-400 mt-1">
                  {c.author} · {new Date(c.created_at).toLocaleString()}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-400">등록된 댓글이 없습니다.</div>
        )}
        <div ref={endRef} />
      </div>

      {/* 입력 폼 */}
      <form
        className="space-y-2 mt-3"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="댓글을 입력하세요... (Enter: 등록, Shift+Enter: 줄바꿈)"
          className="w-full p-2 border rounded-md focus:outline-none focus:ring"
          rows={3}
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || !comment.trim()}
            className={`px-4 py-1 bg-gray-800 text-white rounded-md hover:bg-gray-700 ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "등록 중..." : "등록"}
          </button>
        </div>
      </form>
    </div>
  );
}

