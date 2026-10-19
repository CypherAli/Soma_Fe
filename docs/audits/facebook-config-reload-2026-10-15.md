# Facebook configuration reload — 2026-10-15

The Facebook link was disabled because the running backend reported oauth.facebook=false, although soma_be/.env contained both Facebook configuration keys. No secret values were printed or changed.

Restarted the confirmed Soma backend process (node dist/src/main.js) to reload the environment. Afterwards GET /api/auth/capabilities returned Google, GitHub and Facebook enabled; GET /api/health returned status=ok and db=up.

Reloaded the login page and verified Facebook has aria-disabled=false and the /api/auth/oauth/facebook target. Clicking it opened the actual Facebook login page with the configured callback /api/auth/oauth/facebook/callback. Screenshot: facebook-signin-2026-10-15.png.

No Facebook credentials were entered and no provider consent was granted. The callback/token exchange after an actual Facebook login remains unverified. No application source or database schema changes were needed.
