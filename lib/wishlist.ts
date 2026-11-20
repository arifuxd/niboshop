'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { api } from '@/lib/api'

const KEY = 'niboshop-wishlist'
let syncPromise: Promise<string[]> | null = null
let lastAuthReset = 0

function readLocal(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]') as string[]
  } catch {
    return []
  }
}

function syncWishlist() {
  if (!syncPromise) {
    syncPromise = api<string[]>('/account/wishlist')
      .then(async (saved) => {
        const local = readLocal()
        for (const id of local) {
          if (!saved.includes(id)) {
            await api(`/account/wishlist/${encodeURIComponent(id)}`, { method: 'POST' })
          }
        }
        const merged = [...new Set([...saved, ...local])]
        localStorage.setItem(KEY, JSON.stringify(merged))
        return merged
      })
      .catch((error) => {
        syncPromise = null
        throw error
      })
  }
  return syncPromise
}

export function useWishlist() {
  const [ids, setIds] = useState<string[]>([])
  const [remote, setRemote] = useState(false)
  const idsRef = useRef<string[]>([])

  const updateIds = useCallback((next: string[]) => {
    idsRef.current = next
    setIds(next)
  }, [])

  const publishIds = useCallback((next: string[]) => {
    updateIds(next)
    localStorage.setItem(KEY, JSON.stringify(next))
    window.dispatchEvent(new Event('niboshop-wishlist-change'))
  }, [updateIds])

  useEffect(() => {
    let active = true
    updateIds(readLocal())

    void syncWishlist()
      .then((saved) => {
        if (active) {
          updateIds(saved)
          setRemote(true)
        }
      })
      .catch(() => {
        if (active) {
          updateIds(readLocal())
          setRemote(false)
        }
      })

    const authChanged = () => {
      const now = Date.now()
      if (now - lastAuthReset > 25) {
        lastAuthReset = now
        syncPromise = null
      }
      void syncWishlist()
        .then((saved) => {
          if (active) {
            updateIds(saved)
            setRemote(true)
          }
        })
        .catch(() => {
          if (active) setRemote(false)
        })
    }

    window.addEventListener('niboshop-auth-change', authChanged)
    return () => {
      active = false
      window.removeEventListener('niboshop-auth-change', authChanged)
    }
  }, [updateIds])

  useEffect(() => {
    const read = () => updateIds(readLocal())
    window.addEventListener('storage', read)
    window.addEventListener('niboshop-wishlist-change', read)
    return () => {
      window.removeEventListener('storage', read)
      window.removeEventListener('niboshop-wishlist-change', read)
    }
  }, [updateIds])

  const toggle = useCallback((id: string) => {
    const current = idsRef.current
    const next = current.includes(id) ? current.filter((savedId) => savedId !== id) : [...current, id]
    publishIds(next)

    if (remote) {
      void api<string[]>(`/account/wishlist/${encodeURIComponent(id)}`, { method: 'POST' })
        .then(publishIds)
        .catch(() => setRemote(false))
    }
  }, [publishIds, remote])

  return { ids, toggle }
}
