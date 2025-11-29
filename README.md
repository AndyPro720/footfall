# Foottfall - Phase 1 MVP

This is the codebase for the Foottfall commercial real estate platform. It is built using **Vite** and **Vanilla JavaScript**.

## 📂 Directory Structure

```
footfall/
├── public/              # Static assets (images, icons, manifest)
│   ├── logo.jpg         # The company logo
│   └── ...
├── src/                 # Source code
│   ├── components/      # Reusable UI parts
│   │   └── navbar.js    # The top navigation bar & hidden menu logic
│   ├── pages/           # The content for each page
│   │   ├── home.js      # Landing page
│   │   ├── intelligence.js # Map application container
│   │   ├── about.js     # Company info
│   │   ├── services.js  # Service listings
│   │   └── contact.js   # Contact form
│   ├── styles/          # CSS Styles
│   │   ├── global.css   # Fonts, resets, base styles
│   │   ├── variables.css# Colors (Dark theme), spacing, fonts
│   │   └── components.css # Specific styles for Nav, Hero, etc.
│   ├── main.js          # The entry point (starts the app)
│   └── router.js        # Handles navigation (see below)
├── index.html           # The main HTML file that loads the app
├── package.json         # List of installed tools (leaflet, vite, etc.)
└── vite.config.js       # Configuration for the build tool & PWA
```

## 🧠 Key Files Explained

### `src/router.js` (The Client-Side Router)
**What it does:**
In a traditional website, clicking a link loads a completely new HTML file from the server. This causes the screen to flash white and re-download everything (navigation, styles, scripts).

**Our Router:**
1.  **Intercepts Clicks**: When you click a link (like "About"), the router stops the browser from reloading.
2.  **Swaps Content**: It looks at the URL, finds the matching "Page" component (e.g., `About.render()`), and swaps *only* the middle part of the screen.
3.  **Keeps State**: The Navbar stays loaded. The Map (in the future) can stay loaded in memory.
4.  **Smooth**: It feels like a native app, not a website.

### `src/main.js`
This is the "Brain" of the application. It:
1.  Imports all the CSS styles.
2.  Imports the Router and Page components.
3.  Tells the Router which URL goes to which Page.
4.  Starts the app when the page loads.

### `src/pages/intelligence.js`
This is where the Map lives. Currently, it initializes a **Leaflet** map centered on India. In Phase 2, this is where we will connect to the real-time data API.

### `vite.config.js`
This file configures the **Build Tool**. It tells Vite how to:
1.  Bundle all the files together.
2.  Generate the **PWA** (Progressive Web App) files so the site can work offline and be installed on a phone.
