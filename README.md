# Transitie Roadmap

Roadmap application for Den Haag's circular-economy transition through 2050.

## Local development

Requires Node.js 22 and npm.

```sh
npm ci
npm run dev
```

Run the production checks with:

```sh
npm run lint
npm run build
```

## Deploy to Netlify

The included `netlify.toml` configures the production build (`npm run build`), publish directory (`dist`), Node.js 22, and the single-page app fallback.

1. Push this repository to GitHub.
2. In Netlify, choose **Add new site** → **Import an existing project** and connect the GitHub repository.
3. Keep the detected build settings and deploy.

## Enable Netlify Identity

The app uses Netlify Identity for sign-in. In the Netlify dashboard for
[`cedh.netlify.app`](https://app.netlify.com/sites/cedh/identity), enable
Identity, set registration to **Invite only**, and invite:

- `amelrc@gmail.com`
- `jay@justcommonpeople.com`

The app checks the same two addresses in both the client and the
`/.netlify/functions/roadmap` server endpoint. The server verifies the
Netlify Identity session before reading or writing shared roadmap records in
Netlify Blobs. Roadmap paths, indicators, rules, workstreams, and years are not
embedded in the app bundle or kept in browser local storage. Old `ce-*`
local-storage entries are removed when the authenticated app loads.

The server store starts empty; add the real roadmap data after deployment.
The shared store is a single document, so avoid simultaneous edits: the last
save replaces the shared document. Use Netlify Dev for local development so
the Identity, Functions, and Blobs services are available.

The static app code is still publicly downloadable. Confidential roadmap
records are protected by the server-side email allowlist; do not put secrets
or private records in source code or static assets.

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
