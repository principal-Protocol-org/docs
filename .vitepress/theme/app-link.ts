import { appUrl, PRODUCTION_ORIGIN, TESTNET_ORIGIN } from '../site'

/** The "Launch app" URLs a build can contain (config.ts writes `appUrl(siteOrigin())`). */
const BUILT_APP_LINKS = [PRODUCTION_ORIGIN, TESTNET_ORIGIN].map(appUrl)
const APP_DOMAIN = new URL(PRODUCTION_ORIGIN).hostname
const SELECTOR = BUILT_APP_LINKS.map((url) => `a[href="${url}"]`).join(',')

/**
 * Both landings (principalmarket.fi and testnet.principalmarket.fi) proxy /docs to the same
 * production build, so "Launch app" is pointed at /app of the domain the page is read on.
 * Elsewhere (the docs' own Vercel host, local) the built link stays.
 */
export function sameDomainAppLinks(): void {
  const { hostname, origin } = window.location
  if (hostname !== APP_DOMAIN && !hostname.endsWith(`.${APP_DOMAIN}`)) return
  const target = appUrl(origin)
  const update = () => {
    for (const link of document.querySelectorAll<HTMLAnchorElement>(SELECTOR)) {
      if (link.getAttribute('href') !== target) link.setAttribute('href', target)
    }
  }
  update()
  // The mobile menu and route changes mount new links
  new MutationObserver(update).observe(document.body, { childList: true, subtree: true })
}
