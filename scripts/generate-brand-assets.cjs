// Run from the repository root: node scripts/generate-brand-assets.cjs
// Sharp ships with Next.js in this workspace; no additional dependency is needed.
const { createRequire } = require("node:module")
const fs = require("node:fs")
const path = require("node:path")
const nextRequire = createRequire(
  require.resolve("next/package.json", { paths: [path.resolve("apps/web")] })
)
const sharp = nextRequire("sharp")
const logo = fs.readFileSync("apps/web/public/logo.svg", "utf8")
async function main() {
  for (const [file, size] of [
    ["apps/web/public/logo-512.png", 512],
    ["apps/web/app/icon.png", 192],
    ["apps/web/app/apple-icon.png", 180],
  ]) {
    await sharp(Buffer.from(logo)).resize(size, size).png().toFile(file)
  }
  const mark = logo.replace(
    "<svg ",
    '<svg x="80" y="80" width="96" height="96" '
  )
  const social = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#0b1226"/><circle cx="1150" cy="600" r="370" fill="#172554"/>${mark}<g font-family="Arial, sans-serif"><text x="200" y="141" fill="#fff" font-size="44" font-weight="700">KeyTester.io</text><text x="80" y="300" fill="#fff" font-size="72" font-weight="700">Know every key works.</text><text x="84" y="370" fill="#cbd5e1" font-size="30">Free online keyboard tester</text><text x="84" y="488" fill="#38bdf8" font-size="25">Instant feedback. No download. No sign-up.</text></g></svg>`
  fs.writeFileSync("apps/web/public/og-image.svg", social)
  await sharp(Buffer.from(social)).png().toFile("apps/web/public/og-image.png")
}
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
