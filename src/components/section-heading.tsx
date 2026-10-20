import { Badge } from "@/components/ui/badge"

export function SectionHeading({ eyebrow, title, description, id }: { eyebrow: string; title: string; description?: string; id?: string }) {
  return <div className="section-heading">
    <Badge className="section-eyebrow">{eyebrow}</Badge>
    <h2 id={id}>{title}</h2>
    {description && <p>{description}</p>}
  </div>
}
