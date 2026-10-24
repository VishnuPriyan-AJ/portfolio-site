import crypto from "node:crypto"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const sourcePath = path.join(root, "case-studies", "vehicle-recovery", "source.html")
const outputPath = path.join(root, "public", "case-studies", "vehicle-recovery", "index.html")
const password = process.env.CASESTUDY_PASSWORD

if (!password) {
  throw new Error("CASESTUDY_PASSWORD is required to build the protected case study.")
}

const source = fs.readFileSync(sourcePath, "utf8")
const lockedMatch = source.match(/<div id="locked-content">([\s\S]*?)<\/div><!-- \/locked-content -->/i)

if (!lockedMatch) {
  throw new Error("The source must contain a marked locked-content region.")
}

const lockedHtml = lockedMatch[1].trim().replace(/<section id="score"[\s\S]*?<\/section>\s*/i, "")
const salt = crypto.randomBytes(16)
const iv = crypto.randomBytes(12)
const key = crypto.pbkdf2Sync(password, salt, 600000, 32, "sha256")
const cipher = crypto.createCipheriv("aes-256-gcm", key, iv)
const ciphertext = Buffer.concat([cipher.update(lockedHtml, "utf8"), cipher.final(), cipher.getAuthTag()])
const payload = JSON.stringify({
  salt: salt.toString("base64"),
  iv: iv.toString("base64"),
  ct: ciphertext.toString("base64"),
})

const lockedIds = ["flow", "process", "product", "impact", "reflection", "next"]
let publicHtml = source.replace(lockedMatch[0], `
<div id="case-study-lock" class="case-study-lock" aria-live="polite">
  <div class="locked-placeholder" aria-hidden="true">
    <div class="placeholder-line wide"></div>
    <div class="placeholder-line"></div>
    <div class="placeholder-grid"><span></span><span></span><span></span></div>
    <div class="placeholder-line short"></div>
  </div>
  <div class="lock-card" role="dialog" aria-labelledby="lock-title" aria-describedby="lock-description">
    <div class="lock-icon" aria-hidden="true">&#128274;</div>
    <h2 id="lock-title">The rest of this case study is protected</h2>
    <p id="lock-description">This project contains confidential company work. Enter the password to continue.</p>
    <form id="unlock-form">
      <label for="case-study-password">Password</label>
      <div class="password-field">
        <input id="case-study-password" name="password" type="password" autocomplete="off" required>
        <button type="button" id="toggle-password" aria-label="Show password">Show</button>
      </div>
      <button class="unlock-button" type="submit">Unlock</button>
      <p id="unlock-error" class="unlock-error" role="alert" hidden>Incorrect password</p>
    </form>
    <a href="mailto:YOUR_EMAIL">Request access</a>
    <noscript>Enable JavaScript to unlock.</noscript>
  </div>
</div>`)

for (const id of lockedIds) {
  const linkPattern = new RegExp(`(<a class="sidenav-link)([^>]*href="#${id}"[^>]*)onclick="setActive\\(this\\)"([^>]*)>`, "i")
  publicHtml = publicHtml.replace(linkPattern, `$1 snav-locked$2onclick="handleLockedNavigation(event, this)"$3><span class="snav-lock" aria-hidden="true">&#128274;</span>`)
}

