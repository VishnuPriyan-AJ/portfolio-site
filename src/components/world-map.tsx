import { useMemo, useState } from "react"
import { ArrowUpRight, Compass, Home, X } from "lucide-react"
import { site } from "@/data"
import { ButtonLink } from "@/components/ui/button"
import { worldLandmarks, type WorldLandmark } from "@/world-data"

function LandmarkIcon({ type }: { type: WorldLandmark["landmarkType"] }) {
  if (type === "home") return <Home size={20} strokeWidth={1.8} />
  if (type === "frontier") return <Compass size={22} strokeWidth={1.7} />
  return <span className={`world-landmark-glyph world-landmark-glyph-${type}`} aria-hidden="true"><i /><i /><i /></span>
}

function LandmarkPanel({ landmark, close }: { landmark: WorldLandmark; close: () => void }) {
  const relatedProjects = useMemo(() => site.caseStudies.filter((project) => landmark.relatedProjectIds?.includes(project.slug)), [landmark.relatedProjectIds])
  return <aside className="world-detail-panel" aria-labelledby="world-detail-title">
    <div className="world-detail-header"><span className="world-detail-number">{landmark.number}</span><button type="button" className="world-close" onClick={close} aria-label="Close landmark details"><X size={17} /></button></div>
    <p className="world-detail-category">{landmark.category === "frontier" ? "A place to keep exploring" : `${landmark.category} chapter`}</p>
    <h2 id="world-detail-title">{landmark.title}</h2>
    {landmark.dateRange && <p className="world-detail-date">{landmark.dateRange}</p>}
    <p className="world-detail-description">{landmark.description}</p>
    {relatedProjects.length > 0 && <div className="world-related-work"><span>Selected work from this chapter</span>{relatedProjects.map((project) => <ButtonLink key={project.slug} href={`project.html?slug=${encodeURIComponent(project.slug)}`} variant="outline">{project.title}<ArrowUpRight size={14} /></ButtonLink>)}</div>}
  </aside>
}

export function WorldMap() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = worldLandmarks.find((landmark) => landmark.id === selectedId)
  return <section className="world-section" id="journey" aria-labelledby="world-title">
    <div className="world-section-intro"><div><p className="world-kicker">A personal atlas</p><h2 id="world-title">The part of the map I’ve explored so far.</h2></div><p>Each landmark is a chapter in the journey. Select one to see what it represents.</p></div>
    <div className={`world-layout${selected ? " has-selection" : ""}`}>
      <div className="world-map-frame">
        <div className="world-map-toolbar"><span>Vishnu’s map</span><span>Drag-free by design</span></div>
        <svg className="world-landscape" viewBox="0 0 1200 720" role="img" aria-label="Illustrated map of Vishnu Priyan's journey">
          <path className="world-water" d="M0 470C160 420 200 520 344 493s180-110 299-73 174 111 302 75 145-88 255-66v291H0Z" />
          <path className="world-hill hill-one" d="M0 230C120 145 230 172 320 242s148 73 248 20 189-75 286-15 177 84 346 4v469H0Z" />
          <path className="world-hill hill-two" d="M0 335c133-74 242-35 350 34s194 63 299-4 192-71 291-4 171 59 260 7v352H0Z" />
          <path className="world-fog fog-left" d="M0 0h250c-55 105-38 211 20 310S200 527 0 600Z" />
          <path className="world-fog fog-right" d="M1200 0H1010c46 99 39 185-15 274s-22 212 205 286Z" />
          <path className="world-route-shadow" d="M120 500C220 390 270 390 395 472S482 330 602 310 677 520 840 380 920 257 1080 92" />
          <path className="world-route" d="M120 500C220 390 270 390 395 472S482 330 602 310 677 520 840 380 920 257 1080 92" />
          {Array.from({ length: 15 }, (_, index) => <g className="world-tree" key={index} transform={`translate(${70 + (index * 83) % 1080} ${190 + (index * 137) % 410})`}><path d="M0 12v16" /><circle cx="0" cy="8" r="10" /><circle cx="-7" cy="13" r="7" /><circle cx="7" cy="13" r="7" /></g>)}
          <path className="world-field" d="M340 118h150v90H340z" /><path className="world-field-line" d="M370 118v90m40-90v90m40-90v90m40-90v90" />
          <path className="world-river" d="M610 0c-40 86 45 150 5 240s-22 138 53 205 18 171-14 275" />
          <circle className="world-sun" cx="1010" cy="90" r="30" />
        </svg>
        <div className="world-landmarks" aria-label="Journey landmarks">{worldLandmarks.map((landmark) => <button key={landmark.id} type="button" className={`world-landmark world-landmark-${landmark.category}${selectedId === landmark.id ? " is-selected" : ""}`} style={{ left: `${landmark.x}%`, top: `${landmark.y}%` }} onClick={() => setSelectedId(landmark.id)} aria-label={`Open ${landmark.title} landmark`} aria-pressed={selectedId === landmark.id}><span className="world-landmark-marker"><LandmarkIcon type={landmark.landmarkType} /></span><span className="world-landmark-label"><b>{landmark.number}</b>{landmark.title}</span></button>)}</div>
      </div>
      {selected && <LandmarkPanel landmark={selected} close={() => setSelectedId(null)} />}
    </div>
  </section>
}

export function WorldHero() {
  return <section className="world-hero" aria-labelledby="world-hero-title">
    <div className="world-hero-copy"><p className="world-kicker">Vishnu Priyan A J · Product Designer</p><h1 id="world-hero-title">Life is an unexplored map.</h1><p>Here’s the part I’ve explored so far.</p><div className="world-hero-actions"><ButtonLink href="#case-studies">View selected work</ButtonLink><a className="world-secondary-action" href="#journey">Explore my journey</a></div></div>
    <div className="world-hero-compass" aria-hidden="true"><Compass size={24} /><span>North is wherever curiosity leads.</span></div>
  </section>
}
