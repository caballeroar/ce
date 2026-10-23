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

Path, indicator, and rule data are currently stored in the visitor's browser using local storage. No server-side database is configured.
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
