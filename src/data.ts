export type ProjectSection = { heading: string; body: string }
export type CaseStudy = {
  slug: string
  title: string
  category: "live" | "concept"
  summary: string
  tags: string[]
  image: string
  sections: ProjectSection[]
}

export const site = {
  name: "Priyan Portfolio",
  role: "Software Developer",
  title: "Priyan Portfolio",
  description: "Priyan Portfolio of selected projects, case studies and experiments.",
  intro:
    "Software developer with 4+ years building backend and full-stack products. I own work from first conversation to production and care about the numbers it moves afterwards.",
  resumeUrl: "assets/resume.pdf",
  email: "you@example.com",
  links: [
    { label: "LinkedIn", url: "https://www.linkedin.com/in/your-handle" },
    { label: "GitHub", url: "https://github.com/your-handle" },
  ],
  caseStudiesIntro: "How I work through problems, systems and people",
  caseStudies: [
    {
      slug: "vehicle-recovery-console",
      title: "Vehicle Recovery Console",
      category: "live",
      summary: "Case study content coming soon. Add the product context, decisions and measurable outcome here.",
      tags: ["Product", "Operations"],
      image: "",
      sections: [
        { heading: "Problem", body: "Add the problem this project addressed." },
        { heading: "Approach", body: "Add the key decisions and implementation details." },
        { heading: "Outcome", body: "Add the measurable result or impact." },
      ],
    },
    {
      slug: "fuse-ai",
      title: "Fuse AI",
      category: "live",
      summary: "Case study content coming soon. Add the product context, decisions and measurable outcome here.",
      tags: ["AI", "Product"],
      image: "",
      sections: [
        { heading: "Problem", body: "Add the problem this project addressed." },
        { heading: "Approach", body: "Add the key decisions and implementation details." },
        { heading: "Outcome", body: "Add the measurable result or impact." },
      ],
    },
    {
      slug: "netx360",
      title: "Netx360",
      category: "live",
      summary: "Case study content coming soon. Add the product context, decisions and measurable outcome here.",
      tags: ["Platform", "Systems"],
      image: "",
      sections: [
        { heading: "Problem", body: "Add the problem this project addressed." },
        { heading: "Approach", body: "Add the key decisions and implementation details." },
        { heading: "Outcome", body: "Add the measurable result or impact." },
      ],
    },
    {
      slug: "lion-muthu-comics",
      title: "Lion Muthu Comics",
      category: "concept",
      summary: "Concept case study content coming soon. Add the concept, process and intended outcome here.",
      tags: ["Concept", "Editorial"],
      image: "",
      sections: [
        { heading: "Problem", body: "Add the opportunity or idea behind this concept." },
        { heading: "Approach", body: "Add the exploration and design decisions." },
        { heading: "Outcome", body: "Add the intended result or learning." },
      ],
    },
    {
      slug: "outfit",
      title: "Outfit",
      category: "concept",
      summary: "Concept case study content coming soon. Add the concept, process and intended outcome here.",
      tags: ["Concept", "Product"],
      image: "",
      sections: [
        { heading: "Problem", body: "Add the opportunity or idea behind this concept." },
        { heading: "Approach", body: "Add the exploration and design decisions." },
        { heading: "Outcome", body: "Add the intended result or learning." },
      ],
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
