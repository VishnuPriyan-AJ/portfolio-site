import React from "react"
import ReactDOM from "react-dom/client"
import { HomePage, ProjectPage } from "@/app"
import "@/styles.css"
import "@/sections.css"
import "@/autobiography.css"
import "@/world.css"

const isProjectPage = window.location.pathname.endsWith("project.html")
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>{isProjectPage ? <ProjectPage /> : <HomePage />}</React.StrictMode>,
)
