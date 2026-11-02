# Principal Docs

Source of the public documentation of [Principal](https://principalmarket.fi): fixed income for tokenized real-world assets on Stellar. It is a [VitePress](https://vitepress.dev) site (`1.6.4`, pnpm), written for the people who use the app. It runs on Stellar Testnet and says so.

The site is served at `https://principalmarket.fi/docs` (production) and `https://testnet.principalmarket.fi/docs` (testnet). Until the app's Vercel project proxies `/docs` (see [Serving under /docs](#serving-under-docs)), it answers only on its own Vercel domain.

This file is for the maintainers and the writer. It is not part of the site (`README.md`, `AGENTS.md`, `CLAUDE.md` and `.claude/` are in `srcExclude`).

## Sections

| Section (nav) | Directory | What it covers |
| --- | --- | --- |
| Guide | `guide/` | What Principal is, core concepts, strategies, supported assets, risks |
| Using the app | `using-the-app/` | Getting started, markets, trade, liquidity, quick actions, portfolio |
| How it works | `how-it-works/` | Tokenization, yield, pricing and the AMM, maturity, fees, oracle, compliance |
| Technical | `technical/` | Architecture, safety controls, developers (links to GitHub) |

The home page is `index.md`. Diagrams are static SVGs in `public/images/`.

## Writer guide (Pages CMS)

The writer edits every page in a browser, without GitHub, with [Pages CMS](https://pagescms.org).

### Setup (the developer, once)

1. Install the Pages CMS GitHub App on the repository `principal-Protocol-org/docs`.
2. Invite the writer by email in Pages CMS (collaborators). The writer needs no GitHub account.
3. The writer opens `app.pagescms.org`, picks the repository and sees the home page and the four sections, defined in `.pages.yml`.

Each save is a commit by `pages-cms[bot]` on `main`. A push to `main` deploys to production on Vercel.

### Edit a page

Open the section, open the page, edit, save. Fields: `title`, `sidebarTitle` (optional shorter sidebar label), `description` (one or two sentences, used for search engines and link previews), `order` and the page body.

### Add a page

1. Open the section collection the page belongs to (Guide, Using the app, How it works, Technical) and choose to add an entry.
2. Fill in `title` and `description`, set `order` (the position in the sidebar; `1` is first), then write the body.
3. Save. The page appears in the sidebar by itself; nothing else is edited.

When you add a page, Pages CMS shows a filename field, pre-filled from the title (`Fix a yield` gives `fix-a-yield.md`). Keep it as lowercase words joined by hyphens, ending in `.md`. The filename becomes the page's permanent URL (`/docs/<section>/fix-a-yield`), and the editor does not show it again after creation, so check it before the first save. Editing the title later is meant not to rename the file (to confirm on the first use, see [Still to verify](#still-to-verify)). Pages without `order` come after the ordered ones, sorted by title.

### Rename or delete a page

Fix the links first: open every page that links to it and change or remove the link, then save those pages, then rename or delete. A link in a page's body to a page that no longer exists makes the build fail. A failed build is not published, the previous version stays online, and the writer's change waits until the link is fixed. The site never goes down, but nothing new goes live until the link is repaired. Vercel reports the failure to the developer.

Never rename or delete a section's first page (What is Principal, Getting started, Tokenization, Architecture): the navigation bar and the home page link to it. The home page's buttons and cards are not checked by the build: fix their links by hand.

### Images

Upload through the media library. Files go to `public/images/` and are inserted as `/images/<name>`. Prefer SVG or PNG, with alt text.

### Markdown the editor keeps

Use: headings, paragraphs, bold and italic, lists, links, images, inline code, code blocks and tables.

The Title field is the page's heading: the site shows it at the top of the page. Do not start the body with a level-1 heading (`#`); start sections at level 2 (`##`).

Avoid, because the rich-text editor does not keep it or the site does not support it:

- `::: tip` and other `:::` containers (VitePress-only);
- Vue components and `<script>` or `<style>` blocks;
- `{{ ... }}` interpolation (Vue evaluates it);
- raw HTML;
- Mermaid diagrams (draw an SVG and upload it instead).

Link to other pages with absolute paths without the base, for example `/guide/core-concepts` or `/using-the-app/trade`. Do not link to the app from a page: its address differs between the production and Testnet sites. Point readers to the **Launch app** button at the top of the site. The "Launch app" button on the home page and in the nav is added by the site; do not add it in the hero buttons.

### Wording

English. Plain sentences for a non-developer in Guide and Using the app; formulas and contract names belong in How it works and Technical. Describe only what runs today on Testnet. Do not write SCF, grant or audit-process content.

## Local development

Requires Node and pnpm.

```bash
pnpm install
pnpm dev        # http://localhost:5173/docs/
pnpm build      # static build into .vitepress/dist
pnpm preview    # serves the built site
```

`pnpm build` is the correctness check: it fails on a dead internal link.

`pnpm-workspace.yaml` sets `minimumReleaseAge: 20160` (14 days, in minutes): pnpm resolves only versions published at least 14 days ago. A package released more recently is refused until it ages. `allowBuilds: { esbuild: true }` approves esbuild's install script.

## How it is built

- `.vitepress/config.ts`: `base: '/docs/'`, `cleanUrls`, `lastUpdated`, local search, sitemap, canonical and Open Graph tags, the nav, the footer, the "Launch app" button, and a markdown rule that renders each section page's `title` as its H1 (skipped when the body has one).
- `.vitepress/sidebar.ts`: reads each section directory at build time with `gray-matter`. Label: `sidebarTitle`, else `title`. Order: numeric `order` ascending; pages without one come after, by label.
- `.vitepress/site.ts`: the origin per environment.
- `.vitepress/theme/`: the landing's theme (fonts, colours, logo), light by default.
- `.pages.yml`: the Pages CMS configuration (media `public/images` to `/images`; one collection per section; one file entry for the home page).
- `vercel.json`: `outputDirectory: .vitepress/dist`, `cleanUrls`, and the rewrite `/docs/:path*` to `/:path*`, so the site answers both on its own Vercel domain and behind the app's proxy.

### Origin per environment

The docs link to the app on its own domain. `.vitepress/site.ts` picks the origin at build time:

| Build | Origin |
| --- | --- |
| `VERCEL_ENV=production` | `https://principalmarket.fi` |
| anything else (Vercel preview, local) | `https://testnet.principalmarket.fi` |

That origin gives "Launch app" (`<origin>/app`), the canonical links, the sitemap hostname and the `og:image` URL (`<origin>/docs/...`). A Vercel branch URL sits behind Vercel Authentication, so it is never used as an origin. This is the same rule as the app (`org/dapp/lib/app/site.ts`). Check it with `VERCEL_ENV=production pnpm build` against a plain `pnpm build`.

### Serving under /docs

The docs are a Vercel project of their own on `principal-Protocol-org/docs`. To appear at `principalmarket.fi/docs`, the app's Vercel project adds a rewrite `/docs/:path*` to the docs deployment, and the landing's `links.docs` (`org/dapp/lib/content.ts`) points to `/docs`. That change belongs to the dApp and comes later. `principalmarket.fi/docs` proxies to the docs production deployment. What `testnet.principalmarket.fi/docs` proxies to is not decided yet: see [Open decision: the Testnet docs](#open-decision-the-testnet-docs).

## Where the facts come from

The code wins over any document. The pages describe the contracts of `org/principal` at commit `be2a1a5` (the `sourceCommit` of the deployed Testnet manifest) and the dApp's `testnet` branch. Where the protocol documents and the code disagree, the pages follow the code. Every number (fees, limits, contract counts) must trace to the code or the manifest. The wallet is Varial (formerly Freighter).

## Still to verify

Before go-live, the developer checks:

- [ ] Pages CMS: an invited collaborator without a GitHub account can edit and save a page, and the save is a commit by `pages-cms[bot]`.
- [ ] Rich-text round trip: open a page with a table, a code block and an image, save without changes, diff. If any of them changes, switch `body` to a Markdown code field and update this file.
- [ ] A page's filename does not change when its title is edited in Pages CMS.
- [ ] The Vercel project builds and serves `/docs/...` on its own domain.
- [ ] Once `feat/tranche-1-mvp` is merged into `main` in `org/principal`: every GitHub link in the site answers 200 (VitePress checks internal links only).
- [ ] Each figure in the pages is checked against the code (done for the first draft at `be2a1a5`; repeat after protocol changes).
- [ ] Home page round trip: in Pages CMS, save the home page once without changes, then diff (`layout`, hero buttons, feature cards).
- [ ] "Last updated" on the first Vercel build after a few saves: if pages show a wrong date (a shallow clone gives older pages the clone's oldest commit date), set `lastUpdated: false` or make the build fetch the full history.
- [ ] The Testnet docs: choose how `testnet.principalmarket.fi/docs` is built (below).

### Open decision: the Testnet docs

Every writer save is a commit on `main`, and `main` deploys to production with `VERCEL_ENV=production`, so that build's links and tags use `https://principalmarket.fi`. `testnet.principalmarket.fi/docs` needs a deployment built with the Testnet origin that also gets those saves. Nothing provides it yet. Options:

- (a) An origin override in `.vitepress/site.ts`: an environment variable read before `VERCEL_ENV`, set per Vercel environment or branch.
- (b) A branch kept in sync with `main` (for example a fast-forward on every push), built as a preview with the Testnet origin.
- (c) Proxy `testnet.principalmarket.fi/docs` to the production docs, and accept that its **Launch app** goes to `principalmarket.fi/app`.

A Vercel branch preview URL sits behind Vercel Authentication unless a custom domain is attached to the branch, so a proxy to a preview deployment needs that domain first.
