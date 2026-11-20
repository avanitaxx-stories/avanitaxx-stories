AVANITAXX STORIES — PWA + ANDROID APP PREPARATION KIT
====================================================

WHAT THIS KIT CONTAINS
- index.html: your uploaded index (1)(6).html with only the old app-icon link
  replaced by the supplied logo icons and mobile-app metadata added.
- manifest.json: PWA identity, launch URL, display mode, colors, and icons.
- sw.js: service worker. It provides a network-first page load with an offline
  fallback and caches only app identity assets. It does NOT cache Supabase,
  login, API, storage, or story data.
- offline.html: a clear offline notice.
- icons/: app icons made from the logo you supplied.
- android/: Android Trusted Web Activity (TWA) build notes and asset-links template.

IMPORTANT: THIS IS AN INTEGRATION KIT, NOT A SIGNED APK/AAB.
A real Android package can only be built after the PWA files are deployed to
avanitaxxstories.top, the app package ID and signing key are confirmed, and the
Digital Asset Links fingerprint is published.

PART 1 — DEPLOY THE PWA FILES
-----------------------------
1. Back up your current GitHub Pages repository first.
2. In the ROOT of the existing website repository, replace the current
   index.html with this kit's index.html.
3. Copy these files/folders into that SAME repository root:
      manifest.json
      sw.js
      offline.html
      icons/ (the entire folder)
4. Keep every other existing website file and folder. Do NOT delete or replace
   your other HTML pages, policies, images, scripts, or assets.
5. Commit and push to the existing GitHub Pages repository.
6. Wait for GitHub Pages deployment, then confirm these URLs open successfully:
      https://avanitaxxstories.top/manifest.json
      https://avanitaxxstories.top/sw.js
      https://avanitaxxstories.top/offline.html
      https://avanitaxxstories.top/icons/icon-192.png
      https://avanitaxxstories.top/icons/icon-512.png
7. On an Android phone, open https://avanitaxxstories.top/ in Chrome.
   Use Chrome's menu > Install app (or Add to Home screen, depending on Chrome).

PWA / OFFLINE LIMITATION
------------------------
The website uses Supabase for account, story, and community data. This kit does
not cache private account data or story content. Signing in, loading stories,
community features, and syncing require an internet connection. The offline
page only explains that the device is disconnected; it does not claim that
chapters are available offline.

PART 2 — BUILD THE ANDROID APP (TWA)
-----------------------------------
This uses a Trusted Web Activity so the Android app opens the same HTTPS website
in a fullscreen app experience. It avoids making a second copy of your reader
or Supabase integration.

Prerequisites on a development computer:
- Node.js (current LTS)
- Java JDK
- Android SDK / Android Studio tools
- The PWA must already be live and its manifest URL must work over HTTPS.

Suggested Android application ID (must be confirmed before publishing):
    top.avanitaxxstories.app

On the development computer, open Command Prompt / Terminal and run:
    npm install -g @bubblewrap/cli
    bubblewrap init --manifest https://avanitaxxstories.top/manifest.json

During setup, use:
    App name: Avanitaxx Stories
    Package ID: top.avanitaxxstories.app
    Start URL: https://avanitaxxstories.top/?source=pwa
    Theme/background: #24130D

Then build the Android project:
    bubblewrap build

Follow the CLI prompts to configure Android build tools and signing. Keep the
keystore, alias, and passwords private and backed up. Never send the keystore
or passwords in chat or commit them to GitHub. The same signing identity is
needed for future updates to the app.

PART 3 — VERIFY THE WEBSITE / ANDROID APP LINK
----------------------------------------------
A TWA needs Digital Asset Links to prove that the website and Android app are
owned by the same publisher. After the release signing key exists, obtain its
SHA-256 certificate fingerprint using keytool, then create:

    .well-known/assetlinks.json

Use this structure, replacing the fingerprint with the REAL SHA-256 value:

[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "top.avanitaxxstories.app",
      "sha256_cert_fingerprints": [
        "REPLACE_WITH_REAL_SHA256_CERTIFICATE_FINGERPRINT"
      ]
    }
  }
]

Do NOT upload the placeholder fingerprint. It will not verify. The final file
must be publicly reachable at:
    https://avanitaxxstories.top/.well-known/assetlinks.json

If Google Play App Signing is enabled, the Play app-signing certificate
fingerprint may also need to be included, in addition to the upload key's
fingerprint. Use the actual certificate details shown by Play Console.

PRESERVED WEBSITE INTEGRATIONS
------------------------------
The supplied HTML retains its existing Supabase URL/key initialization, auth
persistence, Google sign-in flow, story reader, author tools, and community
code. This kit does not change Supabase tables, policies, keys, OAuth settings,
or database records. Test sign-in, Google sign-in, story loading, chapter
reading, uploads, notifications, and community features after deployment.

If Google sign-in is used, keep the existing Supabase OAuth provider and
redirect configuration. Because the app launches the same website origin, do
not invent a new callback URL. Test the actual sign-in flow on a physical
Android device before distributing the app.

FILES TO UPLOAD TO THE WEBSITE ROOT
-----------------------------------
index.html (replace existing)
manifest.json
sw.js
offline.html
icons/ (entire folder)

Do not upload the android/ notes folder to the public site. Publish
.well-known/assetlinks.json only after it contains the real certificate data.
