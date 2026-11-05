# Art of Flow — artofflow.studio

Marketing site for **Art of Flow**, a studio building AI systems around how businesses already work. Calm, structured, monochrome-and-stone — in the spirit of [Vivre](https://vivre.agency).

Static site: plain HTML, one CSS file, a little JavaScript. No build step.

> **Note:** this lives in a subfolder of the `aninthestudios` repo for now because that's the repo this session can push to. It's a separate brand and should get its **own repository and the `artofflow.studio` domain** when ready.

## Pages

| Page | File |
|------|------|
| Home | `index.html` |
| What we build | `what-we-build.html` |
| How we work | `how-we-work.html` |
| Work (case study) | `work.html` |
| About | `about.html` |
| Contact | `contact.html` |
| Privacy & Cookies | `privacy.html` |

## Preview locally

```bash
cd artofflow
python3 -m http.server 8000
# visit http://localhost:8000
```

## Before launch

1. **Contact form** — in `contact.html`, replace `action="REPLACE_WITH_YOUR_FORM_ENDPOINT"` with a Formspree/Basin endpoint pointing to `hello@artofflow.studio`. Until then it falls back to a thank-you message and the email link.
2. **Book a call** — in `contact.html`, replace the `#` on the “Book a call” card (`id="book-call"`) with your Calendly link.
3. **Photography** — every grainy block (`.shot`) is a placeholder. Swap for real grainy black-and-white photos; keep the ratio class on the wrapper.
4. **Privacy & Cookies** — `privacy.html` is a UK placeholder draft. Have a solicitor review it and fill every `[bracketed]` item before publishing.
5. **Domain + favicon** — point `artofflow.studio` at the host; favicon (`favicon.svg`, “AOF” on near-black) is set.

## Brand

- **Colour:** near-black `#161616`, white, warm off-white `#F5F2EC`, warm stone `#DAD4C8`, warm greys. No red, no brown.
- **Type:** Fraunces (serif headlines) + Montserrat (logo, nav, labels). Marks: `ART OF FLOW` / `AOF`.
- **Imagery:** grainy black-and-white only (CSS grain overlay stands in until real photos).

Tokens live at the top of `assets/css/styles.css`.
