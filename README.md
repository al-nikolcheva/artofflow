# AN in the Studios

Website for **AN in the Studios** — a London studio building calm, editorial Instagram presence for interior-design studios.

Built as a fast, no-framework static site: plain HTML, one CSS file, a little JavaScript. It's easy to host anywhere and easy to hand to a builder later. The design follows the brand spec — Cormorant Garamond + Jost, an ivory / espresso / walnut palette, full-bleed imagery and a lot of whitespace.

## Pages

| Page | File | Purpose |
|------|------|---------|
| Home | `index.html` | The trailer — hero, positioning, what I do, selected work, CTA |
| Work | `work.html` | Portfolio grid (placeholders now, real projects later) |
| Case study | `case-study.html` | Reusable project template — copy per project |
| Services | `services.html` | Three tiers (no prices) + how it works |
| About | `about.html` | The story, the belief, a portrait |
| Contact | `contact.html` | The form — the site's main action |
| Privacy | `privacy.html` | Plain-language privacy note (review before launch) |

## Preview locally

No build step. Open `index.html` directly, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Before you launch — the short list

1. **Connect the contact form.** In `contact.html`, replace the form's
   `action="REPLACE_WITH_YOUR_FORM_ENDPOINT"` with a real endpoint from
   [Formspree](https://formspree.io) or [Basin](https://usebasin.com) (both free to start).
   Until that's set, the form shows a local "thank you" confirmation so nothing looks broken.
   Once wired up, submissions post to your inbox.
2. **Swap the placeholder imagery.** Every warm block marked *Placeholder* is a
   `<div class="ph …">`. Replace each with a real `<img>` — warm, natural light, real
   textures (linen, travertine, plaster, brass, oak). Keep the aspect-ratio class
   (`ratio-4x5`, `ratio-3x4`, etc.) on the wrapper or the image.
3. **Set your real details.** Search-and-replace `hello@aninthestudios.com` and confirm
   the Instagram handle `@aninthestudios` everywhere.
4. **Add real project copy.** Duplicate `case-study.html` per project and link each
   `work-card` in `work.html` to it. Fill *The result* with a real number once you have one.
5. **Fill in the portrait** on `about.html`.
6. **Check on mobile**, then connect your domain (e.g. `aninthestudios.com`).

## Design tokens

All colours, fonts and spacing live as CSS variables at the top of
`assets/css/styles.css`:

- **Ivory** `#EDE6D8` (background) · **Espresso** `#221B17` (dark sections/footer)
- **Walnut** `#3A2C24` (body text) · **Taupe** `#8A7A6A` (captions/labels)
- **Stone** `#CDBFAE` (dividers/placeholders) · **Sage** `#7D8170` (rare accent)
- Fonts: Cormorant Garamond (display) + Jost (body/UI), loaded from Google Fonts

## Structure

```
├── index.html  work.html  services.html  about.html  contact.html  privacy.html  case-study.html
├── favicon.svg
└── assets/
    ├── css/styles.css      # design system + all page styles
    ├── js/main.js          # nav scroll state, mobile menu, scroll reveals, form
    └── img/logo-mark.svg   # oval AN monogram
```
