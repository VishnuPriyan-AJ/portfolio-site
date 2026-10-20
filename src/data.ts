export type ProjectSection = { heading: string; body: string }
export type CaseStudy = {
  slug: string
  title: string
  summary: string
  tags: string[]
  image: string
  sections: ProjectSection[]
}

export const site = {
  name: "Your Name",
  role: "Software Developer",
  title: "Your Name | Portfolio",
  description: "Portfolio of selected projects, case studies and experiments.",
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
      slug: "payments-gateway",
      title: "Payments Gateway",
      summary:
        "A service that routes card payments across providers, retries failures safely and gives support teams one place to trace a transaction.",
      tags: ["Fintech", "Microservices"],
      image: "",
      sections: [
        { heading: "Problem", body: "Failed payments were retried by hand and nobody could see where a transaction stopped." },
        { heading: "Approach", body: "Event-driven services with idempotent handlers, a single trace ID per payment and a read model for support." },
        { heading: "Outcome", body: "Replace this with the measurable result, for example fewer manual retries or faster resolution time." },
      ],
    },
    {
      slug: "inventory-platform",
      title: "Inventory Platform",
      summary:
        "Real-time stock visibility across warehouses, with alerts when levels drift from what the system expects.",
      tags: ["Backend", "Real-time"],
      image: "",
      sections: [
        { heading: "Problem", body: "Describe what was broken or missing." },
        { heading: "Approach", body: "Describe the decisions you made and why." },
        { heading: "Outcome", body: "Describe what changed because of it." },
      ],
    },
    {
      slug: "storefront-rebuild",
      title: "Storefront Rebuild",
      summary:
        "Rebuilt a legacy shop front end so pages load quickly, search finds things and checkout has fewer steps.",
      tags: ["React", "Performance"],
      image: "",
      sections: [
        { heading: "Problem", body: "Describe what was broken or missing." },
        { heading: "Approach", body: "Describe the decisions you made and why." },
        { heading: "Outcome", body: "Describe what changed because of it." },
      ],
    },
    {
      slug: "chat-ordering",
      title: "Chat Ordering Bot",
      summary:
        "A conversational flow that lets customers browse a catalogue, build a cart and pay without leaving the chat.",
      tags: ["Conversational", "API"],
      image: "",
      sections: [
        { heading: "Problem", body: "Describe what was broken or missing." },
        { heading: "Approach", body: "Describe the decisions you made and why." },
        { heading: "Outcome", body: "Describe what changed because of it." },
      ],
    },
  ] satisfies CaseStudy[],
  explorationsTitle: "Smaller projects, same curiosity",
  explorations: [
    { title: "CLI log viewer", tag: "Tooling", url: "#" },
    { title: "Rate limiter demo", tag: "Backend", url: "#" },
    { title: "Kanban toy", tag: "React", url: "#" },
    { title: "Query visualiser", tag: "Data", url: "#" },
  ],
  feature: {
    title: "Currently exploring",
    text: "A short note on what you are learning, building or writing about right now. Replace this with a link to a post, talk or repository.",
    url: "#",
    linkLabel: "Read more",
  },
} as const
