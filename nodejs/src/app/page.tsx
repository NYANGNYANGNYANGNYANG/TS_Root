//src/app/page.tsx



'use client'

import { useEffect, useState } from "react";
import Home from "@/components/Home";
import { Ticket } from "@/types/ticket";
import { CommentItem } from "@/components/CommentSection";

export default function Page() {
  const [tickets, setTickets] = useState<Ticket[] | null>(null);
  const [commentsMap, setCommentsMap] = useState<Record<number, CommentItem[]>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/tickets", { cache: "no-store" });
        if (!res.ok) throw new Error(`tickets: ${res.status}`);
        const data: Ticket[] = await res.json();

        setTickets(data);

        if (data.length > 0) {
          const ids = data.map(t => t.id).join(",");
          const cRes = await fetch(`/api/comments?ticket_ids=${encodeURIComponent(ids)}`, { cache: "no-store" });
          if (cRes.ok) {
            const cmap: Record<number, CommentItem[]> = await cRes.json();
            setCommentsMap(cmap);
          }
        }
      } catch (e: any) {
        setError(e?.message ?? "fetch error");
        setTickets([]);
      }
    };
    load();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">티켓 시스템</h1>
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm">
            연동 오류: {error}
          </div>
        </div>
      </div>
    );
  }

  if (tickets === null) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">티켓 시스템</h1>
          <div className="rounded-xl border bg-white p-4 text-sm">불러오는 중...</div>
        </div>
      </div>
    );
  }

  return <Home initialTickets={tickets} commentsMap={commentsMap}/>;
}

