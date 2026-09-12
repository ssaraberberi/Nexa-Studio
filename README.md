# Nexa Studio

Marketing site for Nexa Studio — a boutique digital studio founded by Sara, building
websites, storefronts and web apps.

## Running it

No build step. Open `index.html`, or serve the folder:

```bash
npx http-server . -p 8080
```

## Structure

```
index.html          One page: hero, work, method, services, studio, contact
assets/css/site.css All styles, brand tokens at the top of the file
assets/js/site.js   Header state, mobile nav, method accordion, enquiry form
```

## Brand

| Token | Value | Use |
| --- | --- | --- |
| `--ivory` | `#F7F3ED` | Page ground |
| `--espresso` | `#241A15` | Ink, dark sections |
| `--lav` / `--lav-deep` | `#B3A4C7` / `#6E5F84` | Secondary display type, labels |
| `--blue` | `#2438F5` | Accent — kept under 5% of any screen |

Type: **Archivo** (display), **Instrument Sans** (UI and body), **DM Mono** (labels),
loaded from Google Fonts with a system fallback stack.

## Notes

- Project visuals are built in CSS (browser and phone mockups) and scale with container
  queries, so there are no image assets to manage. `.proj-shot` is a `container-type: size`
  element — the artwork inside is sized in `cqw`/`cqh` and fits any card aspect ratio.
- The enquiry form validates in the browser and hands off to the visitor's mail client via
  `mailto:`. Point the form at a real endpoint if you'd rather collect submissions server-side.
- Copy, figures and client names in the work section are the studio's current content; update
  them in `index.html` as projects ship.
