// src/types/ticket.ts


// ── 서버/클라이언트에서 쓰는 문자열 리터럴 타입(중복 방지: enum에서 파생)

export type TicketStatus = "TODO" | "ACTIVE" | "DONE";
export type TicketPriority = "LOW" | "NORMAL" | "CRITICAL";


// ── Enum 정의 ─────────────────────────────────────────────────────────

export enum Priority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  CRITICAL = 'CRITICAL',
}

export enum Status {
  TODO = 'TODO',
  ACTIVE = 'ACTIVE',
  DONE = 'DONE',
}

export enum Category {
  SERVER = 'Server',
  SECURITY = 'Security',
  NETWORK = 'Network',
  OA = 'OA',
  ETC = 'ETC',
}


// ── 라벨 매핑 ─────────────────────────────────────────────────────────

export const StatusLabel: Record<Status, string> = {
  [Status.TODO]: 'TODO',
  [Status.ACTIVE]: 'ACTIVE',
  [Status.DONE]: 'DONE',
};

export const CategoryLabel: Record<Category, string> = {
  [Category.SERVER]: 'Server',
  [Category.SECURITY]: 'Security',
  [Category.NETWORK]: 'Network',
  [Category.OA]: 'OA',
  [Category.ETC]: 'ETC',
};


export type NewTicket = {
  req_date: string;
  requester: string;
  department: string;
  category: Category;
  content: string;
  priority: Priority;
  status: Status;
  worker?: string;
  attachment: File[]; 
};

// 서버 전송용 FormData 빌더 (중앙집중화)
export function buildTicketFormData(t: NewTicket): FormData {
  const fd = new FormData();
  fd.append('requester', t.requester);
  fd.append('department', t.department);
  fd.append('category', t.category);     
  fd.append('content', t.content);
  fd.append('priority', t.priority);     
  fd.append('status', t.status);         
  fd.append('worker', t.worker ?? '');
  for (const f of t.attachment ?? []) {
    fd.append('attachment', f);
  }
  return fd;
}


export type CommentItem = Comment;


// ── 엔터티 타입 ────────────────────────────────────────────────────────

export interface Attachment {
	id: number;	
	ticket_id: number;
	filename: string;
	url: string;
	mime?: string;
	size?: number;
	created_at: string;
}

export interface Comment {
	id: number;
	ticket_id: number;
	author: string;
	content: string;
	created_at: string;
}

export interface BaseTicket {
	req_date: string;
	acp_date?: string | null;
	fin_date?: string | null;

	status: TicketStatus;
	priority: TicketPriority;

	category?: string | null;	// 서버/네트워크/OA 등 (필요 시)
	content: string;

	requester: string;		// 표시용 이름
	department: string;		// 표시용 부서
	worker?: string | null;		// 담당자

	result?: string | null;		// 처리결과 메모
	// 내부 추적값(필요 시): 클라이언트에서 보내되 서버에서 암호화 저장
	requester_id?: string;
	ip_address?: string;
	log_trace_id?: string;
}

export interface Ticket extends BaseTicket {
	id: number;
	attachments?: Attachment[];
	comments?: Comment[];
	created_at?: string;		// DB 생성시각(선택)
	updated_at?: string;		// DB 수정시각(선택)
}



// 업데이트 페이로드
export interface UpdateTicket extends Partial<BaseTicket> {
	id: number;
}



// 목록 조회 필터
export interface TicketFilter {
	date_from?: string;		// ISO 8601 (date-only 허용)
	date_to?: string;
	status?: TicketStatus;
	requester?: string;
	department?: string;
	worker?: string;
	query?: string;			// content 검색
	page?: number;			// 1-base
	page_size?: number;		// 기본 20
}



export interface PagedResult<T> {
	items: T[];
	page: number;
	page_size: number;
	total: number;
}

