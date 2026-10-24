import crypto from "node:crypto"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const sourcePath = path.join(root, "case-studies", "vehicle-recovery", "source.html")
const outputPath = path.join(root, "public", "case-studies", "vehicle-recovery", "locked-payload.json")
const password = process.env.CASESTUDY_PASSWORD

if (!password) throw new Error("CASESTUDY_PASSWORD is required to build the protected case study.")

const source = fs.readFileSync(sourcePath, "utf8")
const ids = ["flow", "process", "product", "impact", "reflection", "next"]
const sections = ids.map((id) => {
  const match = source.match(new RegExp(`<section id="${id}"[^>]*>([\\s\\S]*?)</section>`, "i"))
  if (!match) throw new Error(`Missing locked section: ${id}`)
  const headingMatch = match[1].match(/<h2[^>]*>([\s\S]*?)<\/h2>/i)
  const title = stripTags(headingMatch?.[1] ?? id)
  const html = sanitizeFragment(match[1].replace(/<div[^>]*class="section-num"[^>]*>[\s\S]*?<\/div>/i, "").replace(/<h2[^>]*>[\s\S]*?<\/h2>/i, ""))
  return { id, title, html }
})

const salt = crypto.randomBytes(16)
const iv = crypto.randomBytes(12)
const key = crypto.pbkdf2Sync(password, salt, 600000, 32, "sha256")
const cipher = crypto.createCipheriv("aes-256-gcm", key, iv)
const ciphertext = Buffer.concat([cipher.update(JSON.stringify(sections), "utf8"), cipher.final(), cipher.getAuthTag()])
const payload = {
  salt: salt.toString("base64"),
  iv: iv.toString("base64"),
  ct: ciphertext.toString("base64"),
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true })
fs.writeFileSync(outputPath, `${JSON.stringify(payload)}\n`, "utf8")

function sanitizeFragment(fragment) {
  return fragment
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/\s(?:class|style|id|on[a-z]+)="[^"]*"/gi, "")
    .replace(/\s(?:class|style|id|on[a-z]+)='[^']*'/gi, "")
}

function stripTags(value) {
  return value.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&quot;/g, '"').trim()
}
