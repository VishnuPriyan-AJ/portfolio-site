import { useEffect, useMemo, useState, type FormEvent } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProjectCover } from "@/components/project-cover"
import { CaseStudyNavigation } from "@/components/case-study-navigation"
import { getCaseStudySectionId, site, type CaseStudy, type ProjectSection } from "@/data"
import { vehicleRecoveryContent, vehicleRecoveryNavigation, type VehicleRecoveryBlock, type VehicleRecoverySection } from "@/content/vehicle-recovery"

type LockedPayload = {
  salt: string
  iv: string
  ct: string
  sections: Array<{ id: string; title: string; html: string }>
}

const lockedIds = vehicleRecoveryNavigation.filter((section) => section.visibility === "locked").map((section) => section.id)

export function VehicleRecoveryCaseStudy({ project }: { project: CaseStudy }) {
  const [lockedSections, setLockedSections] = useState<LockedPayload["sections"]>([])
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [unlocked, setUnlocked] = useState(false)
  const gateId = getCaseStudySectionId(project.slug, "access")
  const navigationSections = useMemo<ProjectSection[]>(() => vehicleRecoveryNavigation.map((section) => ({ id: section.id, title: section.title, body: "" })), [])

  useEffect(() => {
    if (!unlocked) return
    document.getElementById(getCaseStudySectionId(project.slug, "flow"))?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })
  }, [project.slug, unlocked])

  function focusGate() {
    document.getElementById(gateId)?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })
    window.setTimeout(() => document.getElementById("case-study-password")?.focus(), 250)
  }

  async function handleUnlock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    try {
      const response = await fetch("case-studies/vehicle-recovery/locked-payload.json", { cache: "no-store" })
      if (!response.ok) throw new Error("Payload unavailable")
      const payload = await response.json() as LockedPayload
      const decode = (value: string) => Uint8Array.from(atob(value), (character) => character.charCodeAt(0))
      const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveKey"])
      const key = await crypto.subtle.deriveKey({ name: "PBKDF2", salt: decode(payload.salt), iterations: 600000, hash: "SHA-256" }, base, { name: "AES-GCM", length: 256 }, false, ["decrypt"])
      const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv: decode(payload.iv) }, key, decode(payload.ct))
      const sections = JSON.parse(new TextDecoder().decode(decrypted)) as LockedPayload["sections"]
      setLockedSections(sections.map((section) => ({ ...section, html: sanitizeHtml(section.html) })))
      setUnlocked(true)
      setPassword("")
    } catch {
      setError("Incorrect password")
      setPassword("")
    }
  }

  return <article className="project-article vehicle-recovery-case-study">
    <a className="back-link" href="index.html#case-studies">Back to work</a>
    <div className="vehicle-recovery-hero" id={getCaseStudySectionId(project.slug, "hero")}>
      <div className="vehicle-recovery-eyebrow">{vehicleRecoveryContent.eyebrow}</div>
      <h1>{vehicleRecoveryContent.title}</h1>
      <p className="project-lede">{vehicleRecoveryContent.summary}</p>
      <div className="project-meta-grid">{vehicleRecoveryContent.meta.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>
      <div className="project-hero-cover"><ProjectCover project={project} index={0} /></div>
    </div>
    <div className="project-layout">
      <CaseStudyNavigation projectSlug={project.slug} sections={navigationSections} lockedIds={unlocked ? [] : lockedIds} onLockedClick={focusGate} />
      <div className="project-article-body">
        <section id={getCaseStudySectionId(project.slug, "stats")} className="vehicle-recovery-stats" aria-label="Results">
          {vehicleRecoveryContent.stats.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}
        </section>
        {vehicleRecoveryContent.sections.map((section) => <NativeVehicleSection key={section.id} projectSlug={project.slug} section={section} />)}
        {!unlocked ? <UnlockGate gateId={gateId} password={password} setPassword={setPassword} error={error} onSubmit={handleUnlock} /> : lockedSections.map((section) => <section className="vehicle-recovery-content-section" id={getCaseStudySectionId(project.slug, section.id)} key={section.id}><div className="section-heading"><span>{section.title}</span><h2>{section.title}</h2></div><div className="vehicle-recovery-rich-content" dangerouslySetInnerHTML={{ __html: section.html }} /></section>)}
        <div className="project-next"><Card><CardContent><div><span className="project-next-label">Have a similar challenge?</span><h2>Let's make it clearer.</h2></div><a className="button-link" href={`mailto:${site.email}`}>Start a conversation</a></CardContent></Card></div>
      </div>
    </div>
  </article>
}

function NativeVehicleSection({ projectSlug, section }: { projectSlug: string; section: VehicleRecoverySection }) {
  return <section className="vehicle-recovery-content-section" id={getCaseStudySectionId(projectSlug, section.id)}>
    <div className="section-heading"><span>{section.title}</span><h2>{section.title}</h2></div>
    {section.lead && <p className="section-lead">{section.lead}</p>}
    <div className="vehicle-recovery-blocks">{section.blocks?.map((block, index) => <VehicleBlock block={block} key={`${section.id}-${index}`} />)}</div>
  </section>
}

function VehicleBlock({ block }: { block: VehicleRecoveryBlock }) {
  if (block.type === "subheading") return <h3>{block.text}</h3>
  if (block.type === "quote") return <blockquote>{block.text}{block.attribution && <cite>{block.attribution}</cite>}</blockquote>
  if (block.type === "list") return <ul>{block.items.map((item) => <li key={item}>{item}</li>)}</ul>
  if (block.type === "table") return <div className="vehicle-recovery-table-wrap"><table><thead><tr>{block.headers.map((header, index) => <th key={`${index}-${header}`}>{header}</th>)}</tr></thead><tbody>{block.rows.map((row, rowIndex) => <tr key={`${rowIndex}-${row[0]}`}>{row.map((cell, index) => index === 0 ? <th scope="row" key={`${index}-${cell}`}>{cell}</th> : <td key={`${index}-${cell}`}>{cell}</td>)}</tr>)}</tbody></table></div>
  return <p>{block.text}</p>
}

function UnlockGate({ gateId, password, setPassword, error, onSubmit }: { gateId: string; password: string; setPassword: (value: string) => void; error: string; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return <section className="case-study-gate" id={gateId} aria-labelledby="case-study-gate-title">
    <div className="case-study-skeleton" aria-hidden="true"><span /><span /><div><i /><i /><i /></div><span /></div>
    <Card><CardContent><div className="case-study-gate-card">
      <span className="case-study-gate-icon" aria-hidden="true">🔒</span>
      <h2 id="case-study-gate-title">The rest of this case study is protected</h2>
      <p>This project contains confidential company work. Enter the password to continue.</p>
      <form onSubmit={onSubmit}>
        <label htmlFor="case-study-password">Password</label>
        <input id="case-study-password" type="password" autoComplete="off" value={password} onChange={(event) => setPassword(event.target.value)} required />
        <Button type="submit">Unlock</Button>
        {error && <p className="case-study-gate-error" role="alert">{error}</p>}
      </form>
      <a className="case-study-back-button" href="index.html#case-studies">Back to portfolio</a>
    </div></CardContent></Card>
  </section>
}

function sanitizeHtml(html: string) {
  const template = document.createElement("template")
  template.innerHTML = html
  template.content.querySelectorAll("script, style, iframe, object, embed").forEach((element) => element.remove())
  template.content.querySelectorAll("*").forEach((element) => [...element.attributes].forEach((attribute) => {
    if (attribute.name === "style" || attribute.name === "class" || attribute.name.startsWith("on")) element.removeAttribute(attribute.name)
  }))
  return template.innerHTML
}
