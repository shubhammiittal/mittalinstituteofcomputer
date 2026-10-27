# MiC — Mittal Institute of Computer (Modern Website)

A responsive, single-page website redesign with a glassmorphism visual system, dark/light themes, searchable lecture cards and an enquiry form that opens a WhatsApp draft. Built with plain HTML, CSS and JavaScript so it can be uploaded to regular shared hosting/cPanel without a build step.

## Preview locally

Open `index.html` in a browser. For a local server, from this folder run:

```bash
python -m http.server 8080
```

Then visit `http://localhost:8080`.

## Upload to hosting

1. Download and extract `mic-modern-website.zip`.
2. Upload the *contents* of this folder (not the outer folder) to your website's document root, commonly `public_html/`.
3. Confirm `index.html`, `styles.css`, `script.js`, and the `assets/` folder are in that directory.
4. Enable HTTPS on the domain if it is not already enabled.

## Included features

- Responsive desktop, tablet and mobile layouts
- Dark/light theme toggle (remembers the visitor's preference in their browser)
- Mobile navigation
- Searchable, filterable video lecture library
- Real YouTube video links and remote YouTube thumbnails
- Learning path cards, notes/Telegram resources, about section and contact section
- Enquiry form that pre-fills WhatsApp with the visitor's message; it does not silently send anything
- Basic SEO metadata, Open Graph tags, educational-organization JSON-LD and favicon
- Keyboard focus indicators and reduced-motion support

## Before you publish

- Verify that the phone number, email, timings and Udyam reference shown in the page are still correct. They were taken from the existing public website.
- The owner qualification line uses the detail given in the redesign brief (BCA and MCA completed).
- The enquiry form relies on the user's browser opening WhatsApp; it has no server-side lead database or email delivery. A backend/CRM can be added later if required.
- YouTube thumbnails load from `i.ytimg.com`, fonts load from Google Fonts, and the video/platform links open external websites. A connection is required for those remote assets and links.
- Review whether the listed Udyam reference and any statutory language should be displayed exactly as currently registered. This redesign avoids describing Udyam registration as an accreditation.
- The Instagram link in the footer is based on the handle visible on the current public website/video descriptions; verify the destination before launch.

## Main files

- `index.html` — content and page structure
- `styles.css` — themes, glass panels, responsive layout and animations
- `script.js` — theme, navigation, filters and WhatsApp enquiry behaviour
- `assets/favicon.svg` — site icon
