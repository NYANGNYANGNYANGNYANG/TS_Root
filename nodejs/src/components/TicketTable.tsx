// src/components/TicketTable.tsx


"use client";

import { Ticket } from "@/types/ticket";

interface TicketTableProps {
	tickets: Ticket[];
	onSelectTicket: (ticket: Ticket) => void;
	clampLines?: number;
}

export default function TicketTable({
	tickets,
	onSelectTicket,
	clampLines = 1,
}: TicketTableProps) {
	const contentClampClass =
		clampLines === 2 ? "truncate" : `line-clamp-${clampLines}`;

	return (
		<div className="mt-4 border border-gray-100 rounded-lg shadow-sm bg-white overflow-hidden">
			{/* 헤더 */}
			<div className="grid grid-cols-[50px_140px_1fr_100px_120px_100px] bg-gray-50 text-[13px] font-semibold text-gray-700 border-b border-gray-200 px-4 py-2 rounded-t-lg">
				<div className="text-center whitespace-nowrap">#</div>
				<div className="text-center whitespace-nowrap">요청일시</div>
				<div className="text-left whitespace-nowrap">내용</div>
				<div className="text-center whitespace-nowrap">요청자</div>
				<div className="text-center whitespace-nowrap">요청부서</div>
				<div className="text-center whitespace-nowrap">상태</div>
			</div>

			{/* 데이터 */}
			{tickets.length === 0 ? (
				<div className="px-4 py-6 text-sm text-gray-500 text-center">
					표시할 티켓이 없습니다.
				</div>
			) : (
				tickets.map((t) => (
					<div
						key={t.id}
						onClick={() => onSelectTicket(t)}
						className="grid grid-cols-[50px_140px_1fr_100px_120px_100px] items-center text-sm px-4 py-3 border-b border-dashed border-gray-100 hover:bg-gray-50 hover:shadow-[inset_0_0_6px_rgba(0,0,0,0.03)] transition-all duration-150 ease-in-out cursor-pointer"
					>
						{/* 번호 */}
						<div className="text-gray-500 text-xs text-center">{t.id}</div>

						{/* 접수일시 */}
						<div className="text-gray-500 text-xs text-center">{t.req_date}</div>

						{/* 내용 (기본 1줄, 필요 시 line-clamp-N) */}
						<div
							className={`text-gray-800 text-[13px] text-center ${contentClampClass}`}
							title={clampLines === 1 ? t.content : undefined}
						>
							{t.content}
						</div>

						{/* 요청자 */}
						<div className="text-gray-500 text-xs text-center">{t.requester}</div>

						{/* 요청부서 */}
						<div className="text-gray-500 text-xs text-center">{t.department}</div>

						{/* 상태 태그 */}
						<div className="flex justify-center">
							<span
								className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
									t.status === "TODO"
										? "bg-gray-100 text-gray-700"
										: t.status === "ACTIVE"
										? "bg-blue-100 text-blue-700"
										: "bg-green-100 text-green-700"
								}`}
							>
								{t.status}
							</span>
						</div>
					</div>
				))
			)}
		</div>
	);
}