publicHtml = publicHtml.replace(/<section id="score"[\s\S]*?<\/section>\s*/i, "")
publicHtml = publicHtml.replace(/<div class="sidenav-section"><a class="sidenav-link" href="#score"[\s\S]*?<\/div>\s*/i, "")
publicHtml = publicHtml.replace(/<hr class="sidenav-divider">\s*/i, "")
publicHtml = publicHtml.replace(/<!--\s*SCORE[^>]*-->\s*/gi, "")
publicHtml = publicHtml.replace(/\bscore-(?:section|title|sub|grid|cell|dim|val|bar-wrap|bar|total|note)\b/gi, "")
publicHtml = publicHtml.replace(/,\s*['"]score['"](?=\s*\])/gi, "")
publicHtml = publicHtml.replace(/<\/style>/i, `${getLockStyles()}</style>`)
publicHtml = publicHtml.replace(/<\/body>/i, `<script type="application/json" id="locked-payload">${payload}</script>${getLockScript()}\n</body>`)
publicHtml = publicHtml.replace(/<script>\s*const sections = document\.querySelectorAll\([\s\S]*?<\/script>/i, (script) => script)

fs.mkdirSync(path.dirname(outputPath), { recursive: true })
fs.writeFileSync(outputPath, `${publicHtml}\n`, "utf8")

function getLockStyles() {
  return `
.case-study-lock { position: relative; min-height: 900px; padding: 96px 48px; overflow: hidden; background: var(--paper); }
.locked-placeholder { position: absolute; inset: 0; display: grid; align-content: start; gap: 24px; padding: 120px 10%; filter: blur(10px); opacity: .6; user-select: none; pointer-events: none; }
.placeholder-line { width: 72%; height: 22px; border-radius: 8px; background: var(--paper-3); }
.placeholder-line.wide { width: 88%; height: 44px; }
.placeholder-line.short { width: 45%; }
.placeholder-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; width: 100%; }
.placeholder-grid span { display: block; height: 260px; border-radius: 12px; background: var(--paper-2); }
.lock-card { position: sticky; top: 40%; z-index: 1; max-width: 500px; margin: 0 auto; padding: 32px; border: 1px solid var(--border); border-radius: 16px; background: rgba(245,243,238,.96); box-shadow: 0 18px 60px rgba(14,15,12,.16); text-align: center; }
.lock-icon { font-size: 24px; margin-bottom: 12px; }
.lock-card h2 { font-family: var(--serif); font-size: clamp(26px, 4vw, 38px); line-height: 1.1; margin-bottom: 12px; }
.lock-card p { color: var(--ink-2); font-size: 14px; line-height: 1.6; }
.lock-card form { display: grid; gap: 10px; margin: 24px 0 14px; text-align: left; }
.lock-card label { font-size: 12px; font-weight: 600; }
.password-field { display: grid; grid-template-columns: 1fr auto; gap: 8px; }
.password-field input { min-width: 0; border: 1px solid var(--border); border-radius: 8px; padding: 10px 12px; background: var(--paper); color: var(--ink); font: inherit; }
.password-field button, .unlock-button { border: 0; border-radius: 8px; padding: 10px 14px; cursor: pointer; font: inherit; }
.password-field button { background: var(--paper-2); color: var(--ink-2); }
.unlock-button { background: var(--accent); color: white; font-weight: 600; }
.lock-card a { color: var(--accent); font-size: 13px; }
.unlock-error { color: var(--accent) !important; font-size: 13px !important; }
.snav-locked { opacity: .55; }
.snav-lock { margin-left: auto; font-size: 10px; }
.case-study-unlocked .case-study-lock { display: none; }
@media (max-width: 900px) { .case-study-lock { min-height: 780px; padding: 72px 24px; } .lock-card { position: relative; top: auto; } .placeholder-grid { grid-template-columns: 1fr; } .placeholder-grid span { height: 150px; } }
@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
`}

function getLockScript() {
  return `<script>
(() => {
  const payload = document.getElementById('locked-payload');
  const lock = document.getElementById('case-study-lock');
  const form = document.getElementById('unlock-form');
  const input = document.getElementById('case-study-password');
  const error = document.getElementById('unlock-error');
  const toggle = document.getElementById('toggle-password');
  const lockedIds = ${JSON.stringify(lockedIds)};
  const decode = value => Uint8Array.from(atob(value), character => character.charCodeAt(0));

  window.handleLockedNavigation = (event, link) => {
    if (document.body.classList.contains('case-study-unlocked')) return;
    event.preventDefault();
    document.getElementById('case-study-lock')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    input?.focus();
  };

  toggle?.addEventListener('click', () => {
    const showing = input.type === 'text';
    input.type = showing ? 'password' : 'text';
    toggle.textContent = showing ? 'Show' : 'Hide';
    toggle.setAttribute('aria-label', showing ? 'Show password' : 'Hide password');
  });

  function observeSections() {
    const links = [...document.querySelectorAll('.sidenav-link')];
    const sections = [...document.querySelectorAll('section[id], .hero[id]')];
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      const current = visible[0]?.target.id;
      if (!current) return;
      links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === '#' + current));
    }, { threshold: [0, .2, .5], rootMargin: '-40px 0px -55% 0px' });
    sections.forEach(section => observer.observe(section));
  }

  async function unlock(password) {
    const data = JSON.parse(payload.textContent);
    const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
    const key = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt: decode(data.salt), iterations: 600000, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
    const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: decode(data.iv) }, key, decode(data.ct));
    return new TextDecoder().decode(plaintext);
  }

  form?.addEventListener('submit', async event => {
    event.preventDefault();
    error.hidden = true;
    try {
      const html = await unlock(input.value);
      lock.outerHTML = html;
      payload.remove();
      document.body.classList.add('case-study-unlocked');
      document.querySelectorAll('.snav-locked').forEach(link => link.classList.remove('snav-locked'));
      document.querySelectorAll('.snav-lock').forEach(icon => icon.remove());
      observeSections();
      document.getElementById('flow')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    } catch {
      error.hidden = false;
      input.value = '';
      input.focus();
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  });

  observeSections();
})();
</script>`
}
