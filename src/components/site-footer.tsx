import { ArrowUp } from "lucide-react"
import { site } from "@/data"

export function SiteFooter() {
  return (
    <footer className="container-shell site-footer">
      <p>© {new Date().getFullYear()} {site.name}. Designed with intention.</p>
      <a href="#top" className="footer-top">Back to top <ArrowUp size={14} aria-hidden="true" /></a>
    </footer>
  )
}
