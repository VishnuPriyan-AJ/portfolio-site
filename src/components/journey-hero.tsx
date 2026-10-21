import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion } from "framer-motion"
import { useEffect, useState } from "react"
import { Check, Sparkles, X } from "lucide-react"
import { journeyMilestones, type JourneyMilestone } from "@/journey"
import { PortraitArt } from "@/components/portrait-art"
import { Badge } from "@/components/ui/badge"
import { ButtonLink } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const DURATION = 14.2
const finale = [
  <>From <span>Stories</span></>,
  <>From Stories<br />to <span>Spaces</span></>,
  <>From Stories<br />to Spaces<br />to <span>Systems.</span></>,
  <>Every experience added a new point.</>,
  <>Only when the dots connected<br />did the picture emerge.</>,
  <>And together they shaped<br /><span>the designer I am today.</span></>,
]
const finaleAt = [.78, .815, .85, .89, .93, .97]

function AutoCard({ story }: { story: JourneyMilestone }) {
  return <motion.div className="portrait-story-card" role="status" aria-live="polite" aria-label={`Milestone ${story.number}: ${story.title}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .28 }}>
    <Card className="autoplay-card"><CardContent><div className="autoplay-card-top"><Badge className={`autoplay-chapter chapter-${story.chapter.toLowerCase()}`}>{story.chapter}</Badge><span className="autoplay-number">{String(story.number).padStart(2, "0")} <i>/</i> 10</span></div><h3>{story.title}</h3><p className="autoplay-lesson">{story.lesson}.</p><div className="autoplay-skills-label">Skills gained</div><div className="autoplay-skills">{story.skills.map((skill) => <Badge key={skill}>{skill}</Badge>)}</div><div className="autoplay-card-progress"><span style={{ width: `${story.number * 10}%` }} /></div></CardContent></Card>
  </motion.div>
}

function DetailCard({ story, close }: { story: JourneyMilestone; close: () => void }) {
  return <motion.div className="expanded-story" role="dialog" aria-modal="false" aria-labelledby="expanded-story-title" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}>
    <Card className="autoplay-card"><CardContent><div className="autoplay-card-top"><Badge className={`autoplay-chapter chapter-${story.chapter.toLowerCase()}`}>{story.chapter}</Badge><button className="story-card-close" type="button" aria-label="Close milestone details" onClick={close}><X size={14} /></button></div><span className="selected-index">{String(story.number).padStart(2, "0")} / 10</span><h3 id="expanded-story-title">{story.title}</h3><p className="expanded-story-description">{story.description}</p><div className="selected-lesson"><span>LESSON</span><strong>{story.lesson}</strong></div><div className="autoplay-skills-label">Skills gained</div><div className="autoplay-skills">{story.skills.map((skill) => <Badge key={skill}>{skill}</Badge>)}</div></CardContent></Card>
  </motion.div>
}

export function JourneyHero() {
  const progress = useMotionValue(0)
  const [value, setValue] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [hovered, setHovered] = useState<number | null>(null)
  const [replay, setReplay] = useState(0)
  const reducedMotion = useReducedMotion()
  const done = value >= 1
  const finalIndex = finaleAt.reduce((found, start, index) => value >= start ? index : found, -1)
  const autoIndex = !done && value < .75 && value >= .025 ? Math.min(9, Math.floor((value - .025) / .072)) : -1
  const autoStory = autoIndex >= 0 ? journeyMilestones[autoIndex] : null
  const activeStory = selected ?? hovered
  const displayedStory = activeStory ? journeyMilestones[activeStory - 1] : null

  useEffect(() => {
    let lastUpdate = 0
    return progress.on("change", (next) => {
      const now = performance.now()
      if (now - lastUpdate >= 70 || next === 1) {
        lastUpdate = now
        setValue(next)
      }
    })
  }, [progress])
  useEffect(() => {
    progress.set(0)
    if (reducedMotion) {
      progress.set(1)
      return
    }
    const controls = animate(progress, 1, { duration: DURATION, ease: "linear" })
    return () => controls.stop()
  }, [progress, reducedMotion, replay])

  useEffect(() => {
    if (!selected) return
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null)
      if (event.key === "ArrowRight") setSelected((n) => Math.min((n ?? 1) + 1, 10))
      if (event.key === "ArrowLeft") setSelected((n) => Math.max((n ?? 1) - 1, 1))
    }
    window.addEventListener("keydown", key)
    return () => window.removeEventListener("keydown", key)
  }, [selected])

  function explore() {
    document.getElementById("portrait-artwork")?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "center" })
  }

  return <section className="autobiography-hero" aria-labelledby="journey-title">
    <div className="autobiography-shell">
      <div className="autobiography-copy">
        <Badge className="autobiography-eyebrow"><span className="eyebrow-light" /> A cinematic autobiography</Badge>
        <p className="autobiography-overline">TEN MOMENTS <i>·</i> ONE PORTRAIT</p>
        <AnimatePresence mode="wait" initial={false}>
          {finalIndex < 0 ? <motion.div key="opening" className="hero-opening-copy" initial={{ opacity: 0, y: 9 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <h1 id="journey-title">From Stories<br />to Spaces<br />to <span>Systems.</span></h1>
            <p className="autobiography-lede">Every experience added a new point. Only when the dots connected did the picture emerge.</p>
            <div className="autobiography-actions"><button className="journey-primary-action" type="button" onClick={explore}>Explore My Journey</button><ButtonLink href="#case-studies" variant="outline">View My Work</ButtonLink></div>
          </motion.div> : <motion.div key={`finale-${finalIndex}`} className="hero-finale-copy" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <h1 id="journey-title" className={finalIndex < 3 ? "finale-headline" : "finale-line"} aria-live="polite">{finale[finalIndex]}</h1>
            {done && <div className="autobiography-actions"><ButtonLink href="#case-studies">Explore selected work</ButtonLink><button className="replay-link" type="button" onClick={() => { setSelected(null); setReplay((n) => n + 1) }}>Replay story</button></div>}
          </motion.div>}
        </AnimatePresence>
        <div className="autobiography-status"><span>{done ? <><Check size={13} /> Portrait complete</> : <><span className="status-pulse" /> Connecting the dots</>}</span><div className="autobiography-progress" role="progressbar" aria-label="Portrait reveal progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(value * 100)}><span style={{ width: `${value * 100}%` }} /></div><span className="status-count">{String(Math.min(10, Math.floor(value * 10) + (done ? 0 : 1))).padStart(2, "0")} / 10</span></div>
      </div>
      <div className="portrait-column" id="portrait-artwork">
        <div className="portrait-canvas-heading"><span>PORTRAIT</span><span>STATIC PLACEHOLDER</span></div>
        <div className="portrait-stage">
          <PortraitArt milestones={journeyMilestones} activeMilestone={selected} revealComplete={done} onSelect={setSelected} onHover={setHovered} />
          <AnimatePresence mode="wait">
            {displayedStory ? <DetailCard key={`detail-${displayedStory.number}`} story={displayedStory} close={() => { setSelected(null); setHovered(null) }} /> : !done && autoStory && !reducedMotion ? <AutoCard key={`auto-${autoStory.number}`} story={autoStory} /> : done ? <motion.div key="complete-note" className="portrait-complete-note" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}><Sparkles size={13} /> Every dot belongs.</motion.div> : null}
          </AnimatePresence>
        </div>
        <div className="portrait-stage-footer"><span>01 <i>STORIES</i></span><span className="stage-track"><span className="track-stories" /><span className="track-spaces" /><span className="track-systems" /></span><span>03 <i>SYSTEMS</i></span></div>
      </div>
    </div>
    <div className="autobiography-bottomline"><span>CHILDHOOD · ARCHITECTURE · PRODUCT DESIGN</span><span>SCROLL TO MEET THE WORK</span></div>
  </section>
}
