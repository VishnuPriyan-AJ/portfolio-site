import { useCallback, useEffect, useRef, useState } from "react"
import { useReducedMotion, type MotionValue } from "framer-motion"
import type { JourneyMilestone } from "@/journey"

type Props = {
  progress: MotionValue<number>
  milestones: JourneyMilestone[]
  activeMilestone: number | null
  revealComplete: boolean
  onSelect: (number: number | null) => void
  onHover: (number: number | null) => void
}

function milestoneIndex(group: SVGGElement, milestones: JourneyMilestone[]) {
  return milestones.findIndex((story) => story.sourceId === group.dataset.id)
}

export function PortraitArt({ progress, milestones, activeMilestone, revealComplete, onSelect, onHover }: Props) {
  const host = useRef<HTMLDivElement>(null)
  const [svgMarkup, setSvgMarkup] = useState("")
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    let cancelled = false
    fetch("/portrait.svg")
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load original portrait.svg")
        return response.text()
      })
      .then((svg) => {
        if (!cancelled) {
          const accessible = svg.replace("<svg ", '<svg role="group" aria-label="Interactive connect-the-dots portrait" ')
          const withTraveler = accessible.replace('<g id="nodes">', '<g id="nodes"><path id="autobiography-traveler-route" d="" fill="none" stroke="none"/><circle id="autobiography-traveler" cx="0" cy="0" r="5" fill="#d9f3ff"/>')
          setSvgMarkup(withTraveler)
        }
      })
      .catch((error: unknown) => console.error("Portrait artwork could not be loaded", error))
    return () => { cancelled = true }
  }, [])

  const syncMilestones = useCallback(() => {
    const svg = host.current?.querySelector<SVGSVGElement>("svg")
    if (!svg) return
    svg.classList.add("is-story-playing")
    svg.querySelectorAll<SVGGElement>("#nodes .milestone").forEach((node) => {
      const index = milestoneIndex(node, milestones)
      if (index < 0) return
      const story = milestones[index]
      node.setAttribute("aria-label", `${String(index + 1).padStart(2, "0")}: ${story.title}, ${story.lesson}`)
      node.setAttribute("aria-pressed", String(activeMilestone === index + 1))
      node.setAttribute("role", "button")
      node.setAttribute("tabindex", revealComplete ? "0" : "-1")
      node.style.pointerEvents = revealComplete ? "auto" : "none"
      node.classList.toggle("active", activeMilestone === index + 1)
    })
  }, [activeMilestone, milestones, revealComplete])

  useEffect(() => {
    const svg = host.current?.querySelector<SVGSVGElement>("svg")
    if (!svg) return
    const route = svg.querySelector<SVGPathElement>("#autobiography-traveler-route")
    const traveler = svg.querySelector<SVGCircleElement>("#autobiography-traveler")
    if (!route || !traveler) return

    const milestonePoints = milestones.map((story) => {
      const core = svg.querySelector<SVGCircleElement>(`#nodes [data-id="${story.sourceId}"] .core`)
      return core ? { x: core.cx.baseVal.value, y: core.cy.baseVal.value } : null
    }).filter((point): point is { x: number; y: number } => point !== null)
    if (milestonePoints.length !== milestones.length) return

    route.setAttribute("d", milestonePoints.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" "))
    const unsubscribe = progress.on("change", (value) => {
      const t = reducedMotion ? 1 : Math.max(0, Math.min(1, value))
      const distance = t * route.getTotalLength()
      const current = route.getPointAtLength(distance)
      traveler.setAttribute("cx", String(current.x))
      traveler.setAttribute("cy", String(current.y))
    })
    const initial = route.getPointAtLength(Math.max(0, Math.min(1, progress.get())) * route.getTotalLength())
    traveler.setAttribute("cx", String(initial.x))
    traveler.setAttribute("cy", String(initial.y))
    return unsubscribe
  }, [milestones, progress, reducedMotion, svgMarkup])

  useEffect(() => { syncMilestones() }, [svgMarkup, syncMilestones])

  useEffect(() => {
    const el = host.current
    if (!el) return
    const activate = (event: Event) => {
      const target = event.target
      if (!(target instanceof Element)) return
      const node = target.closest<SVGGElement>("#nodes .milestone")
      const index = node ? milestoneIndex(node, milestones) : -1
      if (index >= 0 && revealComplete) onSelect(activeMilestone === index + 1 ? null : index + 1)
    }
    const keyActivate = (event: KeyboardEvent) => {
      if (event.key !== "Enter" && event.key !== " ") return
      const target = event.target
      if (!(target instanceof Element)) return
      if (!target.closest("#nodes .milestone") || !revealComplete) return
      event.preventDefault()
      activate(event)
    }
    const hover = (event: Event) => {
      const target = event.target
      if (!(target instanceof Element)) return
      const node = target.closest<SVGGElement>("#nodes .milestone")
      const index = node ? milestoneIndex(node, milestones) : -1
      if (index >= 0 && revealComplete) onHover(index + 1)
    }
    const leave = (event: Event) => {
      const target = event.target
      if (target instanceof Element && target.closest("#nodes .milestone") && revealComplete) onHover(null)
    }
    el.addEventListener("click", activate)
    el.addEventListener("keydown", keyActivate)
    el.addEventListener("pointerover", hover)
    el.addEventListener("pointerout", leave)
    return () => {
      el.removeEventListener("click", activate)
      el.removeEventListener("keydown", keyActivate)
      el.removeEventListener("pointerover", hover)
      el.removeEventListener("pointerout", leave)
    }
  }, [activeMilestone, milestones, onHover, onSelect, revealComplete])

  return <div className={`portrait-art${revealComplete ? " is-complete" : ""}`} ref={host} aria-label="Original connect-the-dots portrait with 3,946 nodes and 11,279 connections">
    <div className="portrait-final-glow" aria-hidden="true" />
    <div className="portrait-svg-mount" dangerouslySetInnerHTML={{ __html: svgMarkup }} />
    {revealComplete && <div className="portrait-finish" aria-live="polite"><span className="portrait-finish-mark"><i /><i /><i /></span><span>THE PORTRAIT EMERGES</span></div>}
  </div>
}
