AVANITAXX STORIES — PWA INSTALLATION FIX
========================================

Upload these files to the ROOT of the existing GitHub repository, preserving folders:

- index.html
- manifest.json
- sw.js
- offline.html
- icons/ (all five PNG files)

Important:
- This package uses the exact index(10).html you supplied, with only PWA-related edits:
  duplicate theme-color metadata removed and service-worker registration explicitly scoped to /.
- The five icons are copied unchanged from your uploaded ZIP.
- The service worker cache version is v2 and precaches shell assets independently.
- Supabase, authentication, storage, realtime, Edge Function/API traffic is not cached by this worker.
- Do not upload the ZIP itself as the website root. Extract it and upload its contents, keeping icons/ as a folder.
- Do not overwrite unrelated website files.

Suggested GitHub commit message:
Fix PWA installation, icons, and resilient service worker caching

After deployment:
1. Open https://avanitaxxstories.top/ in Chrome.
2. Open DevTools > Application > Manifest and check that all three manifest icons load.
3. Open Application > Service Workers and check that /sw.js is activated.
4. Reload the website, then check Chrome's Install app option.
5. Test sign-in, story opening, notifications, and push subscription while online.
6. Test offline by loading a page once, disconnecting, and navigating/reloading.

Note: A successful package build does not itself prove that GitHub Pages has deployed the files.
Live installation must be checked after upload.
