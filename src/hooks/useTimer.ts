import { useEffect, useRef, useState } from 'react'

export function useTimer(durationSeconds: number) {
  const [remaining, setRemaining] = useState(durationSeconds)
  const [running, setRunning] = useState(false)
  const [alert, setAlert] = useState(false)
  const [prevDuration, setPrevDuration] = useState(durationSeconds)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  if (prevDuration !== durationSeconds) {
    setPrevDuration(durationSeconds)
    setRunning(false)
    setRemaining(durationSeconds)
    setAlert(false)
  }

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining(r => {
          if (r <= 1) { setRunning(false); setAlert(true); return 0 }
          return r - 1
        })
      }, 1000)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [running])

  useEffect(() => {
    if (!alert) return
    try {
      const ctx = new AudioContext()
      const beepDuration = 0.22
      const beepGap = 0.28
      const setGap = 0.5
      const setDuration = beepDuration + beepGap * 2
      Array.from({ length: 3 }).forEach((_, set) => {
        Array.from({ length: 3 }).forEach((_, beat) => {
          const t = set * (setDuration + setGap) + beat * beepGap
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.connect(gain)
          gain.connect(ctx.destination)
          osc.frequency.value = 880
          osc.type = 'sine'
          gain.gain.setValueAtTime(0.4, ctx.currentTime + t)
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + beepDuration)
          osc.start(ctx.currentTime + t)
          osc.stop(ctx.currentTime + t + beepDuration)
        })
      })
    } catch {
      // AudioContext 미지원 브라우저에서는 무음 동작
    }
  }, [alert])

  const start = (overrideDuration?: number) => {
    const d = overrideDuration ?? durationSeconds
    if (intervalRef.current) clearInterval(intervalRef.current)
    setAlert(false)
    setRemaining(d)
    setRunning(true)
  }

  const stop = () => {
    setRunning(false)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }

  return { remaining, running, start, stop, alert }
}
