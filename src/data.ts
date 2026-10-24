export type ProjectSection = { id: string; title: string; body: string }
export type CaseStudy = {
  slug: string
  title: string
  category: "live" | "concept"
  summary: string
  tags: string[]
  image: string
  sections?: ProjectSection[]
}

export function getCaseStudySections(sections?: ProjectSection[]): ProjectSection[] {
  const seen = new Set<string>()
  return (sections ?? []).filter((section) => {
    const id = section.id.trim()
    const title = section.title.trim()
    if (!id || !title || seen.has(id)) return false
    seen.add(id)
    return true
  })
}

export function getCaseStudySectionId(projectSlug: string, sectionId: string) {
  return `case-study-${projectSlug}-${sectionId}`
}

export const site = {
  name: "Priyan Portfolio",
  role: "Product Designer",
  title: "Vishnu Priyan A J — Product Designer",
  description: "Priyan Portfolio of selected projects, case studies and experiments.",
  intro: "Life is an unexplored map. Here’s the part I’ve explored so far.",
  resumeUrl: "assets/resume.pdf",
  email: "you@example.com",
  links: [
    { label: "LinkedIn", url: "https://www.linkedin.com/in/your-handle" },
    { label: "GitHub", url: "https://github.com/your-handle" },
  ],
  caseStudiesIntro: "A conventional route to the work, whenever you want to skip the map.",
  caseStudies: [
    {
      slug: "vehicle-recovery-console",
      title: "Vehicle Recovery Console",
      category: "live",
      summary: "A 0→1 product that replaced a broken, 5-tool manual recovery workflow, cutting per-vehicle time from 1–2 hours to 10–15 minutes.",
      tags: ["Product", "Operations"],
      image: "",
      sections: [],
    },
    {
      slug: "fuse-ai",
      title: "Fuse AI",
      category: "live",
      summary: "Case study content coming soon. Add the product context, decisions and measurable outcome here.",
      tags: ["AI", "Product"],
      image: "",
      sections: [],
    },
    {
      slug: "netx360",
      title: "Netx360",
      category: "live",
      summary: "Case study content coming soon. Add the product context, decisions and measurable outcome here.",
      tags: ["Platform", "Systems"],
      image: "",
      sections: [],
    },
    {
      slug: "lion-muthu-comics",
      title: "Lion Muthu Comics",
      category: "concept",
      summary: "Concept case study content coming soon. Add the concept, process and intended outcome here.",
      tags: ["Concept", "Editorial"],
      image: "",
      sections: [],
    },
    {
      slug: "outfit",
      title: "Outfit",
      category: "concept",
      summary: "Concept case study content coming soon. Add the concept, process and intended outcome here.",
      tags: ["Concept", "Product"],
      image: "",
      sections: [],
    },
  ] satisfies CaseStudy[],
  explorations: [
    { title: "Logo design", tag: "Skill area", url: "#", category: "exploration" },
    { title: "Branding and packaging", tag: "Skill area", url: "#", category: "exploration" },
    { title: "3D modelling and rendering", tag: "Skill area", url: "#", category: "exploration" },
  ],
  feature: {
    title: "Currently exploring",
    text: "A short note on what you are learning, building or writing about right now. Replace this with a link to a post, talk or repository.",
    url: "#",
    linkLabel: "Read more",
  },
} as const
