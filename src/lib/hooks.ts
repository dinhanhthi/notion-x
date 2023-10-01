import { useEffect, useRef, useState } from 'react'

/**
 * Used to determine which heading is currently in view
 */
export function useHeadsObserver() {
  const observer = useRef<IntersectionObserver | null>(null)
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    const handleObsever = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry?.isIntersecting) {
          setActiveId(entry.target.id)
        }
      })
    }

    observer.current = new IntersectionObserver(handleObsever, {
      rootMargin: '-100px 0% -80% 0px'
    })

    const elements = document.querySelectorAll('h2, h3')
    elements.forEach(elem => observer?.current?.observe(elem))
    return () => observer.current?.disconnect()
  }, [])

  return { activeId }
}

export const usePostDateStatus = (
  createdDate: string,
  modifiedDate: string,
  withinDay?: number
) => {
  const [status, setStatus] = useState<'new' | 'updated' | 'updatedWithin' | 'normal'>('normal')

  useEffect(() => {
    const currentDate = new Date()
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(currentDate.getDate() - (withinDay || 7))

    if (createdDate) {
      const createdDateObj = new Date(createdDate)

      if (createdDateObj >= sevenDaysAgo) {
        setStatus('new')
        return
      }
    }

    if (modifiedDate) {
      const modifiedDateObj = new Date(modifiedDate)

      if (modifiedDateObj >= sevenDaysAgo) {
        setStatus('updatedWithin')
        return
      }

      if (createdDate) {
        if (modifiedDateObj > new Date(createdDate)) {
          setStatus('updated')
          return
        }
      }
    }

    setStatus('normal')
  }, [createdDate, modifiedDate, withinDay])

  return status
}
