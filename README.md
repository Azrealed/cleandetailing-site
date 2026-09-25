# Clean Detailing — static site (Netlify-ready)

Redesign of [cleandetailing.org](https://cleandetailing.org/) for mobile auto detailing in Redding / Shasta County, CA.

**Stack:** plain HTML, CSS, and a small JS file. No build step. Deploy the contents of this folder as the Netlify publish directory.

## Local preview

From this directory:

```bash
cd /workspace/cleandetailing/site
python3 -m http.server 8765
```

Then open **http://127.0.0.1:8765/** (or `http://localhost:8765/`).

Forms only fully process after deploy to Netlify (or with the Netlify CLI). Locally, submit will 404 unless you mock it.

## Netlify setup

1. Create a new site → connect the repo (or drag-and-drop this `site/` folder).
2. **Publish directory:** this folder (`.` if the repo root *is* `site/`, or `site` if the repo root is the parent).
3. No build command.
4. After first deploy, open **Forms** in the Netlify UI — you should see `newsletter` and `contact`. Enable notifications (email) for submissions.
5. Optional: point the custom domain to Netlify and keep Acuity at `cleandetailing.as.me`.

### Forms

| Form name     | Page        | Fields |
|---------------|-------------|--------|
| `newsletter`  | Home        | email + honeypot |
| `contact`     | Contact     | name, email, phone, message, membership_interest checkbox + honeypot |

Success redirect: `/thanks.html`.

### Acuity booking

Embedded iframe owner **`24860574`**:

`https://app.acuityscheduling.com/schedule.php?owner=24860574`

Pretty URL / CTAs: `https://cleandetailing.as.me/`

Do **not** use the Squarespace demo owner `14537778`.

## Design

- **Accent:** crisp teal `#12B8A6`
- **Surfaces:** near-black `#121416`, white, warm off-white `#F7F5F2`
- **Type:** Fraunces (headings) + Nunito Sans (body) via Google Fonts
- Photos from the live site (optimized under `assets/img/`)

## Contact constants (verified)

- Phone: (530) 339-5877
- Email: clean.detailing.co@gmail.com
- Instagram: https://instagram.com/clean.detailing.co

## What’s intentionally not invented

No street address, business hours, owner bio naming, fake reviews, or membership fee beyond “$8 off every month” + first pick of appointments (per live site / Acuity copy).
