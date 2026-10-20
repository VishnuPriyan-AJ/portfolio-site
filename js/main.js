(function () {
  "use strict";
  var S = window.SITE;
  if (!S) return;

  /* ---------- helpers ---------- */
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === "text") node.textContent = attrs[k];
      else if (k === "class") node.className = attrs[k];
      else node.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) node.appendChild(c); });
    return node;
  }

  function hash(str) {
    var h = 0;
    for (var i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
    return Math.abs(h);
  }

  /* Generated cover art so the site works with no image files. */
  function coverArt(seedText, accent, size) {
    var h = hash(seedText);
    var w = size === "square" ? 400 : 640;
    var ht = size === "square" ? 400 : 440;
    var ns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 " + w + " " + ht);
    svg.setAttribute("preserveAspectRatio", "xMidYMid slice");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("class", "cover-art");

    var bg = document.createElementNS(ns, "rect");
    bg.setAttribute("width", w); bg.setAttribute("height", ht);
    bg.setAttribute("fill", accent);
    svg.appendChild(bg);

    for (var i = 0; i < 4; i++) {
      var shape = document.createElementNS(ns, i % 2 ? "circle" : "rect");
      var r = 60 + ((h >> (i * 3)) % 120);
      var x = (h >> (i * 2 + 1)) % w;
      var y = (h >> (i * 2 + 3)) % ht;
      if (shape.tagName === "circle") {
        shape.setAttribute("cx", x); shape.setAttribute("cy", y); shape.setAttribute("r", r);
      } else {
        shape.setAttribute("x", x - r); shape.setAttribute("y", y - r);
        shape.setAttribute("width", r * 1.6); shape.setAttribute("height", r * 1.6);
        shape.setAttribute("rx", 14);
      }
      shape.setAttribute("fill", i % 2 ? "#ffffff" : "#000000");
      shape.setAttribute("opacity", i % 2 ? "0.16" : "0.12");
      svg.appendChild(shape);
    }
    return svg;
  }

  function cover(item, size) {
    var box = el("div", { class: "cover" + (size === "square" ? " cover-square" : "") });
    if (item.image) {
      box.appendChild(el("img", { src: item.image, alt: "", loading: "lazy" }));
    } else {
      box.appendChild(coverArt(item.title, item.accent || "#2b4bff", size));
    }
    return box;
  }

  function setText(id, value) {
    var node = document.getElementById(id);
    if (node) node.textContent = value;
  }

  /* ---------- shared chrome ---------- */
  document.title = S.title;
  var meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute("content", S.description);

  setText("brand", S.name);
  setText("footer-text", "© " + new Date().getFullYear() + " " + S.name + ". All rights reserved.");

  var resume = document.getElementById("resume-link");
  if (resume) resume.setAttribute("href", S.resumeUrl);

  var navToggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("site-nav");
  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  var path = location.pathname;
  var isProject = /project\.html$/.test(path);

  /* ---------- home page ---------- */
  if (!isProject) {
    setText("hero-name", "Hi, I’m " + S.name);
    setText("hero-role", S.role);
    setText("hero-intro", S.intro);

    var links = document.getElementById("social-links");
    if (links) {
      S.links.forEach(function (l) {
        links.appendChild(el("a", { href: l.url, target: "_blank", rel: "noopener noreferrer", text: l.label }));
      });
      links.appendChild(el("a", { href: "mailto:" + S.email, text: "Email" }));
    }

    var heroArt = document.getElementById("hero-art");
    if (heroArt) heroArt.appendChild(coverArt(S.name + S.role, "#14202b", "square"));

    setText("cs-intro", S.caseStudiesIntro);
    var list = document.getElementById("case-list");
    if (list) {
      S.caseStudies.forEach(function (cs) {
        var link = "project.html?slug=" + encodeURIComponent(cs.slug);
        var tags = el("ul", { class: "tags" }, cs.tags.map(function (t) { return el("li", { text: t }); }));
        var body = el("div", { class: "case-body" }, [
          el("h3", { text: cs.title }),
          el("p", { text: cs.summary }),
          tags,
          el("a", { class: "text-link", href: link, text: "View case study" })
        ]);
        var media = el("a", { class: "case-media", href: link, tabindex: "-1", "aria-hidden": "true" }, [cover(cs)]);
        list.appendChild(el("article", { class: "case" }, [media, body]));
      });
    }

    setText("ex-title", S.explorationsTitle);
    var grid = document.getElementById("ex-grid");
    if (grid) {
      S.explorations.forEach(function (ex) {
        var a = el("a", { class: "ex", href: ex.url }, [
          cover(ex, "square"),
          el("span", { class: "ex-label" }, [
            el("strong", { text: ex.title }),
            el("span", { text: ex.tag })
          ])
        ]);
        grid.appendChild(el("li", {}, [a]));
      });
    }

    if (S.feature) {
      setText("feature-title", S.feature.title);
      setText("feature-text", S.feature.text);
      var fl = document.getElementById("feature-link");
      if (fl) { fl.setAttribute("href", S.feature.url); fl.textContent = S.feature.linkLabel; }
    }
  }

  /* ---------- project page ---------- */
  if (isProject) {
    var slug = new URLSearchParams(location.search).get("slug");
    var cs = S.caseStudies.filter(function (c) { return c.slug === slug; })[0];
    var root = document.getElementById("project");
    if (!root) return;

    if (!cs) {
      root.appendChild(el("h1", { text: "Case study not found" }));
      root.appendChild(el("p", { text: "That link doesn’t match a case study. Go back and pick one from the list." }));
      root.appendChild(el("a", { class: "text-link", href: "index.html#case-studies", text: "Back to case studies" }));
    } else {
      document.title = cs.title + " | " + S.name;
      root.appendChild(el("a", { class: "text-link", href: "index.html#case-studies", text: "All case studies" }));
      root.appendChild(el("h1", { text: cs.title }));
      root.appendChild(el("ul", { class: "tags" }, cs.tags.map(function (t) { return el("li", { text: t }); })));
      root.appendChild(el("p", { class: "lede", text: cs.summary }));
      root.appendChild(cover(cs));
      cs.sections.forEach(function (s) {
        root.appendChild(el("h2", { text: s.heading }));
        root.appendChild(el("p", { text: s.body }));
      });
    }
  }
})();
