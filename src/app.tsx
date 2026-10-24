import { useState, type FormEvent } from "react"
import { Check, Mail, Send, Sparkles } from "lucide-react"
import { site } from "@/data"
import { Badge } from "@/components/ui/badge"
import { Button, ButtonLink } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ProjectCover } from "@/components/project-cover"
import { SectionHeading } from "@/components/section-heading"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { JourneyHero } from "@/components/journey-hero"

const projectGroups = [
  { category: "live" as const, title: "Live projects" },
  { category: "concept" as const, title: "Concept exploration projects" },
]

export function HomePage() {
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <div id="top"><SiteHeader /></div>
    <main id="main">
      <JourneyHero />
      <section className="container-shell section-block work-section" id="case-studies" aria-labelledby="work-title">
        <div className="section-topline"><SectionHeading title="A few things I’ve helped bring to life." description={site.caseStudiesIntro} id="work-title" /><span className="section-count">01 — 03</span></div>
        {projectGroups.map((group) => <div className="project-group" key={group.category}>
          <h3 className="project-group-title">{group.title}</h3>
          <div className="projects-grid">{site.caseStudies.filter((project) => project.category === group.category).map((project, index) => <Card className="project-card" key={project.slug}>
            <a className="project-cover-link" href={`project.html?slug=${encodeURIComponent(project.slug)}`} aria-label={`View ${project.title} case study`}><ProjectCover project={project} index={index} /></a>
            <CardContent className="project-card-content"><div className="project-card-meta"><span>{String(index + 1).padStart(2, "0")} / Case study</span></div><h3>{project.title}</h3><p>{project.summary}</p><div className="badge-row">{project.tags.map((tag) => <Badge key={tag}>{tag}</Badge>)}</div><a className="project-link" href={`project.html?slug=${encodeURIComponent(project.slug)}`}>Read case study</a></CardContent>
          </Card>)}</div>
        </div>)}
        <div className="project-group" id="explorations">
          <h3 className="project-group-title">Other explorations</h3>
          <div className="explorations-grid">{site.explorations.map((item, index) => {
            const project = { title: item.title, image: "" }
            return <a className="exploration-item" href={item.url} key={item.title}><div className="exploration-cover"><ProjectCover project={project} index={index} square /></div><div className="exploration-label"><span><strong>{item.title}</strong><small>{item.tag}</small></span></div></a>
          })}</div>
        </div>
      </section>
      <section className="container-shell section-block approach-section" id="approach" aria-labelledby="approach-title">
        <div className="section-topline"><SectionHeading title="From the first question to the lasting detail." description="A practical, end-to-end approach to building products people can rely on." id="approach-title" /></div>
        <div className="approach-grid">
          <Card className="approach-card"><CardContent><span className="approach-number">01</span><h3>Understand the why</h3><p>Align on the user, the problem, and the outcome before choosing the tools.</p><div className="badge-row"><Badge>Discovery</Badge><Badge>Product thinking</Badge></div></CardContent></Card>
          <Card className="approach-card"><CardContent><span className="approach-number">02</span><h3>Build for the real world</h3><p>Connect usable interfaces with dependable APIs and considered system design.</p><div className="badge-row"><Badge>Full-stack</Badge><Badge>Backend systems</Badge></div></CardContent></Card>
          <Card className="approach-card"><CardContent><span className="approach-number">03</span><h3>Ship, learn, improve</h3><p>Take ownership through production, listen to feedback, and keep making it better.</p><div className="badge-row"><Badge>Delivery</Badge><Badge>Iteration</Badge></div></CardContent></Card>
        </div>
      </section>
      <ContactSection />
      <section className="container-shell now-section" id="now" aria-labelledby="now-title"><Card className="now-card"><CardContent className="now-content"><div className="now-icon"><Sparkles size={19} /></div><div className="now-copy"><h2 id="now-title">{site.feature.title}</h2><p>{site.feature.text}</p></div><ButtonLink href={site.feature.url} variant="outline">{site.feature.linkLabel}</ButtonLink></CardContent></Card></section>
    </main>
    <SiteFooter />
  </>
}

function ContactSection() {
  const [message, setMessage] = useState("")
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const name = String(form.get("name") ?? "").trim()
    const email = String(form.get("email") ?? "").trim()
    const note = String(form.get("message") ?? "").trim()
    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`)
    const body = encodeURIComponent(`${note}\n\nFrom: ${name} (${email})`)
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`
    setMessage("Your email app should open with your message ready to send.")
    event.currentTarget.reset()
  }
  return <section className="container-shell section-block contact-section" id="contact" aria-labelledby="contact-title">
    <div className="contact-intro"><SectionHeading title="Have a good problem to solve?" description="Tell me a little about what you’re working on. I’d love to hear from you." id="contact-title" /><a className="contact-email" href={`mailto:${site.email}`}><Mail size={16} /> {site.email}</a></div>
    <Card className="contact-card"><CardContent><form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-field"><label htmlFor="contact-name">Your name</label><input id="contact-name" name="name" autoComplete="name" placeholder="Alex Morgan" minLength={2} required /></div>
      <div className="form-field"><label htmlFor="contact-email">Email address</label><input id="contact-email" name="email" type="email" autoComplete="email" placeholder="alex@company.com" required /></div>
      <div className="form-field"><label htmlFor="contact-message">What are you thinking about?</label><textarea id="contact-message" name="message" placeholder="A quick note about your project, idea, or question…" rows={4} minLength={10} required /></div>
      <div className="form-submit"><Button type="submit">Prepare email <Send size={15} /></Button><span className="form-hint">Opens your email app—no data is stored here.</span></div>
      <p className="form-feedback" role="status" aria-live="polite">{message && <><Check size={15} /> {message}</>}</p>
    </form></CardContent></Card>
  </section>
}

export function ProjectPage() {
  const slug = new URLSearchParams(window.location.search).get("slug")
  const project = site.caseStudies.find((item) => item.slug === slug)
  const title = project ? `${project.title} | ${site.name}` : `Case study not found | ${site.name}`
  document.title = title
  const description = document.querySelector<HTMLMetaElement>('meta[name="description"]')
  if (description) description.content = project?.summary ?? site.description
  const socialTitle = document.querySelector<HTMLMetaElement>('meta[property="og:title"]')
  if (socialTitle) socialTitle.content = title
  const socialDescription = document.querySelector<HTMLMetaElement>('meta[property="og:description"]')
  if (socialDescription) socialDescription.content = project?.summary ?? site.description
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <div id="top"><SiteHeader /></div>
    <main id="main" className="container-shell project-main">
      {project ? <article className="project-article">
        <a className="back-link" href="index.html#case-studies">All case studies</a>
        <h1>{project.title}</h1><p className="project-lede">{project.summary}</p>
        <div className="project-hero-cover"><ProjectCover project={project} index={site.caseStudies.indexOf(project)} /></div>
        <div className="project-article-body">{project.sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2><p>{section.body}</p></section>)}
          <Card className="project-next"><CardContent><div><span className="project-next-label">Have a similar challenge?</span><h2>Let’s make it clearer.</h2></div><ButtonLink href={`mailto:${site.email}`}>Start a conversation</ButtonLink></CardContent></Card>
        </div>
      </article> : <Card className="not-found-card"><CardContent><h1>That case study isn’t here.</h1><p>The link may be outdated. Head back to the selected work to find another project.</p><ButtonLink href="index.html#case-studies">Back to selected work</ButtonLink></CardContent></Card>}
    </main>
    <SiteFooter />
  </>
}
