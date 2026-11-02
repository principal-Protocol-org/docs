import { defineConfig } from 'vitepress'

import { SECTIONS, sidebar } from './sidebar'
import { appUrl, docsUrl, siteOrigin } from './site'

const origin = siteOrigin()
const docs = docsUrl(origin)
const app = appUrl(origin)
const description =
  'Documentation for Principal: fixed income for tokenized real-world assets on Stellar.'

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
  srcExclude: ['README.md', 'AGENTS.md', 'CLAUDE.md', '.claude/**'],

  sitemap: { hostname: `${docs}/` },

  // Canonical and Open Graph point to the public origin, never to the *.vercel.app host
  transformPageData(pageData) {
    const canonical = `${docs}/${pageData.relativePath}`
      .replace(/index\.md$/, '')
      .replace(/\.md$/, '')
    const { frontmatter } = pageData
    const isHome = pageData.relativePath === 'index.md'

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
  ],

  themeConfig: {
    nav: [
      ...SECTIONS.map(({ dir, text }) => ({ text, link: `/${dir}/` })),
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
