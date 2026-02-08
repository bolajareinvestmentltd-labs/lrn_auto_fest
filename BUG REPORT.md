BUG REPORT — Page Goes White After Loading (Client-Side Crash)

## ✅ STATUS: RESOLVED

**Resolution Date:** Fixed by aliasing client-side React to Next.js's internal compiled React (`next/dist/compiled/react`).

---

Project: Ilorin Automotive Festival 2026
Repo: bolajareinvestmentltd-labs/lrn_auto_fest (branch: main)
Stack: Next.js 14.2.28, React 18.3.1, react-dom 18.3.1, Tailwind CSS 4, TypeScript
OS: Windows 11, Node.js
Dev command: npm run dev (runs on port 3333)

## 🐛 THE BUG (RESOLVED)

The home page at localhost:3333 loads correctly for 2-3 seconds (navbar, hero video, content all visible), then the entire page turns white. No error page shows — just a blank white screen. This was a client-side hydration/runtime crash, not a server error (the HTML arrives fine from the server).

## 🔍 ROOT CAUSE

There was a Windows path casing mismatch. The actual filesystem directory is `lrn_auto_festival` (lowercase), but VS Code opens it as `LRN_AUTO_FESTIVAL` (uppercase). Because of this, webpack was creating duplicate module instances — especially two copies of React — which caused the client-side React tree to crash during or shortly after hydration.

## ✅ THE FIX

**Solution implemented in `next.config.mjs`:**

1. Use `realpathSync.native()` to get the actual filesystem path with correct casing
2. On CLIENT SIDE ONLY, alias React imports to Next.js's internal compiled React:
   - `react` → `next/dist/compiled/react`
   - `react-dom` → `next/dist/compiled/react-dom`
   - `react/jsx-runtime` → `next/dist/compiled/react/jsx-runtime`
   - `scheduler` → `next/dist/compiled/scheduler`

This ensures both server and client use the **same React instance** (Next.js's internal compiled React), eliminating the duplicate React issue.

**Why this works:**

- Next.js's server-side uses `next/dist/compiled/react` which has `React.cache()` and `React.use()`
- By aliasing the client to use the same React, we avoid duplicate instances
- The path casing mismatch no longer matters because both sides resolve to the same physical files

## 📁 FILES MODIFIED

- `next.config.mjs` — Webpack config with client-only React aliases to Next.js compiled React
- `START_DEV.ps1` — Updated startup script that uses `Start-Process` for reliable server

## ⚠️ IMPORTANT CONSTRAINTS THAT WERE FOLLOWED

- ✅ Did NOT refactor logic, structure, or component hierarchy
- ✅ Did NOT alias React on server side (would break `React.cache()`)
- ✅ Kept port at 3333
- ✅ Did NOT change Next.js, React, or react-dom versions
- ✅ Respected ESM module format

## 🚀 HOW TO START THE SERVER

```powershell
# Option 1: Use the startup script
.\START_DEV.ps1

# Option 2: Manual start (run from the lowercase path)
Set-Location "C:\Users\HP-PC\Desktop\lrn_auto_festival"
npm run dev
```

## 🎯 VERIFICATION

- ✅ `npm run dev` starts on port 3333
- ✅ `localhost:3333` loads the home page and stays visible — no white page crash
- ✅ Page returns 200 status with ~46KB of HTML content
- ✅ No `React.use() is not a function` errors
- ✅ No duplicate React instance errors

---

## Original Bug Report (for reference)

<details>
<summary>Click to expand original bug details</summary>

The original issue was a Windows path casing mismatch causing duplicate React instances. The client bundle was loading React from one path (`LRN_AUTO_FESTIVAL/node_modules/react`) while the server used Next.js's internal React from a different resolution. This caused hydration failures with the error `(0 , _react.use) is not a function`.

The fix was to alias client-side React to use Next.js's internal compiled React, ensuring both server and client use the exact same React instance.

</details>
