import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Principal',
  titleTemplate: ':title | Principal',
  lang: 'en-US',
  // Served under /docs of the Principal domain via a rewrite
  base: '/docs/',
  cleanUrls: true,
  lastUpdated: true,
  srcExclude: ['README.md', 'AGENTS.md', 'CLAUDE.md', '.claude/**'],

  themeConfig: {
    search: { provider: 'local' },
  },
})
