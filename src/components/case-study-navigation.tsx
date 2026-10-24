import { useEffect, useRef, useState } from "react"
import { getCaseStudySectionId, type ProjectSection } from "@/data"

export function CaseStudyNavigation({ projectSlug, sections, lockedIds = [], onLockedClick }: { projectSlug: string; sections: ProjectSection[]; lockedIds?: string[]; onLockedClick?: () => void }) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "")
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const nav = navRef.current
    const header = document.querySelector<HTMLElement>(".site-header")
    if (!nav || !header) return
    const updateLayoutVariables = () => {
      document.documentElement.style.setProperty("--site-header-h", `${header.getBoundingClientRect().height}px`)
      document.documentElement.style.setProperty("--case-study-nav-h", `${nav.getBoundingClientRect().height}px`)
    }
    const observer = new ResizeObserver(updateLayoutVariables)
    observer.observe(header)
    observer.observe(nav)
    updateLayoutVariables()
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    setActiveId(sections[0]?.id ?? "")
    if (!sections.length) return

    const navHeight = navRef.current?.getBoundingClientRect().height ?? 0
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
    }, { rootMargin: `-${navHeight + 16}px 0px -70% 0px`, threshold: [0, .01] })

    elements.forEach((element) => observer.observe(element))
    if (gate) observer.observe(gate)

    const updateFromScroll = () => {
      const candidates = [...elements, ...(gate ? [gate] : [])]
        .filter((element) => element.getBoundingClientRect().top <= navHeight + 16)
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

  useEffect(() => {
    if (!activeId || !window.matchMedia("(max-width: 900px)").matches) return
    const row = navRef.current?.querySelector<HTMLElement>("ul")
    const link = navRef.current?.querySelector<HTMLElement>(`a[aria-current="location"]`)
    if (!row || !link) return
    row.scrollTo({ left: link.offsetLeft - (row.clientWidth - link.offsetWidth) / 2, behavior: "smooth" })
  }, [activeId])

  if (!sections.length) return null

  return <nav ref={navRef} className="case-study-navigation" aria-label="Case study sections">
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
