# Aryan Jaiswal — Developer Portfolio

A fully responsive, interactive 3D developer portfolio built with HTML, CSS, and vanilla JavaScript, featuring a Three.js animated hero, live coding-platform stats, and scroll-triggered animations.

🔗 **Live Demo:** https://aryan-developer613.github.io/aryan-jaiswal-portfolio/

---

## Features

- **3D animated hero** — rotating wireframe mesh + particle field built with Three.js, reacts to mouse movement
- **Typewriter effect** cycling through roles
- **Scroll-triggered animations** via IntersectionObserver (fade-ins, count-up stats)
- **Live coding stats** — pulled directly from public APIs:
  - GitHub (repos, followers, following)
  - LeetCode (problems solved, difficulty breakdown + donut chart)
  - Codeforces (rating, max rating, rank, recent submissions)
  - Codolio (profile link)
- **3D tilt project cards** with glowing hover borders
- **Animated vertical timeline** for experience
- **Functional contact form** via EmailJS
- **Fully responsive** — 375px to 1440px+
- **Custom cursor**, glassmorphism cards, blueprint-style grid overlay

---

## Tech Stack

- HTML5, CSS3, Vanilla JavaScript (ES6+)
- [Three.js](https://threejs.org/) (r128) via CDN
- [EmailJS](https://www.emailjs.com/) for contact form
- Public REST APIs (GitHub, LeetCode, Codeforces)

---

## File Structure

```
aryan-jaiswal-portfolio/
├── index.html              # Main page
├── style.css                # All styling
├── script.js                # Animations, 3D scene, API calls, form logic
├── Aryan_Jaiswal_Resume.pdf  # Resume (view/download)
├── assets/
│   ├── projects/             # Project screenshots
│   │   ├── railbrainx.jpg
│   │   ├── 360ghar.jpg
│   │   └── ecotrace.jpg
│   └── certs/                 # Certificate PDFs (linked from Certifications cards)
│       ├── Cisco_DataScience.pdf
│       ├── IBM_Python101.pdf
│       ├── HP_AI_Beginners.pdf
│       ├── SIH25_EcoWatchers_Participation.pdf
│       └── BIS_Quiz_2nd_Position.pdf
└── README.md
```

---

## Setup & Deployment

### Run locally
Open `index.html` directly in a browser, or serve it for full API/EmailJS support:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

### Deploy on GitHub Pages
1. Push all files to this repo.
2. Go to **Settings → Pages**.
3. Set source to the `main` branch, root folder.
4. Site will be live at `https://aryan-developer613.github.io/aryan-jaiswal-portfolio/`.

---

## Contact Form Setup (EmailJS)

The contact form sends messages to `aryanjais2024@gmail.com` via EmailJS (free tier).

1. Sign up at [emailjs.com](https://www.emailjs.com/).
2. Create an **Email Service** (e.g. Gmail).
3. Create an **Email Template** with variables: `{{from_name}}`, `{{from_email}}`, `{{message}}`.
4. Open `script.js`, find the `EMAILJS CONFIG` section, and replace:
   - `YOUR_PUBLIC_KEY`
   - `YOUR_SERVICE_ID`
   - `YOUR_TEMPLATE_ID`

Until configured, the form will show a "not yet configured" message instead of sending.

---

## Customization

- **Content**: edit text directly in `index.html` — sections are clearly commented and labeled (`FIG. 01`–`FIG. 08`).
- **Colors/fonts**: edit the `:root` variables at the top of `style.css`.
- **Profile links / project links**: update the `href` attributes in `index.html`.

---

## Author

**Aryan Jaiswal**
B.Tech Mechanical Engineering, NIT Hamirpur
📧 aryanjais2024@gmail.com
📍 Gorakhpur, Uttar Pradesh, India

[LinkedIn](https://linkedin.com/in/aryan-jaiswal2024) · [GitHub](https://github.com/Aryan-developer613) · [LeetCode](https://leetcode.com/u/aryans_logic/) · [Codeforces](https://codeforces.com/profile/aryan2025) · [Codolio](https://codolio.com/profile/aryan2024)
