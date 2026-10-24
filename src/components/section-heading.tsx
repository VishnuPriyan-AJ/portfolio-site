export function SectionHeading({ title, description, id }: { title: string; description?: string; id?: string }) {
  return <div className="section-heading">
    <h2 id={id}>{title}</h2>
    {description && <p>{description}</p>}
  </div>
}
