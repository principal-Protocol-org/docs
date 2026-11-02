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
  // Light unless the visitor chose dark (VitePress's own 'auto' would follow the OS)
  appearance: { initialValue: 'light' },
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
