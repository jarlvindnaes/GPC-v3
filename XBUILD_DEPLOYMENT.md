# xBuild Website Deployment Guide

This guide explains how to deploy the Product Connect website to the xBuild website.

## Overview

The app is deployed to: `https://xbuild.com/productconnect-website/`

## Deployment Steps

### 1. Update the Base Path

Before building, update `vite.config.ts` to use the xBuild base path:

```typescript
export default defineConfig({
  base: '/productconnect-website/',  // xBuild deployment path
  // ...
})
```

> **Note:** The default base path is `/GPC-v3/` for GitHub Pages. Change it to `/productconnect-website/` before building for xBuild.

### 2. Build the Application

```bash
cd /Users/johannes/dev/GPC-v3
npm run build
```

This creates a production build in the `dist/` directory with the correct base path (`/productconnect-website/`).

### 3. Copy to xBuild Repository

> **IMPORTANT:** All commands below are scoped to `docs/productconnect-website/` only. Never run `rm -rf` or `cp` targeting the parent `docs/` folder - that would destroy the main xBuild website.

```bash
# Ensure the target folder exists (first-time deploy)
mkdir -p /Users/johannes/dev/xBuild/docs/productconnect-website

# Clear ONLY the productconnect-website folder
rm -rf /Users/johannes/dev/xBuild/docs/productconnect-website/*

# Copy the new build
cp -r dist/* /Users/johannes/dev/xBuild/docs/productconnect-website/
```

### 4. Verify the Deployment

Check that these files exist in `/Users/johannes/dev/xBuild/docs/productconnect-website/`:
- `index.html`
- `404.html`
- `assets/` folder with JS/CSS bundles
- `images/` folder with product screenshots
- `models/` folder with GLB files
- `hdri/` folder with environment maps
- `logos/` folder

### 5. Create Pull Request

```bash
cd /Users/johannes/dev/xBuild

# SAFETY CHECK: verify only productconnect-website files are changed
git status
# You should ONLY see changes under docs/productconnect-website/
# If you see changes to other files, DO NOT proceed - investigate first

# Add ONLY the productconnect-website folder
git add docs/productconnect-website/

# Double-check: review what will be committed
git diff --cached --stat
# Confirm every path starts with docs/productconnect-website/

# Commit the changes
git commit -m "Update productconnect-website with latest changes"

# Push and create PR
git push origin your-branch-name
```

Then create a pull request on GitHub. Verify in the PR diff that only `docs/productconnect-website/` files are included.

## Quick Deployment Script

You can use this one-liner for quick deployments:

```bash
cd /Users/johannes/dev/GPC-v3 && \
npm run build && \
mkdir -p /Users/johannes/dev/xBuild/docs/productconnect-website && \
rm -rf /Users/johannes/dev/xBuild/docs/productconnect-website/* && \
cp -r dist/* /Users/johannes/dev/xBuild/docs/productconnect-website/ && \
echo "Deployment files ready in xBuild repo!"
```

> **Safety note:** The `rm -rf` targets `productconnect-website/*` (contents only). The trailing `/*` ensures only files inside the folder are removed - the folder itself and everything outside it is untouched.

## Configuration

The app is configured for the `/productconnect-website/` path in `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/productconnect-website/',  // xBuild deployment path
  // ...
})
```

## What Gets Deployed

### Static Assets
- HTML, CSS, JavaScript bundles
- Images (product photos, icons, screenshots)
- 3D models (GLB files)

## Testing Locally

To test the production build locally:

```bash
npm run preview
```

This serves the production build at `http://localhost:4173/productconnect-website/`

## Troubleshooting

### Assets not loading
- Verify the `base` path in `vite.config.ts` is `/productconnect-website/`
- Check that all asset references use relative paths or `import.meta.env.BASE_URL`

### Page shows blank
- Check that `index.html` exists
- Verify the base path in the built HTML points to `/productconnect-website/`
- Check browser console for JavaScript errors

### 3D models not loading
- Ensure GLB files are present in the `dist/models/` folder after build
- Check browser console for network errors

## Notes

- The app is a single-page application (SPA)
- All routes are handled client-side via HashRouter
- No server-side rendering or API required
- Works on all modern browsers and mobile devices

## File Structure in xBuild

```
xBuild/docs/productconnect-website/
├── index.html                          # Main HTML file
├── 404.html                            # Fallback page
├── world-map.png                       # Supply chain map background
├── assets/
│   ├── index-[hash].js                 # Main JavaScript bundle
│   ├── three-[hash].js                 # Three.js chunk
│   ├── index-[hash].css                # Styles
│   └── *.png / *.jpg                   # Inlined images
├── images/                             # Product screenshots (phone UI, etc.)
├── logos/                              # Brand logos
├── models/                             # 3D GLB models
├── hdri/                               # HDR environment maps for 3D lighting
└── screenshots/                        # Platform screenshots
```

## Updating the Demo

When you make changes to the app:

1. Make your changes in `/Users/johannes/dev/GPC-v3`
2. Test locally with `npm run dev`
3. Update `vite.config.ts` base path to `/productconnect-website/`
4. Build with `npm run build`
5. Copy to xBuild repo (see step 3 above)
6. Create PR with only the `docs/productconnect-website/` folder
7. Once merged, changes go live at `https://xbuild.com/productconnect-website/`
8. Remember to restore `vite.config.ts` base path to `/GPC-v3/` for GitHub Pages

## Access the Site

After deployment, the site will be available at:

**https://xbuild.com/productconnect-website/**
