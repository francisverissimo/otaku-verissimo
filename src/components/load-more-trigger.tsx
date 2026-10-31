import { useEffect, useRef } from 'react'
import { DefaultLoading } from './loading'

type LoadMoreTriggerProps = {
  hasMore: boolean
  isLoading: boolean
  onLoadMore: () => void
}

/** Calls `onLoadMore` when the end of a list scrolls into view (infinite scroll). */
export function LoadMoreTrigger({ hasMore, isLoading, onLoadMore }: LoadMoreTriggerProps) {
  const sentinelRef = useRef<HTMLDivElement>(null)
  const onLoadMoreRef = useRef(onLoadMore)

  useEffect(() => {
    onLoadMoreRef.current = onLoadMore
  })

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !hasMore || isLoading) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onLoadMoreRef.current()
      },
      { rootMargin: '400px' }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, isLoading])

  if (isLoading) return <DefaultLoading />

  return hasMore ? <div ref={sentinelRef} className="h-px" /> : null
}
