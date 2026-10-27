# unbottle-web

Website for [unbottle.ai](https://unbottle.ai): find the bottleneck. remove it.

unbottle. is an AI consultancy for business owners and operators. We map how work
really moves through a business, find the one constraint that slows everything down,
and build the system that removes it, with numbers to prove it.

## Stack

Plain static site: HTML, CSS and a few lines of vanilla JS. No build step.

```
index.html        the home page
case-studies/     one page per case study, linked from the home page
contact.html      contact form; every "Book an audit" button leads here
api/contact.js    Vercel function that emails form submissions via Resend
vercel.json       Vercel config; serves pages without the .html extension
css/style.css     styles; palette and type live in CSS variables at the top
js/main.js        mobile menu, hero word rotator and footer year (the pages work without it)
images/           logo, mark, favicons and the Open Graph image
docs/             brand book, logo pack and case study sources (git-ignored, not deployed)
```

Fonts (Inter, JetBrains Mono) load from Google Fonts.

## Run locally

```sh
vercel dev
```

Then open http://localhost:3000. Internal links use clean URLs (`/about`, not
`/about.html`), which `vercel.json` maps to the HTML files, so a plain static
server such as `python3 -m http.server` will break the links. `vercel dev` also
runs the contact form function.

## Contact form

`contact.html` posts to `api/contact.js`, which emails each submission
through the [Resend](https://resend.com) HTTP API (no dependencies). Set these
in the Vercel project settings:

- `RESEND_API_KEY` (required)
- `CONTACT_TO`: where submissions go, default `hello@unbottle.ai`
- `CONTACT_FROM`: sender on a domain verified in Resend, default
  `unbottle. website <website@unbottle.ai>`

Replies go straight to the visitor: the email's reply-to is their address.

## Deploy

Hosted on Vercel as a static site: no framework preset, no build command, output
directory is the repo root.

## Brand

Follows the unbottle. Brand Book v2.0:

- Palette: Coral `#E11D48`, Ink `#15161C`, White, Mist `#F6F6F8`,
  Blush `#FECDD3`, Steel `#63646E`, Coral Bright `#FB3F62` (on Ink only).
  Mostly white, ink type, a flash of coral.
- Coral on light, Coral Bright on Ink (dark mode), Ink or White on Coral.
- One coral primary button per view; one coral section per page, max 1080 px
  wide with a 32 px radius.
- The name is always lowercase and always ends with the dot: `unbottle.`
- Hero rotator: "unbottle your ___." holds 2.4 s, rolls 500 ms; reduced motion
  shows "business." static.

The logo and favicon files in `images/` are the official masters from the logo
pack. `logo.svg` / `mark.svg` are for dark backgrounds, `logo-light.svg` /
`mark-light.svg` for light ones.
