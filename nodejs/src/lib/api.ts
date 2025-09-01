// src/lib/api.ts


export async function getJSON<T>(url: string, init?: RequestInit): Promise<T> {
	const res = await fetch(url, { headers: { "Content-Type": "application/json" }, ...init });
	if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  		return res.json() as Promise<T>;
}


export async function postJSON<T>(url: string, data: unknown): Promise<T> {
	const res = await fetch(url, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
	return res.json();
}


export async function postForm<T>(url: string, fd: FormData): Promise<T> {
  const res = await fetch(url, { method: "POST", body: fd });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} :: ${await res.text()}`);
  return res.json();
}


export async function patchJSON<T>(url: string, body: unknown, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    ...init,
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}


export async function del(url: string, init?: RequestInit): Promise<void> {
  const res = await fetch(url, { method: "DELETE", ...init });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
}

