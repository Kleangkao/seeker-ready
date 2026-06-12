import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const imagesDir = path.join(__dirname, '..', 'assets', 'images')

const MONOCHROME_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="432" height="432" viewBox="0 0 432 432">
  <rect x="108" y="124" width="216" height="184" rx="24" fill="none" stroke="#000000" stroke-width="16"/>
  <circle cx="152" cy="168" r="20" fill="none" stroke="#000000" stroke-width="12"/>
  <path d="M144 168 L150 174 L162 158" fill="none" stroke="#000000" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="188" y="156" width="120" height="12" rx="6" fill="#000000"/>
  <rect x="188" y="188" width="120" height="12" rx="6" fill="#000000"/>
  <rect x="188" y="220" width="96" height="12" rx="6" fill="#000000"/>
</svg>`

function formatBytes(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`
  }

  return `${(bytes / 1024).toFixed(1)} KB`
}

async function optimizePng(file, transform) {
  const inputPath = path.join(imagesDir, file)
  const before = fs.statSync(inputPath).size
  const outputPath = `${inputPath}.optimized`

  let pipeline = sharp(inputPath)
  pipeline = transform(pipeline)

  const usePalette = file !== 'android-icon-background.png'

  await pipeline
    .png({
      colors: usePalette ? 96 : undefined,
      compressionLevel: 9,
      effort: 10,
      palette: usePalette,
      quality: usePalette ? 85 : undefined,
    })
    .toFile(outputPath)

  fs.renameSync(outputPath, inputPath)
  const after = fs.statSync(inputPath).size

  return { file, before, after }
}

async function main() {
  const results = []

  results.push(
    await optimizePng('icon.png', (image) => image.resize(1024, 1024, { fit: 'cover' })),
  )
  results.push(
    await optimizePng('android-icon-foreground.png', (image) =>
      image.resize(1024, 1024, { fit: 'cover' }),
    ),
  )
  results.push(await optimizePng('android-icon-background.png', (image) => image))
  results.push(
    await optimizePng('splash-icon.png', (image) => image.resize(304, 304, { fit: 'cover' })),
  )
  results.push(await optimizePng('favicon.png', (image) => image.resize(48, 48, { fit: 'cover' })))

  const monochromePath = path.join(imagesDir, 'android-icon-monochrome.png')
  const monochromeBefore = fs.existsSync(monochromePath) ? fs.statSync(monochromePath).size : 0

  await sharp(Buffer.from(MONOCHROME_SVG))
    .resize(432, 432)
    .png({ compressionLevel: 9, effort: 10 })
    .toFile(monochromePath)

  const monochromeAfter = fs.statSync(monochromePath).size

  console.log('PNG optimization results:')
  for (const { file, before, after } of results) {
    console.log(`- ${file}: ${formatBytes(before)} -> ${formatBytes(after)}`)
  }

  console.log(
    `- android-icon-monochrome.png: ${formatBytes(monochromeBefore)} -> ${formatBytes(monochromeAfter)} (new single-color glyph)`,
  )
}

await main()
