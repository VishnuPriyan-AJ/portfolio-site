import { Boxes, Gauge, MessageSquareText, Network } from "lucide-react"
import type { CaseStudy } from "@/data"
import { VehicleRecoveryAnimatedCover } from "@/components/vehicle-recovery-animated-cover"

const icons = [Network, Boxes, Gauge, MessageSquareText]

export function ProjectCover({
  project,
  index = 0,
  square = false,
}: {
  project: Pick<CaseStudy, "title" | "image"> & { slug?: string }
  index?: number
  square?: boolean
}) {
  // If this is the Vehicle Recovery Console, render the micro-animated cover
  if (
    project.title.toLowerCase().includes("vehicle recovery") ||
    project.slug === "vehicle-recovery-console"
  ) {
    return <VehicleRecoveryAnimatedCover />
  }

  const Icon = icons[index % icons.length]
  if (project.image) {
    return (
      <img
        className="project-cover-image"
        src={import.meta.env.BASE_URL + project.image}
        alt=""
        loading="lazy"
      />
    )
  }

  return (
    <div
      className={`project-cover project-cover-${index % 4}${square ? " project-cover-square" : ""}`}
      aria-hidden="true"
    >
      <div className="cover-toolbar">
        <span />
        <span />
        <span />
        <i>workspace / overview</i>
      </div>
      <div className="cover-canvas">
        <div className="cover-orbit cover-orbit-one" />
        <div className="cover-orbit cover-orbit-two" />
        <div className="cover-panel cover-panel-main">
          <Icon size={22} strokeWidth={1.5} />
          <span className="cover-line cover-line-wide" />
          <span className="cover-line" />
          <div className="cover-bars">
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
        </div>
        <div className="cover-panel cover-panel-float">
          <span className="cover-dot" />
          <span className="cover-line cover-line-wide" />
          <span className="cover-line" />
        </div>
        <span className="cover-index">0{index + 1}</span>
      </div>
      <span className="sr-only">Decorative visual for {project.title}</span>
    </div>
  )
}
