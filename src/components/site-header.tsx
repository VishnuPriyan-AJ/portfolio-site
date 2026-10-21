import { useEffect, useState } from "react"
import { Menu, Moon, Sun, X } from "lucide-react"
import { site } from "@/data"
import { ButtonLink } from "@/components/ui/button"

function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("portfolio-theme")
    return saved ? saved === "dark" : true
  })

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark)
    document.documentElement.classList.toggle("light", !dark)
    localStorage.setItem("portfolio-theme", dark ? "dark" : "light")
    const syncTheme = () => setDark(document.documentElement.classList.contains("dark"))
    window.addEventListener("portfolio-theme-change", syncTheme)
    return () => window.removeEventListener("portfolio-theme-change", syncTheme)
  }, [dark])

  return <button className="theme-toggle" type="button" aria-label={`Switch to ${dark ? "light" : "dark"} theme`} title={`Switch to ${dark ? "light" : "dark"} theme`} onClick={() => {
    const next = !document.documentElement.classList.contains("dark")
    document.documentElement.classList.toggle("dark", next)
    document.documentElement.classList.toggle("light", !next)
    localStorage.setItem("portfolio-theme", next ? "dark" : "light")
    window.dispatchEvent(new Event("portfolio-theme-change"))
  }}>
    {dark ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
  </button>
}

export function SiteHeader({ project = false }: { project?: boolean }) {
  const [open, setOpen] = useState(false)
  const home = project ? "index.html" : ""
  const links = [
    { href: `${home}#case-studies`, label: "Work" },
    { href: `${home}#explorations`, label: "Explorations" },
    { href: `${home}#contact`, label: "Contact" },
  ]

  return (
    <header className="site-header sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="container-shell flex h-16 items-center justify-between gap-4">
        <a className="brand-link" href="index.html" aria-label={`${site.name}, home`}>
          <span className="brand-mark" aria-hidden="true">{site.name.charAt(0)}</span>
          <span>{site.name}</span>
        </a>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {links.map((link) => <a className="nav-link" key={link.href} href={link.href}>{link.label}</a>)}
          <ThemeToggle />
          <ButtonLink className="ml-2" size="sm" variant="outline" href={site.resumeUrl}>
            Resume
          </ButtonLink>
        </nav>
        <div className="flex items-center gap-2 md:hidden"><ThemeToggle /><button
          className="inline-flex size-10 items-center justify-center rounded-lg border border-border bg-card text-foreground hover:bg-accent md:hidden"
          type="button"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={19} /> : <Menu size={19} />}
        </button></div>
      </div>
      {open && <nav id="mobile-navigation" className="mobile-navigation border-t border-border bg-background p-4 md:hidden" aria-label="Mobile navigation">
        {links.map((link) => <a className="mobile-nav-link" key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}</a>)}
        <ButtonLink className="mt-2 w-full" size="sm" variant="outline" href={site.resumeUrl}>Download resume</ButtonLink>
      </nav>}
    </header>
  )
}
