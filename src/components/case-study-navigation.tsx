import { useEffect, useState } from "react"
import { getCaseStudySectionId, type ProjectSection } from "@/data"

export function CaseStudyNavigation({ projectSlug, sections, lockedIds = [], onLockedClick }: { projectSlug: string; sections: ProjectSection[]; lockedIds?: string[]; onLockedClick?: () => void }) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "")

  useEffect(() => {
    setActiveId(sections[0]?.id ?? "")
    if (!sections.length) return

    const headerHeight = document.querySelector(".site-header")?.getBoundingClientRect().height ?? 0
    const visibleSections = sections.filter((section) => !lockedIds.includes(section.id))
    const elements = visibleSections
      .map((section) => document.getElementById(getCaseStudySectionId(projectSlug, section.id)))
      .filter((element): element is HTMLElement => Boolean(element))
    const gate = document.getElementById(getCaseStudySectionId(projectSlug, "access"))
    if (!elements.length && !gate) return

    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((first, second) => first.boundingClientRect.top - second.boundingClientRect.top)
      if (visible[0]) {
        const sectionId = visible[0].target.id.replace(`case-study-${projectSlug}-`, "")
        setActiveId(sectionId === "access" ? visibleSections.at(-1)?.id ?? "" : sectionId)
      }
    }, { rootMargin: `-${Math.max(headerHeight + 24, window.innerHeight * .2)}px 0px -70% 0px`, threshold: [0, .01] })

    elements.forEach((element) => observer.observe(element))
    if (gate) observer.observe(gate)

    const updateFromScroll = () => {
      const candidates = [...elements, ...(gate ? [gate] : [])]
        .filter((element) => element.getBoundingClientRect().top <= headerHeight + 24)
      const current = candidates.at(-1)
      if (current) {
        const sectionId = current.id.replace(`case-study-${projectSlug}-`, "")
        setActiveId(sectionId === "access" ? visibleSections.at(-1)?.id ?? "" : sectionId)
      }
    }
    const updateFromHash = () => window.requestAnimationFrame(updateFromScroll)
    window.addEventListener("scroll", updateFromScroll, { passive: true })
    window.addEventListener("resize", updateFromScroll)
    window.addEventListener("hashchange", updateFromHash)
    updateFromScroll()
    return () => {
      observer.disconnect()
      window.removeEventListener("scroll", updateFromScroll)
      window.removeEventListener("resize", updateFromScroll)
      window.removeEventListener("hashchange", updateFromHash)
    }
  }, [projectSlug, sections, lockedIds])

  if (!sections.length) return null

  return <nav className="case-study-navigation" aria-label="Case study sections">
    <ul>
      {sections.map((section) => {
        const id = getCaseStudySectionId(projectSlug, section.id)
          const locked = lockedIds.includes(section.id)
          return <li key={section.id}>
             <a href={`#${id}`} aria-current={activeId === section.id ? "location" : undefined} onClick={locked ? (event) => { event.preventDefault(); onLockedClick?.() } : undefined}><span>{section.title}</span>{locked && <span className="case-study-navigation-lock" aria-hidden="true">🔒</span>}</a>
        </li>
      })}
    </ul>
  </nav>
}
