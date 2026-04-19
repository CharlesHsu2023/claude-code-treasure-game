Deploy this project to Vercel by following these steps:

## Step 1 — Ensure vercel.json exists

Create or overwrite `vercel.json` in the project root with this content:

```json
{
  "version": 2,
  "buildCommand": "cd server && npm install && cd .. && npm run build",
  "outputDirectory": "build",
  "rewrites": [
    { "source": "/api/:path*", "destination": "/api/index.js" }
  ]
}
```

Also ensure `api/index.js` exists with this content:

```js
module.exports = require('../server/index.js');
```

## Step 2 — Check / install Vercel CLI

```bash
vercel --version 2>/dev/null || npm install -g vercel
```

## Step 3 — Login (if not already logged in)

```bash
vercel whoami 2>/dev/null || echo "NOT_LOGGED_IN"
```

If the output is `NOT_LOGGED_IN`, tell the user to run `! vercel login` in the terminal so they can authenticate interactively, then wait for them to confirm before continuing.

## Step 4 — Deploy to production

```bash
vercel --prod --yes 2>&1
```

Capture the output and extract the production URL (line aliased to `https://*.vercel.app`).

## Step 5 — Report the result

After the deploy command finishes:
- Show the user the **production URL**.
- Remind them that the **SQLite database resets on every cold start** on Vercel's serverless platform — this is expected behaviour for this demo project.
- If the deploy failed, show the error output and suggest a fix.
