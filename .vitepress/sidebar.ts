import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'

export const SECTIONS = [
  { dir: 'guide', text: 'Guide' },
  { dir: 'using-the-app', text: 'Using the app' },
  { dir: 'how-it-works', text: 'How it works' },
  { dir: 'technical', text: 'Technical' },
]

const ROOT = fileURLToPath(new URL('..', import.meta.url))

interface Entry {
  text: string
  link: string
  order?: number
}

/**
 * A section's sidebar items, read from its files so a new page appears without editing the config.
 * Pages sort by their numeric `order` frontmatter; pages without one come after, by label.
 */
function sectionItems(dir: string): { text: string; link: string }[] {
  return fs
    .readdirSync(`${ROOT}${dir}`)
    .filter((file) => file.endsWith('.md'))
    .map((file): Entry => {
      const { data } = matter(fs.readFileSync(`${ROOT}${dir}/${file}`, 'utf8'))
      const slug = file.replace(/\.md$/, '')
      const label = data.sidebarTitle || data.title
      return {
        text: typeof label === 'string' && label ? label : slug,
        link: slug === 'index' ? `/${dir}/` : `/${dir}/${slug}`,
        order: typeof data.order === 'number' ? data.order : undefined,
      }
    })
    .sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined && a.order !== b.order) {
        return a.order - b.order
      }
      if ((a.order === undefined) !== (b.order === undefined)) return a.order === undefined ? 1 : -1
      return a.text.localeCompare(b.text)
    })
    .map(({ text, link }) => ({ text, link }))
}

export function sidebar(): Record<string, { text: string; items: { text: string; link: string }[] }[]> {
  return Object.fromEntries(
    SECTIONS.map(({ dir, text }) => [`/${dir}/`, [{ text, items: sectionItems(dir) }]]),
  )
}
