# Art of Flow — website

**What's live right now:** a single coming-soon page (`index.html`).
**The full site** (Home, What we build, How we work, Work, Studio, Contact, Privacy, Cookies) is kept ready in `full-site/`. It is not published: `.vercelignore` keeps that folder out of the live site.

Plain HTML and CSS, no build step.

## Going live with the full site later

Move the contents of `full-site/` to the top level (replacing the coming-soon `index.html` and `assets/`), remove `full-site` from `.vercelignore`, commit and push. Vercel redeploys automatically. Before that, finish the launch list in the next section.

## Full-site launch list

1. Swap every grey *Image — …* placeholder for a black-and-white photo (WebP, under 400 KB; 2400 px hero, 1600 px others; 16:9 wide, 4:5 portrait). Portrait goes on `studio.html`.
2. `contact.html`: replace `REPLACE_WITH_FORM_ENDPOINT` with a Formspree endpoint and test it; replace the Cal.com link with yours.
3. `privacy.html`: fill the [bracketed] parts and have it checked.
4. Analytics: prefer a cookie-free tool. If it uses cookies, load it inside `loadOptional()` in `assets/js/main.js`.

## Vercel + GitHub + GoDaddy

### 1. Connect GitHub to Vercel
1. Sign up at vercel.com with **Continue with GitHub**.
2. **Add New → Project →** import `al-nikolcheva/artofflow` (allow Vercel access to the repo if asked).
3. Framework preset: **Other**. Leave build command and output directory empty. **Deploy**.
4. **Settings → Git → Production Branch:** set it to the branch that holds this site (currently `claude/elegant-keller-vmo5xc`, or `main` once it is merged there).

Every push to that branch now updates the live site within a minute.

### 2. Add the domain in Vercel
**Settings → Domains →** add `artofflow.studio` and `www.artofflow.studio` (let Vercel redirect one to the other). Vercel then shows the exact DNS records to add. Use the values it shows you.

### 3. Point GoDaddy at Vercel
GoDaddy → **My Products → artofflow.studio → DNS**:

| Type | Name | Value |
|---|---|---|
| A | `@` | the IP Vercel shows (often `76.76.21.21`) |
| CNAME | `www` | the target Vercel shows (often `cname.vercel-dns.com`) |

- Edit the existing `@` A record (GoDaddy's "Parked" one) and the existing `www` CNAME rather than adding duplicates. Delete any GoDaddy **Forwarding** on the domain.
- **Do not touch the Microsoft 365 records:** MX, `autodiscover` CNAME, and the TXT records (`MS=…`, `v=spf1…`). Email keeps working.
- Changes usually work within an hour (up to 48 h). Vercel shows a green tick and adds HTTPS automatically.

### 4. Afterwards
Add the domain to Google Search Console (Domain property, verified with a TXT record in GoDaddy).
