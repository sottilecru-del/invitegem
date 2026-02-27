# Pedro & Júlia Wedding Invitation

An elegant, interactive wedding invitation featuring a wax seal opening animation, event details, and a functional RSVP system.

## 🚀 Deployment Instructions

### 1. Deploying to Vercel (Recommended)

Vercel is the easiest way to host this application.

1.  **Push your code to GitHub.**
2.  **Import the project to Vercel.**
3.  **Configure Environment Variables:**
    -   `NODE_ENV`: `production`
4.  **Build Settings:**
    -   Framework Preset: `Vite`
    -   Build Command: `npm run build`
    -   Output Directory: `dist`
5.  **Note on Database:** Since Vercel is serverless, the SQLite database (`rsvps.db`) will reset on every deploy. For a persistent database on Vercel, consider using a managed database like Vercel Postgres or a service like Supabase.

### 2. Deploying to Shared Hosting (CPanel / FTP)

If your shared hosting supports Node.js:

1.  **Build the project locally:**
    ```bash
    npm run build
    ```
2.  **Upload the following to your server:**
    -   The `dist` folder (contains the static assets)
    -   `server.ts` (or the compiled version if you prefer)
    -   `package.json`
3.  **Install dependencies on the server:**
    ```bash
    npm install --production
    ```
4.  **Start the server:**
    ```bash
    npm start
    ```

If your shared hosting is **Static Only** (no Node.js):

1.  **Build the project locally:**
    ```bash
    npm run build
    ```
2.  **Upload the contents of the `dist` folder** to your public HTML directory.
3.  **Note:** The RSVP form requires a backend. If you use static hosting, the RSVP form will not work unless you point it to an external API or use a service like Formspree.

## 🔗 Live URLs

- **Development Preview:** [https://ais-dev-pgojximnmd55tflfbxdynn-7475252608.asia-east1.run.app](https://ais-dev-pgojximnmd55tflfbxdynn-7475252608.asia-east1.run.app)
- **Shared Invitation:** [https://ais-pre-pgojximnmd55tflfbxdynn-7475252608.asia-east1.run.app](https://ais-pre-pgojximnmd55tflfbxdynn-7475252608.asia-east1.run.app)

## 🛠️ Tech Stack

- **Frontend:** React, Tailwind CSS, Framer Motion, Lucide Icons
- **Backend:** Express, SQLite (better-sqlite3)
- **Build Tool:** Vite
