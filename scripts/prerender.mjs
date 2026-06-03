import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { render } from '../dist-ssr/entry-server.js'

const distIndexPath = resolve('dist/index.html')
const html = await readFile(distIndexPath, 'utf8')
const appHtml = render()

if (!html.includes('<div id="root"></div>')) {
  throw new Error('Could not find root element placeholder in dist/index.html')
}

await writeFile(
  distIndexPath,
  html.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`),
)
