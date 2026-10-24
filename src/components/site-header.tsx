import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent } from "react"
import { site } from "@/data"

type Point = { x: number; y: number; oldX: number; oldY: number }

const POINT_COUNT = 13
const SEGMENT_LENGTH = 8
const REST_X = 36
const REST_Y = (POINT_COUNT - 1) * SEGMENT_LENGTH

function createPoints(): Point[] {
  return Array.from({ length: POINT_COUNT }, (_, index) => ({ x: REST_X, y: index * SEGMENT_LENGTH, oldX: REST_X, oldY: index * SEGMENT_LENGTH }))
}

function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("portfolio-theme")
    return saved ? saved === "dark" : true
  })
  const [points, setPoints] = useState(createPoints)
  const [dragging, setDragging] = useState(false)
  const knobRef = useRef<HTMLButtonElement>(null)
  const pointsRef = useRef(points)
  const draggingRef = useRef(false)
  const draggedRef = useRef(false)
  const suppressClick = useRef(false)
  const frame = useRef<number | null>(null)
  const swayUntil = useRef(0)
  const reducedMotion = useRef(false)

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark)
    document.documentElement.classList.toggle("light", !dark)
    localStorage.setItem("portfolio-theme", dark ? "dark" : "light")
    const syncTheme = () => setDark(document.documentElement.classList.contains("dark"))
    window.addEventListener("portfolio-theme-change", syncTheme)
    return () => window.removeEventListener("portfolio-theme-change", syncTheme)
  }, [dark])

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)")
    const syncMotion = () => { reducedMotion.current = query.matches }
    syncMotion()
    query.addEventListener("change", syncMotion)
    return () => query.removeEventListener("change", syncMotion)
  }, [])

  function toggleTheme() {
    const next = !document.documentElement.classList.contains("dark")
    document.documentElement.classList.toggle("dark", next)
    document.documentElement.classList.toggle("light", !next)
    localStorage.setItem("portfolio-theme", next ? "dark" : "light")
    window.dispatchEvent(new Event("portfolio-theme-change"))
  }

  function renderPoints() {
    setPoints(pointsRef.current.map((point) => ({ ...point })))
  }

  function startAnimation() {
    if (frame.current !== null) return
    let previous = performance.now()
    const tick = (time: number) => {
      const delta = Math.min(2, (time - previous) / 16.67)
      previous = time
      const chain = pointsRef.current
      const knob = chain[chain.length - 1]
      if (!draggingRef.current) {
        for (let index = 1; index < chain.length; index += 1) {
          const point = chain[index]
          const velocityX = (point.x - point.oldX) * .91
          const velocityY = (point.y - point.oldY) * .91
          point.oldX = point.x
          point.oldY = point.y
          point.x += velocityX
          point.y += velocityY + .25 * delta
        }
        if (!reducedMotion.current && time < swayUntil.current) knob.x += Math.sin(time * .008) * .16
      }
      for (let iteration = 0; iteration < 5; iteration += 1) {
        chain[0].x = REST_X
        chain[0].y = 0
        for (let index = 0; index < chain.length - 1; index += 1) {
          const first = chain[index]
          const second = chain[index + 1]
          const dx = second.x - first.x
          const dy = second.y - first.y
          const distance = Math.max(.001, Math.hypot(dx, dy))
          const correction = (distance - SEGMENT_LENGTH) / distance
          if (index === 0) {
            second.x -= dx * correction
            second.y -= dy * correction
          } else if (draggingRef.current && index + 1 === chain.length - 1) {
            first.x += dx * correction
            first.y += dy * correction
          } else {
            first.x += dx * correction * .5
            first.y += dy * correction * .5
            second.x -= dx * correction * .5
            second.y -= dy * correction * .5
          }
        }
      }
      renderPoints()
      const chainMoving = chain.some((point) => Math.abs(point.x - point.oldX) > .08 || Math.abs(point.y - point.oldY) > .08)
      const moving = draggingRef.current || time < swayUntil.current || chainMoving || Math.abs(knob.x - REST_X) > .08 || Math.abs(knob.y - REST_Y) > .08
      if (moving) frame.current = requestAnimationFrame(tick)
      else frame.current = null
    }
    frame.current = requestAnimationFrame(tick)
  }

  function tugAndToggle() {
    if (reducedMotion.current) {
      toggleTheme()
      return
    }
    const knob = pointsRef.current[pointsRef.current.length - 1]
    knob.x = REST_X
    knob.y = REST_Y + 28
    knob.oldX = REST_X
    knob.oldY = knob.y + 9
    swayUntil.current = performance.now() + 850
    toggleTheme()
    startAnimation()
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLButtonElement>) {
    event.preventDefault()
    knobRef.current?.setPointerCapture(event.pointerId)
    draggedRef.current = false
    suppressClick.current = false
    draggingRef.current = true
    setDragging(true)
    startAnimation()
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLButtonElement>) {
    if (!draggingRef.current) return
    const rect = knobRef.current?.parentElement?.getBoundingClientRect()
    if (!rect) return
    const knob = pointsRef.current[pointsRef.current.length - 1]
    knob.x = Math.max(REST_X - 30, Math.min(REST_X + 30, event.clientX - rect.left))
    knob.y = Math.max(REST_Y, Math.min(REST_Y + 70, event.clientY - rect.top))
    knob.oldX = knob.x
    knob.oldY = knob.y
    if (knob.y - REST_Y > 3 || Math.abs(knob.x - REST_X) > 3) draggedRef.current = true
    renderPoints()
  }

  function finishPointer(event: ReactPointerEvent<HTMLButtonElement>, cancelled = false) {
    if (knobRef.current?.hasPointerCapture(event.pointerId)) knobRef.current.releasePointerCapture(event.pointerId)
    const knob = pointsRef.current[pointsRef.current.length - 1]
    const shouldToggle = !cancelled && draggedRef.current && knob.y - REST_Y >= 35
    const wasDragged = draggedRef.current
    suppressClick.current = true
    draggingRef.current = false
    setDragging(false)
    if (!wasDragged && !cancelled) tugAndToggle()
    else {
      if (shouldToggle) toggleTheme()
      knob.oldY = knob.y + 8
      swayUntil.current = performance.now() + 900
      startAnimation()
    }
  }

  function handleKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>) {
    if (event.key !== "Enter" && event.key !== " ") return
    event.preventDefault()
    suppressClick.current = true
    tugAndToggle()
  }

  const lastPoint = points[points.length - 1]
  const knobStyle = { "--knob-x": `${lastPoint.x}px`, "--knob-y": `${lastPoint.y}px` } as CSSProperties
  const cordStyle = { "--cord-blue": "#005FFF", "--cord-red": "#FF0000", "--cord-yellow": "#FFC700" } as CSSProperties

  return <div className="theme-cord" data-dragging={dragging} style={cordStyle}>
    <svg className="theme-cord-svg" viewBox="0 0 72 112" aria-hidden="true">
      {points.slice(0, -1).map((point, index) => {
        const next = points[index + 1]
        const color = index % 3 === 0 ? "var(--cord-blue)" : index % 3 === 1 ? "var(--cord-red)" : "var(--cord-yellow)"
        return <g key={index}><line className="theme-cord-outline" x1={point.x} y1={point.y} x2={next.x} y2={next.y} /><line className="theme-cord-segment" stroke={color} x1={point.x} y1={point.y} x2={next.x} y2={next.y} /></g>
      })}
    </svg>
    <button ref={knobRef} className="theme-cord-knob" style={knobStyle} type="button" aria-label="Toggle light/dark mode" aria-pressed={dark} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={finishPointer} onPointerCancel={(event) => finishPointer(event, true)} onKeyDown={handleKeyDown} onClick={() => {
      if (suppressClick.current) {
        suppressClick.current = false
        return
      }
      tugAndToggle()
    }}>
      <svg className="theme-cord-icon" viewBox="0 0 24 24" aria-hidden="true">
        {dark ? <path d="M20.3 15.2A8.5 8.5 0 0 1 8.8 3.7 8.5 8.5 0 1 0 20.3 15.2Z" /> : <><circle cx="12" cy="12" r="3.5" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>}
      </svg>
    </button>
  </div>
}

export function SiteHeader() {
  return (
    <header className="site-header sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="container-shell flex h-16 items-center justify-between gap-4">
        <a className="brand-link" href="index.html" aria-label={`${site.name}, home`}>
          <span className="brand-mark" aria-hidden="true">
            <img src={`${import.meta.env.BASE_URL}favicon.png`} alt="" />
          </span>
          <span>{site.name}</span>
        </a>
        <ThemeToggle />
      </div>
    </header>
  )
}
