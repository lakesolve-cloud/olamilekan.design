# Olamilekan.design

Portfolio site for Olamilekan Muhammed. Plain HTML and CSS: no build step, no dependencies.

## Structure

```
index.html      Homepage
cosub.html      Cosub case study
spendit.html    Spendit case study
matryvo.html    Matryvo case study
case.css        Shared styles for the case study pages
assets/         Images and CV
favicon.svg     Browser tab icon
og-image.png    Preview image for links shared on LinkedIn, X, WhatsApp
vercel.json     Clean URLs (/cosub instead of /cosub.html) and image caching
```

## Preview locally

```
python3 -m http.server 4173
```

Then open http://localhost:4173

## Deploy on Vercel

**Option A: GitHub (recommended, redeploys on every push)**
1. Create a new GitHub repo and push this folder to it.
2. On vercel.com, click **Add New → Project** and import the repo.
3. Framework preset: **Other**. Leave the build command empty. Output directory: `.` (root).
4. Click **Deploy**.

**Option B: Vercel CLI**
```
npx vercel
```
Run it inside this folder and follow the prompts. Use `npx vercel --prod` to publish to production.

## After the first deploy


(for example `olamilekan.vercel.app` or a custom domain), replace `/og-image.png` in the
`og:image` and `twitter:image` tags of each HTML file with `https://YOUR-DOMAIN/og-image.png`.

## Updating content

- Project cards and the experience timeline are in `index.html`.
- Each case study is its own HTML file and uses `case.css`.
- Put new images in `assets/` and reference them as `assets/your-image.png`.
