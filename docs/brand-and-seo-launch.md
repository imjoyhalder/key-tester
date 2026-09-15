# KeyTester.io: brand and search launch plan

## Brand assets

- `apps/web/public/logo.svg`: scalable master mark, a compact keyboard with a highlighted key and spacebar.
- `apps/web/public/logo-512.png`: square marketplace/profile image.
- `apps/web/public/og-image.png`: 1200 × 630 social-sharing card.
- `apps/web/app/icon.png` and `apple-icon.png`: matching browser and Apple icons.
- Navy #172554, sky blue #38bdf8, system sans-serif wordmark.
- Preserve clear space around the mark; use the standalone mark at small sizes.
- Regenerate PNG files with `node scripts/generate-brand-assets.cjs` from the repository root.

## Before public launch

1. Deploy this branch after review. Set NEXT_PUBLIC_APP_URL to https://key-tester-web.vercel.app (the current production domain). Redirect other domain variants to it.
2. Verify domain ownership in Google Search Console. Submit /sitemap.xml and inspect the homepage URL. These account actions have not been performed here.
3. Check the deployed page, robots.txt, sitemap.xml, icons, canonical URL, and social card. Test structured data with Google's Rich Results Test; eligibility does not guarantee a special result.
4. Measure real mobile performance and Core Web Vitals after deployment. Avoid adding heavy advertising above the tester.
5. Verify behavior on physical Windows, macOS, and regional keyboards. The current diagram uses US QWERTY labels; do not advertise translated layouts or hardware latency measurement until those features are implemented and validated.

## First 30 days: useful content and discovery

- Improve the existing troubleshooting, ghosting, and rollover articles with original screenshots, reproducible steps, actual hardware examples, and accurate limits of browser testing.
- The latency article now distinguishes key-hold duration from hardware latency. Keep future diagnostic claims equally precise.
- Make a short demo showing a normal key, a missed key, and how to rule out a browser shortcut. Share it on relevant keyboard communities where their rules allow it.
- Offer the free tester to keyboard reviewers, repair shops, and educators as a helpful reference. Seek earned mentions; avoid paid link schemes and mass posting.
- Publish a marketplace listing using the new icon and social card. Describe only working features, with a direct link to the test.

## Days 30–90: use evidence to expand

- Review Search Console queries, impressions, clicks, click-through rate, country, and device every week. Compare rolling 28-day periods.
- Choose new guides from real questions users ask, rather than generating many near-identical keyword pages.
- Prioritize translations using country/query demand. Have a fluent speaker review the UI and guides. Give each translation a real URL, self-canonical, correct HTML language, and reciprocal hreflang references. Do not add hreflang for translations that do not exist.
- Track whether visitors successfully start and complete a test, without collecting the contents of their typing. Review analytics and consent requirements before expanding tracking.

## Expectations

No implementation can guarantee first position in Google. Technical SEO helps discovery and understanding; sustained growth also requires useful original content, a reliable product, and trusted mentions. Measure progress over months and improve based on evidence.

## Primary references

- Google SEO Starter Guide: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Google Search Essentials: https://developers.google.com/search/docs/essentials
- International sites: https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites


