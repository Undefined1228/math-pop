import { useEffect, useRef } from 'react'

export function useOutsideClick(selector: string, onOutside: () => void) {
  const cbRef = useRef(onOutside)
  useEffect(() => { cbRef.current = onOutside })

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!(e.target as Element).closest(selector)) cbRef.current()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [selector])
}
