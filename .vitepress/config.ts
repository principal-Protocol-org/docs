import { defineConfig } from 'vitepress'

import { SECTIONS, sidebar } from './sidebar'
import { appUrl, docsUrl, siteOrigin } from './site'

const origin = siteOrigin()
const docs = docsUrl(origin)
const app = appUrl(origin)
const description =
  'Documentation for Principal: fixed income for tokenized real-world assets on Stellar.'

// Minimal structural types for the markdown-it core rule below: markdown-it is a transitive
// dependency of vitepress, so its own types are not resolvable here.
interface MdToken {
  type: string
  tag: string
  content: string
  children: MdToken[] | null
}
interface MdCoreState {
  env: { frontmatter?: { title?: unknown }; relativePath?: string }
  tokens: MdToken[]
  Token: new (type: string, tag: string, nesting: -1 | 0 | 1) => MdToken
}

/**
 * Section pages keep their title in frontmatter only (Pages CMS edits it as a field), and VitePress
 * never renders `title` as a heading: synthesize the H1 from it, unless the body already has one.
 */
function titleAsH1(state: MdCoreState): void {
  const path = state.env.relativePath ?? ''
  if (!SECTIONS.some(({ dir }) => path.startsWith(`${dir}/`))) return
  const title = state.env.frontmatter?.title
  if (typeof title !== 'string' || !title) return
  if (state.tokens.some((t) => t.type === 'heading_open' && t.tag === 'h1')) return
  const open = new state.Token('heading_open', 'h1', 1)
  const inline = new state.Token('inline', '', 0)
  const text = new state.Token('text', '', 0)
  text.content = title
  inline.content = title
  inline.children = [text]
  state.tokens.unshift(open, inline, new state.Token('heading_close', 'h1', -1))
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Principal',
  titleTemplate: ':title | Principal',
  description,
  lang: 'en-US',
  // Served under /docs of the Principal domain via a rewrite
  base: '/docs/',
  cleanUrls: true,
  lastUpdated: true,
  // Light unless the visitor chose dark (VitePress's own 'auto' would follow the OS)
  // VitePress 1.6.4 types initialValue as 'dark', but the runtime accepts 'light' (head script: localStorage || initialValue)
  // @ts-expect-error -- see the line above
  appearance: { initialValue: 'light' },
  srcExclude: ['README.md', 'AGENTS.md', 'CLAUDE.md', '.claude/**'],

  markdown: {
    config(md) {
      // Before markdown-it-anchor's core rule, so the H1 gets an id and local search indexes
      // the page title and the paragraphs above the first ## heading
      const rule = (state: unknown) => titleAsH1(state as MdCoreState)
      try {
        md.core.ruler.before('anchor', 'title_as_h1', rule)
      } catch {
        md.core.ruler.push('title_as_h1', rule)
      }
    },
  },

  sitemap: { hostname: `${docs}/` },

  // Canonical and Open Graph point to the public origin, never to the *.vercel.app host
  transformPageData(pageData) {
    const canonical = `${docs}/${pageData.relativePath}`
      .replace(/index\.md$/, '')
      .replace(/\.md$/, '')
    const { frontmatter } = pageData
    const isHome = pageData.relativePath === 'index.md'

    if (isHome) {
      // Home title would otherwise render "Principal | Principal"
      pageData.titleTemplate = false
      pageData.title = 'Principal: fixed income for tokenized real-world assets'
    }

    frontmatter.head ??= []
    frontmatter.head.push(
      ['link', { rel: 'canonical', href: canonical }],
      ['meta', { property: 'og:title', content: isHome ? 'Principal' : frontmatter.title ?? pageData.title }],
      ['meta', { property: 'og:description', content: frontmatter.description ?? description }],
      ['meta', { property: 'og:image', content: `${docs}/og-image.png` }],
      ['meta', { property: 'og:url', content: canonical }],
    )

    // VitePress dev can run this hook again on the same frontmatter object
    if (isHome && Array.isArray(frontmatter.hero?.actions)) {
      const { actions } = frontmatter.hero
      if (!actions.some((action: { link?: string }) => action.link === app)) {
        actions.push({ theme: 'alt', text: 'Launch app ↗', link: app })
      }
    }
  },

  head: [
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'Principal' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/docs/favicon.svg' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&display=swap',
      },
    ],
  ],

  themeConfig: {
    logo: { light: '/logo-light.svg', dark: '/logo-dark.svg', alt: 'Principal' },
    siteTitle: false,

    nav: [
      // activeMatch keeps the section highlighted on every page of it, not only on its first page
      ...SECTIONS.map(({ dir, text }) => ({ text, link: `/${dir}/`, activeMatch: `^/${dir}/` })),
      { text: 'Launch app', link: app },
    ],

    sidebar: sidebar(),

    socialLinks: [{ icon: 'github', link: 'https://github.com/principal-Protocol-org' }],

    search: { provider: 'local' },

    footer: {
      message: 'Principal runs on Stellar Testnet. Nothing in these docs is financial advice.',
      copyright: '© 2026 Principal Protocol',
    },
  },
})
