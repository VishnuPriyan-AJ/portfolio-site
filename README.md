# Portfolio site

A responsive React + TypeScript portfolio with a shadcn-inspired component system, semantic theme tokens, and Vite multi-page builds. The public URLs remain `index.html` and `project.html?slug=...`.

## Run locally

Install dependencies with `npm install`, start the development server with `npm run dev`, and create a production build with `npm run build`.

## Content and assets

- `src/data.ts` – portfolio identity, links, case studies, explorations, and current feature.
- `src/app.tsx` – home and case study page composition.
- `src/components/` – shared site components and shadcn-style primitives.
- `src/styles.css` – semantic light/dark tokens, Tailwind v4 theme mapping, and responsive visual system.
- `assets/` – add a real resume PDF and project imagery here. Set each project’s `image` to a local asset path; empty values use generated decorative covers.

## Deploy

Run `npm run build` and publish the generated `dist/` directory. For GitHub Pages, configure the repository’s Pages workflow to deploy `dist/`.
