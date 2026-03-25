# Example App for `@capgo/capacitor-contentsquare`

This Vite project links directly to the local plugin source so you can validate the main Contentsquare flows on web, iOS, and Android while developing.

## Getting started

```bash
bun install
bun run start
```

To test on native shells:

```bash
bunx cap add ios
bunx cap add android
bunx cap sync
```

On native shells, use the sample buttons to opt in, send a screenview, send a transaction, and send a dynamic variable while checking the native logs and the Contentsquare dashboard.
