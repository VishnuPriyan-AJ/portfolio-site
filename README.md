# Portfolio site

A static portfolio built with plain HTML, CSS and JavaScript. No build step.

Structure follows a classic portfolio layout: header with resume button, hero, case studies, a grid of smaller explorations, a "now" section and a footer.

## Files

- `index.html` – home page
- `project.html` – case study page, filled from `?slug=...`
- `css/style.css` – design tokens at the top, then layout
- `js/data.js` – **all content lives here**; edit this first
- `js/main.js` – renders the content into the pages
- `assets/` – put `resume.pdf` and any images here

## Edit your content

Open `js/data.js` and change the name, intro, links, case studies and explorations. To use real images, set `image: "assets/my-cover.png"` on an item. If left empty, a generated cover is shown.

## Run locally

Open `index.html` in a browser, or serve the folder:

    python3 -m http.server 8000

Then visit http://localhost:8000.

## Deploy

GitHub Pages: push to GitHub, then Settings > Pages > Deploy from branch `main` / root.
