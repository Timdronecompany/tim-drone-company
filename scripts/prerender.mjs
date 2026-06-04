import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { render } from '../dist-ssr/entry-server.js'
import { detailPages } from '../src/servicePages.js'

const distIndexPath = resolve('dist/index.html')
const html = await readFile(distIndexPath, 'utf8')

if (!html.includes('<div id="root"></div>')) {
  throw new Error('Could not find root element placeholder in dist/index.html')
}

const homeMeta = {
  path: '/',
  title: 'Drone Company Amsterdam | Cinematic Drone & FPV Filming | T.I.M.',
  description: 'T.I.M. Drone Company in Amsterdam provides cinematic drone filming, professional drone operators, drone pilots, FPV drone work, heavy-lift aerial cinematography and custom drone solutions for film, commercials, TV and productions worldwide.',
  keywords: 'drone Amsterdam, drone company Amsterdam, drone operator Amsterdam, droneoperator Amsterdam, drone pilot Amsterdam, dronepilot Amsterdam, dronepiloot Amsterdam, drone operator Netherlands, dronepilot Nederland, dronepiloot Nederland, FPV drone Amsterdam, aerial filming Amsterdam, drone filming Netherlands, cinematic drone, drone videography, heavy lift drone, T.I.M. Drone Company',
  ogTitle: 'T.I.M. Drone Company | Cinematic Drone & FPV Filming Amsterdam',
  ogDescription: 'Amsterdam-based cinematic drone operators, drone pilots and dronepiloten for commercials, film, television, FPV, heavy-lift aerial cinematography and custom drone builds.',
}

const routes = [
  homeMeta,
  ...detailPages.map((page) => ({
    path: page.path,
    title: page.metaTitle,
    description: page.metaDescription,
    keywords: page.keywords,
    ogTitle: page.metaTitle,
    ogDescription: page.metaDescription,
  })),
]

function escapeAttribute(value) {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;')
}

function pageUrl(path) {
  return `https://www.timdronecompany.nl${path}`
}

function applyMetaTags(source, meta) {
  const canonicalUrl = pageUrl(meta.path)

  return source
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeAttribute(meta.title)}</title>`)
    .replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/>/, `<meta name="description" content="${escapeAttribute(meta.description)}" />`)
    .replace(/<meta\s+name="keywords"\s+content="[^"]*"\s*\/>/, `<meta name="keywords" content="${escapeAttribute(meta.keywords)}" />`)
    .replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/, `<link rel="canonical" href="${canonicalUrl}" />`)
    .replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/, `<meta property="og:title" content="${escapeAttribute(meta.ogTitle)}" />`)
    .replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/, `<meta property="og:description" content="${escapeAttribute(meta.ogDescription)}" />`)
    .replace(/<meta\s+property="og:url"\s+content="[^"]*"\s*\/>/, `<meta property="og:url" content="${canonicalUrl}" />`)
    .replace(/<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/>/, `<meta name="twitter:title" content="${escapeAttribute(meta.ogTitle)}" />`)
    .replace(/<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/>/, `<meta name="twitter:description" content="${escapeAttribute(meta.ogDescription)}" />`)
}

async function writeRoute(meta) {
  const appHtml = render(meta.path)
  const routeHtml = applyMetaTags(
    html.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`),
    meta,
  )

  if (meta.path === '/') {
    await writeFile(distIndexPath, routeHtml)
    return
  }

  const routeDir = resolve('dist', meta.path.replace(/^\/|\/$/g, ''))
  await mkdir(routeDir, { recursive: true })
  await writeFile(resolve(routeDir, 'index.html'), routeHtml)
}

await Promise.all(routes.map(writeRoute))
