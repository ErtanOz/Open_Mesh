# OpenMesh - Civic 3D Repository

A lightweight 3D model repository designed for Open Data projects.

## 🚀 Quick Start (Local)

1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Start the development server:
    ```bash
    npm run dev
    ```
3.  Open the browser URL provided by Vite.

## 📦 Deployment to Netlify

This project is configured to be deployed directly to Netlify via GitHub.

### Prerequisite: Database Mode
By default (`USE_REAL_BACKEND = false` in `services/api.ts`), the app uses **IndexedDB**. 
*   **Implication:** Data is stored in the user's browser. If you upload a model on Netlify, *only you* will see it in that browser. Other users will see an empty library.
*   **For a shared library:** You must implement a real backend (e.g., Firebase, Supabase) or run the Node.js server and host it separately.

### Deployment Steps

1.  **Push to GitHub:**
    *   Initialize git: `git init`
    *   Commit all files: `git add . && git commit -m "Initial commit"`
    *   Push to your new GitHub repository.

2.  **Connect to Netlify:**
    *   Log in to [Netlify](https://www.netlify.com/).
    *   Click **"Add new site"** > **"Import an existing project"**.
    *   Select **GitHub** and choose your repository.

3.  **Build Settings:**
    *   Netlify should automatically detect the settings from `package.json`:
        *   **Build command:** `npm run build`
        *   **Publish directory:** `dist`
    *   Click **Deploy**.

## 🛠️ Project Structure

*   `src/pages` - Application routes (Home, Upload, Viewer, etc.)
*   `src/components` - Reusable UI components
*   `src/services` - Data handling (mock DB or API adapter)
*   `src/server` - Reference Node.js backend implementation

## Tech Stack

- React 18 + TypeScript
- Tailwind CSS (via CDN)
- Three.js / React-Three-Fiber
- Vite (Build Tool)
