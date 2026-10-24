import { useCallback, useEffect, useRef, useState } from "react"
import type { JourneyMilestone } from "@/journey"

type Props = {
  milestones: JourneyMilestone[]
  activeMilestone: number | null
  revealComplete: boolean
  onSelect: (number: number | null) => void
  onHover: (number: number | null) => void
}

function milestoneIndex(group: SVGGElement, milestones: JourneyMilestone[]) {
  return milestones.findIndex((story) => story.sourceId === group.dataset.id)
}

export function PortraitArt({ milestones, activeMilestone, revealComplete, onSelect, onHover }: Props) {
  const host = useRef<HTMLDivElement>(null)
  const [svgMarkup, setSvgMarkup] = useState("")

  useEffect(() => {
    let cancelled = false
    fetch(`${import.meta.env.BASE_URL}portrait.svg`)
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load original portrait.svg")
        return response.text()
      })
      .then((svg) => {
        if (!cancelled) {
          const accessible = svg.replace("<svg ", '<svg class="static-portrait" role="group" aria-label="Connect-the-dots portrait" ')
          setSvgMarkup(accessible)
        }
      })
      .catch((error: unknown) => console.error("Portrait artwork could not be loaded", error))
    return () => { cancelled = true }
  }, [])

  const syncMilestones = useCallback(() => {
    const svg = host.current?.querySelector<SVGSVGElement>("svg")
    if (!svg) return
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
    {revealComplete && <div className="portrait-finish" aria-live="polite"><span className="portrait-finish-mark"><i /><i /><i /></span><span>The portrait emerges</span></div>}
  </div>
}
