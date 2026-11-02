@AGENTS.md

# CLAUDE.md

Project notes for Claude Code (claude.ai/code). The workspace rules are in the block of `AGENTS.md`; do not edit it.

## What this is

Public user documentation of Principal (fixed income for tokenized real-world assets on Stellar, Testnet), built with VitePress `1.6.4` and pnpm. Four sections: `guide/`, `using-the-app/`, `how-it-works/`, `technical/`, plus the home `index.md`. A writer edits it through Pages CMS (`.pages.yml`); saves are commits on `main` and deploy. Spec: `../../.rness/specs/0003-public-docs-site.md`; state: `../../.rness/docs/docs-site.md`. `README.md` has the writer guide and the To-verify list.

## Commands

```bash
pnpm install
pnpm dev        # http://localhost:5173/docs/
pnpm build      # static build into .vitepress/dist; fails on a dead internal link
pnpm preview
```

No tests or linter. `pnpm build` is the check. After a build: `.vitepress/dist` must hold no `AGENTS.html`, `CLAUDE.html`, `README.html`, and `grep -rli 'tranche\|scf\|grant' .vitepress/dist` must find nothing. `pnpm-workspace.yaml` has `minimumReleaseAge` of 14 days: do not add a dependency released in the last 14 days.

## Structure

```
.vitepress/config.ts    site config: base /docs/, nav from SECTIONS, SEO tags, Launch app button, title as H1
.vitepress/sidebar.ts   SECTIONS and sidebar(), read from the files with gray-matter
.vitepress/site.ts      origin per environment (siteOrigin, docsUrl, appUrl)
.vitepress/theme/       the landing's theme: fonts, colours, light by default; app-link.ts (Launch app on the reading domain)
.pages.yml              Pages CMS: media public/images -> /images, one collection per section, home file
public/                 logos, favicon, og-image.png, images/*.svg (diagrams)
vercel.json             outputDirectory, cleanUrls, /docs/:path* rewrite
```

`srcExclude` keeps `README.md`, `AGENTS.md`, `CLAUDE.md` and `.claude/**` out of the build. The agent files are versioned. The repository is public (Vercel blocks pushes to a private repository by authors outside the Vercel team, `pages-cms[bot]` included): never commit a secret, a key or a grant detail.

## Rules

**Sidebar and frontmatter.** Every page in a section has `title`, `description` (required; meta description and `og:description`) and a numeric `order`; `sidebarTitle` is optional. The sidebar reads the files at build time, so a new page needs no change in `config.ts`. A section directory must exist (the sidebar throws on a missing one). Adding a section means: a directory, an entry in `SECTIONS` (`sidebar.ts`) and a collection in `.pages.yml`. Every frontmatter key must be one that `.pages.yml` declares for that file: Pages CMS rewrites the frontmatter from its schema on save and drops any other key. The `title` is the page's heading: `config.ts` renders it as the H1 of every section page, so a body never starts with a level-1 heading (`#`).

**Pages CMS constraints.** The rich-text editor keeps headings, paragraphs, lists, links, images, inline code, code blocks and tables. Pages must not use `:::` containers, Vue components, `{{ }}`, raw HTML or Mermaid. Home keys are only those `.pages.yml` declares: `layout`, `hero` (name, text, tagline, actions), `features` (title, details, link), `body`. Filenames come from the title at creation; never rename a file without fixing the links to it first. No "Edit this page" link: readers are app users, and the writer edits in Pages CMS.

**Origin helper.** `siteOrigin()` returns `https://principalmarket.fi` when `VERCEL_ENV === 'production'`, else `https://testnet.principalmarket.fi`. It feeds "Launch app" (`<origin>/app`), canonical links, sitemap hostname and `og:image`. Never hard-code an origin in `config.ts` or a page, and never use a `*.vercel.app` host. Both landings (`principalmarket.fi`, `testnet.principalmarket.fi`) proxy `/docs` to the one production build (`principalmarket-docs.vercel.app`, rewrite in `org/dapp/next.config.ts`), so in the browser `.vitepress/theme/app-link.ts` (mounted by the `Layout` wrapper in `theme/index.ts`) points "Launch app" to `/app` of the domain the page is read on, for `principalmarket.fi` and its subdomains only. The home page's hero must not declare "Launch app": `transformPageData` appends it once. It also sets the hero image (the landing's split coin, `public/hero-coin-light.svg` and `hero-coin-dark.svg`), so `index.md` never declares `hero.image`.

**Sources rule.** The code wins over every document. Facts come from `org/principal` at `be2a1a5` and from `org/dapp` on its `testnet` branch (and `config/manifests/testnet.json`), not from the mdBook, README or older docs, which are wrong in places (see `../../.rness/docs/docs-site.md`). Describe only what runs today on Testnet; leave out the held wizard screens. The wallet is Varial (formerly Freighter). No SCF, tranche, grant, audit-process or deployment-evidence content; no grant amounts.

**GitHub links** point to `https://github.com/principal-Protocol-org/principal/blob/main/...`. Some files exist only on `feat/tranche-1-mvp` until it is merged, so they answer 404 until then.

**Commits.** Author and committer are `remyghislain <cedric+1@smartt.dev>`, with no `Co-Authored-By:` or `Claude-Session:` trailer.

**Diagrams** are static SVG in `public/images/`, in the brand colours, readable at 12 px or more. Mermaid is not used.
