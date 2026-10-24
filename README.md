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

## Updating the protected case study

The Vehicle Recovery Console source is intentionally kept out of the public repository because it contains confidential work. Keep a local copy at `case-studies/vehicle-recovery/source.html`, then run `CASESTUDY_PASSWORD=... npm run build:case-study` to generate the encrypted public page at `public/case-studies/vehicle-recovery/index.html`. The password is never written to the repository. This protects against casual and technical viewing but remains dependent on password strength; server-side access control is the stronger future option. Web Crypto requires HTTPS or localhost.

GitHub Actions builds and publishes the site to GitHub Pages when changes are pushed to `master`. The Vite base path is configured for this repository's Pages URL: `https://vishnupriyan-aj.github.io/portfolio-site/`.

If Pages is not enabled yet, open the repository's **Settings → Pages** and select **GitHub Actions** as the build and deployment source. You can also build locally with `npm run build`; publish the generated `dist/` directory.
