# MatAI

A free, publicly accessible materials-science explorer: search an element or a
small molecule, watch a Bohr model or ball-and-stick structure render, then
ask the built-in AI (powered by Groq's free tier) what it means.

## What's in this folder

- `index.html`, `style.css`, `script.js`, `data.js` — the site itself (no build step)
- `api/chat.js` — a Vercel serverless function that talks to Groq so your API
  key never reaches the browser
- `package.json` — tells Vercel this is a Node/ES-module project

## Deploy it — step by step

### 1. Put this folder on GitHub
1. Create a new repository at github.com/new (public or private, either works).
2. Upload every file in this folder to it — either drag-and-drop on the GitHub
   web UI, or from a terminal:
   ```
   cd matai
   git init
   git add .
   git commit -m "MatAI first version"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/matai.git
   git push -u origin main
   ```

### 2. Import it into Vercel
1. Go to vercel.com and sign in with your GitHub account (free).
2. Click **Add New → Project**, then pick the `matai` repo.
3. Framework preset: leave it as **Other** — no build step is needed.
4. Before clicking Deploy, open **Environment Variables** and add:
   - Name: `GROQ_API_KEY`
   - Value: the key you generated at console.groq.com
5. Click **Deploy**.

### 3. That's it
Vercel gives you a live link like `matai-yourname.vercel.app` — anyone who
opens it can search, view structures, and chat, with no signup and no key of
their own required.

## Extending it later

- Add more elements/molecules in `data.js` — each one is a plain object, no
  special tooling needed.
- Swap the Groq model in `api/chat.js` (the `model:` field) if you want to try
  a different one from console.groq.com/docs/models.
- A custom domain can be attached for free under Vercel's project settings if
  you'd rather have `matai.yourdomain.com` than the default subdomain.

## A note on the free tier

Groq's free tier is rate-limited (roughly 30 requests/minute, ~1,000/day as of
mid-2026 — check console.groq.com for current numbers). Fine for a personal
or small-classroom project; if MatAI gets heavy traffic, Groq's paid tier
removes the ceiling.
