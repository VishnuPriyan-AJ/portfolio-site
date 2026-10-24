import { useEffect, useState } from "react"
import { getCaseStudySectionId, type ProjectSection } from "@/data"

export function CaseStudyNavigation({ projectSlug, sections }: { projectSlug: string; sections: ProjectSection[] }) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "")

  useEffect(() => {
    setActiveId(sections[0]?.id ?? "")
    if (!sections.length) return

    const headerHeight = document.querySelector(".site-header")?.getBoundingClientRect().height ?? 0
    const elements = sections
      .map((section) => document.getElementById(getCaseStudySectionId(projectSlug, section.id)))
      .filter((element): element is HTMLElement => Boolean(element))
    if (!elements.length) return

    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((first, second) => first.boundingClientRect.top - second.boundingClientRect.top)
      if (visible[0]) {
        const sectionId = visible[0].target.id.replace(`case-study-${projectSlug}-`, "")
        setActiveId(sectionId)
      }
    }, { rootMargin: `-${headerHeight + 16}px 0px -55% 0px`, threshold: [0, .15, .5] })

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [projectSlug, sections])

  if (!sections.length) return null

  return <nav className="case-study-navigation" aria-label="Case study sections">
    <ul>
      {sections.map((section) => {
        const id = getCaseStudySectionId(projectSlug, section.id)
        return <li key={section.id}>
          <a href={`#${id}`} aria-current={activeId === section.id ? "location" : undefined}>{section.title}</a>
        </li>
      })}
    </ul>
  </nav>
}
