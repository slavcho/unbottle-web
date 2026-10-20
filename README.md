# unbottle-web

Website for [unbottle.ai](https://unbottle.ai): find the bottleneck. remove it.

unbottle. is an AI consultancy for business owners and operators. We map how work
really moves through a business, find the one constraint that slows everything down,
and build the system that removes it, with numbers to prove it.

## Stack

Plain static site: HTML, CSS and a few lines of vanilla JS. No build step.

```
index.html        the single page
css/style.css     styles; palette and type live in CSS variables at the top
js/main.js        mobile menu and footer year (the page works without it)
images/           logo, mark, favicons and the Open Graph image
```

Fonts (Inter, JetBrains Mono) load from Google Fonts.

## Run locally

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Deploy

Hosted on Vercel as a static site: no framework preset, no build command, output
directory is the repo root.

## Brand

Follows the unbottle. Brand Guidelines v1.0 (October 2026):

- Palette: Cobalt `#2427FF`, Release Lime `#DFFF3A`, Ink Navy `#0B0B2A`,
  White, Mist `#F1F1F7`, Steel `#5B5F8A`. Mostly cobalt, accent of lime.
- Lime on dark, cobalt on light. Lime is never used for text on white or Mist.
- The name is always lowercase and always ends with the dot: `unbottle.`
- One brand dot per composition.

The SVG logo files in `images/` are redrawn from the guideline PNGs (Inter
ExtraBold outlines, mark on the 160-unit grid). Replace them with official vector
masters when available.
