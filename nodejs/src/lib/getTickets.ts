
import { Ticket } from "@/types/ticket";


/**
 * SSR용 티켓 초기화 함수
 * 현재는 빈 배열 반환 (향후 API 연동 가능)
 */

export async function getTickets(): Promise<Ticket[]> {
	return [];
}
