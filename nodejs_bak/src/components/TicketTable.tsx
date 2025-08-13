export default function TicketTable({ tickets, onSelectTicket }) {
  return (
    <div className="mt-4 border border-gray-100 rounded-lg shadow-sm bg-white">
      {/* ✅ 헤더 */}
      <div className="grid grid-cols-[50px_140px_1fr_100px_120px_100px]
                      bg-gray-50 text-[13px] font-semibold text-gray-700
                      border-b border-gray-200
                      px-4 py-2 rounded-t-lg">
        <div className="text-center whitespace-nowrap">#</div>
        <div className="text-center whitespace-nowrap">요청일시</div>
        <div className="text-center whitespace-nowrap">내용</div>
        <div className="text-center whitespace-nowrap">요청자</div>
        <div className="text-center whitespace-nowrap">요청부서</div>
        <div className="text-center whitespace-nowrap">상태</div>
      </div>

      {/* ✅ 데이터 */}
      {tickets.map((t) => (
        <div
          key={t.id}
          onClick={() => onSelectTicket(t)}
          className="grid grid-cols-[50px_140px_1fr_100px_120px_100px]
                     items-center text-sm px-4 py-3
                     border-b border-dashed border-gray-100
                     hover:bg-gray-50 hover:shadow-[inset_0_0_6px_rgba(0,0,0,0.03)]
                     transition-all duration-150 ease-in-out cursor-pointer"
        >
          {/* 번호 */}
          <div className="text-gray-500 text-xs text-center">{t.id}</div>

          {/* 접수일시 */}
          <div className="text-gray-500 text-xs text-center">{t.req_date}</div>

          {/* 내용 */}
          <div className="text-gray-800 text-[13px] text-center">{t.content}</div>

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
      ))}
    </div>
  );
}