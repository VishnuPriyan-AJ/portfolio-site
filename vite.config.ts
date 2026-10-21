import { resolve } from "node:path"
import { fileURLToPath } from "node:url"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

const root = fileURLToPath(new URL(".", import.meta.url))

export default defineConfig({
  base: "/portfolio-site/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": resolve(root, "src") },
  },
  build: {
    rollupOptions: {
      input: {
        home: resolve(root, "index.html"),
        project: resolve(root, "project.html"),
      },
    },
  },
})
