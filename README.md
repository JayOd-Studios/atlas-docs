# Atlas Docs — sample documentation site

A self-contained sample docs site: a fixed navigation rail with search, three
client-side pages (deploy, install, errors), tabbed package-manager commands,
copyable code blocks, a sticky on-this-page rail, prev/next pagers and a
persisted light/dark theme. It is a **portfolio template** — Atlas is fictional
and no command in it works.

- Sector: Developer documentation / product docs
- Stack: static HTML, CSS and vanilla JS. No build step, no webfonts, no CDN, no search service.
- Run: `python3 -m http.server 3000` in this folder.
- Files: `index.html`, `styles.css`, `main.js`.

## The brand, as written

| Item | Value |
| --- | --- |
| Name | Atlas |
| One-liner | Deploy a build to the region you name, in one command. |
| Audience | Developers evaluating a deployment platform; Node 20+, comfortable in a terminal. |
| Tone | Direct, technical, no marketing adjectives. Short paragraphs, real outputs. |
| Palette (light) | White `#FFFFFF`, ink `#121826`, muted `#5B6675`, indigo `#4F46E5` |
| Palette (dark) | Ink `#0A0E15`, raised `#101722`, indigo-light `#A5B4FC` |
| Type | System sans, 15.5px/1.7; monospace for code, labels and versions |
| Measure | 760px body column, 68ch paragraphs |

### Screen inventory

1. **Top bar** — brand with "Docs" tag, Guides / API / Changelog, version pill, theme toggle, dashboard link.
2. **Sidebar** — search, grouped navigation (Getting started, Guides, API reference, More), status line.
3. **Deploy guide** — lead, prerequisites, three numbered steps, flag table, verification output, pager, helpful vote.
4. **Install guide** — npm / pnpm / bun tabs, requirements table, verify, troubleshooting note.
5. **Errors reference** — JSON error body, code table, CLI exit codes, retry guidance.
6. **On this page** — sticky rail that belongs to each article.
7. **Theme** — light and dark, set before first paint, remembered in `localStorage`.

### Sample content

- CLI: `atlas login`, `atlas deploy --region "eu-west" --prod`, `atlas deploys list --limit 3`.
- Flags: `--region`, `--prod`, `--dry-run`, `--env`.
- Errors: `ATL-401` auth, `ATL-409` deploy in progress, `ATL-422` missing build output, `ATL-429` rate limit, `ATL-503` region unavailable.
- Exit codes: 0 success, 1 build failed, 2 invalid flags, 3 auth failure.

## What to show it for

Pitch this at developer-tool companies and anyone with an API: it demonstrates
information architecture, code blocks that are actually readable in both themes,
a search that narrows without JavaScript frameworks, sensible error
documentation, and an accessibility pass (skip link, labelled search, focus
styles, reduced motion).

## Make it yours

- Pages: each `<article data-article="...">` is a page; add a matching sidebar link with `data-page`, a title in the `titles` map, and the id to `order` in `main.js`.
- Search: it currently matches sidebar link text. For real search, index headings and body copy, or point it at Algolia/Pagefind and keep the same input.
- Code: the `.tok-*` classes are manual syntax colours; no highlighting library ships here.
- Brand: the indigo `--accent`, the `<title>`, the version pill and the footer disclosure.

## Limits

Three pages, no versioned content, no MDX, no generated API reference, no
analytics and no backend search. The theme choice persists in `localStorage`;
everything else resets on reload.
