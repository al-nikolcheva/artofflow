# Art of Flow — website

A calm, editorial site for **Art of Flow**, London. Plain HTML, one CSS file, a little JavaScript. No build step: it can be hosted anywhere (Netlify, Vercel, GitHub Pages, Cloudflare Pages) or used as the reference to build the same site in Webflow.

## Pages

| Page | File |
|---|---|
| Home | `index.html` |
| What we build | `what-we-build.html` |
| How we work (incl. Care + FAQ) | `how-we-work.html` |
| Work (case study, room for more) | `work.html` |
| Studio | `studio.html` |
| Contact (form + Book a call) | `contact.html` |
| Privacy / Cookies (UK GDPR) | `privacy.html`, `cookies.html` |

Preview: open `index.html`, or run `python3 -m http.server 8000` and visit http://localhost:8000.

## Brand system (`assets/css/styles.css`, top of file)

| Swatch | Hex | Use |
|---|---|---|
| Black | `#111111` | text, headings, footer |
| White | `#FFFFFF` | main background |
| Off-white | `#F7F6F3` | alternate sections |
| Warm stone beige | `#D8D0C4` | the one accent: bands, button hover, thin dividers |
| Light stone | `#EAE5DD` | soft panels, form fields |
| Mid grey | `#7A7A7A` | captions, labels |
| Light grey | `#DADADA` | borders, lines |

Fonts: **Cormorant Garamond** (headlines, Light/Regular) and **Montserrat** (body, labels, nav, buttons in caps with 0.15em spacing). Square buttons that fade to beige, 1 px lines, 01/02/03 numbering, soft opacity fades only.

## Before launch

1. **Images.** Every grey grainy panel marked *Image — …* is a placeholder that says what belongs there. Replace each
   `<figure class="media ratio-… ph …">…</figure>` with
   `<figure class="media ratio-…"><img src="assets/img/name.webp" alt="Short description"></figure>`.
   Black-and-white with grain, WebP, under 400 KB; hero 2400 px wide, others 1600 px; 16:9 wide, 4:5 portrait.
   Your portrait goes on `studio.html`.
2. **Logo.** The wordmark is live text (Montserrat, caps). To use the exported `profile-aof.png`/SVG instead, swap the `.wordmark` link contents.
3. **Contact form.** In `contact.html` replace `REPLACE_WITH_FORM_ENDPOINT` with a Formspree (or Basin) endpoint, then send a test.
4. **Book a call.** Replace `https://cal.com/artofflow/intro` in `contact.html` with your Cal.com or Calendly link.
5. **Legal.** Fill the bracketed parts of `privacy.html` and have it checked.
6. **Analytics.** Prefer a cookie-free tool (Plausible, Fathom). If you use one that sets cookies, load it inside `loadOptional()` in `assets/js/main.js` so it waits for consent.
7. **Domain.** In GoDaddy DNS add the A / CNAME records your host gives you for `artofflow.studio`. **Leave the Microsoft 365 MX (and related TXT/CNAME) records untouched.**
8. **Google Search Console.** Verify the domain and submit the site.

Favicon (`favicon.svg`, `assets/img/favicon-32.png`, `favicon-256.png`) and the social image (`assets/img/social-share.png`, 1200×630) use the AOF mark. Page titles and meta descriptions are set on every page.
