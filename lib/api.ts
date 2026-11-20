export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const normalized = path.startsWith('/') ? path : `/${path}`
  const response = await fetch(`/api/backend${normalized}`, {
    ...init,
    headers: { Accept: 'application/json', ...(init?.body ? { 'Content-Type': 'application/json' } : {}), ...init?.headers },
    cache: 'no-store',
  })
  if (!response.ok) throw new Error(`Niboshop API ${response.status}: ${await response.text()}`)
  return response.json() as Promise<T>
}
