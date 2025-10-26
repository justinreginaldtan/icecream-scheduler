import { useEffect, useRef, useState } from 'react'

export function useCountUp(end: number, duration: number = 1200, startDelay: number = 200) {
  const [count, setCount] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const rafRef = useRef<number>()
  const startTimeRef = useRef<number>()

  useEffect(() => {
    // Trigger animation after a brief delay
    const timeoutId = setTimeout(() => {
      setIsAnimating(true)
    }, startDelay)

    return () => {
      clearTimeout(timeoutId)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [startDelay])

  useEffect(() => {
    if (!isAnimating) return

    const animate = (currentTime: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = currentTime
      }

      const progress = Math.min((currentTime - startTimeRef.current) / duration, 1)
      
      // Easing: ease-out-cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const currentCount = Math.floor(eased * end)
      
      setCount(currentCount)

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      } else {
        setCount(end)
      }
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [isAnimating, end, duration])

  return count
}

