Deploy this project's frontend to GitHub Pages by following these steps:

> **Note:** GitHub Pages hosts only **static files**. The Express/SQLite backend will NOT run — API calls (login, scores) will fail. The game UI and animations will be fully visible, but auth-gated features won't work.

---

## Step 1 — Check prerequisites

Run these checks in parallel:

```bash
git --version 2>/dev/null || echo "NO_GIT"
gh --version 2>/dev/null || echo "NO_GH"
```

- If `NO_GIT`: tell the user to install Git from https://git-scm.com and retry.
- If `NO_GH`: tell the user to install GitHub CLI from https://cli.github.com and retry.

---

## Step 2 — Check GitHub auth

```bash
gh auth status 2>&1
```

If not logged in, tell the user to run `! gh auth login` in the terminal and complete the interactive login, then confirm before continuing.

---

## Step 3 — Initialize git repo (if needed)

```bash
git rev-parse --is-inside-work-tree 2>/dev/null || echo "NOT_A_REPO"
```

If `NOT_A_REPO`:
```bash
git init
git add .
git commit -m "Initial commit"
```

---

## Step 4 — Determine repo name

Ask the user: "What would you like to name the GitHub repository? (default: `claude-code-treasure-game`)"

If they don't reply with a name, use `claude-code-treasure-game`.

Store the chosen name as REPO_NAME.

---

## Step 5 — Create GitHub repo (if it doesn't already exist)

```bash
gh repo view ischar2007/REPO_NAME 2>/dev/null && echo "REPO_EXISTS" || echo "REPO_NOT_FOUND"
```

Replace REPO_NAME with the actual value from Step 4.

If `REPO_NOT_FOUND`:
```bash
gh repo create REPO_NAME --public --source=. --remote=origin --push
```

If `REPO_EXISTS`:
```bash
git remote get-url origin 2>/dev/null || git remote add origin https://github.com/ischar2007/REPO_NAME.git
git push -u origin main 2>/dev/null || git push -u origin master 2>/dev/null || true
```

---

## Step 6 — Set the Vite base path for GitHub Pages

GitHub Pages serves the site at `https://ischar2007.github.io/REPO_NAME/`, so Vite must use that sub-path as the base.

Edit `vite.config.ts`: inside the `build:` block (after `outDir: 'build'`), add `base: '/REPO_NAME/'` at the **top-level** of the `defineConfig` object (alongside `plugins`, `resolve`, `build`, `server`).

The relevant section should look like this after the edit (replace REPO_NAME with actual value):

```ts
export default defineConfig({
  base: '/REPO_NAME/',
  plugins: [react()],
  // ... rest unchanged
```

---

## Step 7 — Install dependencies and build

```bash
npm install
npm run build
```

If the build fails, show the error and stop.

---

## Step 8 — Push the build folder to gh-pages branch

```bash
git checkout --orphan gh-pages 2>/dev/null || git checkout gh-pages
git rm -rf . --quiet
cp -r build/. .
rm -rf build src server public node_modules .claude 2>/dev/null || true
git add -A
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages --force
git checkout main 2>/dev/null || git checkout master
```

If the checkout back to main/master fails, remind the user to run `git checkout main` manually.

---

## Step 9 — Restore vite.config.ts base (revert for local dev)

After the gh-pages branch is pushed and you are back on main/master, revert the `base` line added in Step 6 so local dev still works:

Remove the `base: '/REPO_NAME/',` line from `vite.config.ts`.

Then commit the restored config:
```bash
git add vite.config.ts
git commit -m "Restore vite base for local dev after GitHub Pages deploy"
git push origin main 2>/dev/null || git push origin master 2>/dev/null || true
```

---

## Step 10 — Enable GitHub Pages via API

```bash
gh api repos/ischar2007/REPO_NAME/pages \
  --method POST \
  -f source[branch]=gh-pages \
  -f source[path]=/ 2>&1 || echo "PAGES_ALREADY_ENABLED"
```

---

## Step 11 — Report the result

Show the user:

- **GitHub Pages URL:** `https://ischar2007.github.io/REPO_NAME/`
- Tell them it may take **1–2 minutes** for the page to go live after the first deploy.
- Remind them that the **backend (login/scores) is not available** on GitHub Pages — only the frontend UI is hosted.
- To check deploy status: `gh api repos/ischar2007/REPO_NAME/pages`
