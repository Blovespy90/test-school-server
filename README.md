# 🚀 Express TypeScript Mongoose Server

Bootstrapped with [**nhb-express**](https://www.npmjs.com/package/nhb-express)

---

## 📦 Features

- ✅ **TypeScript** with `ts-node` and `nodemon` for development and pre-configured `tsconfig.json`
- ✅ **Express.js** pre‑configured with custom middlewares
- ✅ **Zod** for schema validation
- ✅ **Mongoose** for MongoDB integration
- ✅ **Chalk** for colorful logging
- ✅ **[nhb-scripts](https://www.npmjs.com/package/nhb-scripts)** for easy build, commit, module scaffolding, formatting, linting, and more. [see below](#️-scripts)
- ✅ **Scaffolding via CLI** – choose package manager, DB, etc.
- ✅ Built‑in [**CI/CD workflow**](#️-cicd-workflow) for automatic deployment to Vercel
- ✅ Pre‑set configs for ESLint, Prettier, and `nhb-scripts`

---

## 🚀 Development

Install dependencies (already done by `nhb-express` scaffold)

Run in development mode:

```bash
pnpm dev     # or npm run dev / yarn dev
# Runs on port: 4242
```

---

## 📁 Structure

```text
<your-project-name>/
 ├─ .github/
 │   └─ workflows/
 │       └─ publish.yml     # GitHub Actions workflow for CI/CD (vercel deployment) 
 ├─ .vscode/
 │   └─ settings.json       # VS Code Settings for better formatting
 ├─ src/
 │   |─ app/
 │   |   ├─ classes/        # Utility classes e.g. `QueryBuilder`, `ErrorWihStatus`
 │   |   ├─ configs/        # App configurations
 │   |   ├─ constants/      # Constant values
 │   |   ├─ errors/         # Custom error processors/handlers
 │   |   ├─ middlewares/    # Custom Express middlewares
 │   |   ├─ modules/        # Feature modules (controllers, services, etc.)
 │   |   ├─ routes/         # Route definitions
 │   |   ├─ types/          # Types for the App
 │   |   └─ utilities/      # Helper functions
 │   |
 │   ├─ app.ts              # Express app setup
 │   ├─ index.d.ts          # Global type declarations
 │   └─ server.ts           # Server bootstrap
 │
 ├─ .env                    # Environment variables
 ├─ .gitignore              # Ignore files/folders from being pushed/committed
 ├─ .prettierignore         # Ignore files/folders from being formatted with prettier
 ├─ .prettierrc.json        # Prettier config
 ├─ eslint.config.mjs       # ESLint config (flat config, ready for TS)
 ├─ nhb.scripts.config.mjs  # Config for nhb-scripts
 ├─ nodemon.json            # Nodemon settings
 ├─ package.json
 ├─ README.md
 ├─ secret.mjs              # Generate secrets for jwt (using crypto module, just run in cli: node secret.mjs or pnpm/npm/yarn run secret)
 ├─ tsconfig.json           # Ready to use tsconfig
 └─ vercel.json             # Deployment config for Vercel
```

---

## 🛠️ Scripts

- `pnpm dev` – Start in dev mode with hot reload
- `pnpm start` – Run the built server
- `pnpm deploy` – Build the project and deploy to Vercel (`nhb-build && vercel --prod`)
- `pnpm build` – Build the project for production (`nhb-build`)
- `pnpm format` – Format the codebase (`nhb-format`)
- `pnpm lint` – Lint the code (`nhb-lint`)
- `pnpm fix` – Auto‑fix lint issues (`nhb-fix`)
- `pnpm commit` – Guided commit workflow (`nhb-commit`)
- `pnpm count` – Count exports (`nhb-count`)
- `pnpm module` – Scaffold new modules (`nhb-module`)

---

## ⚙️ CI/CD Workflow

A ready‑to‑use **GitHub Actions workflow** is included in:

```text
.github/workflows/publish.yml
```

✅ **What it does:**

- Runs on push to your main branch
- Builds your project
- Deploys automatically to **Vercel** (configured via `vercel.json`)

✅ **How to use:**

1. Push your project to a GitHub repository.
2. Add your Vercel tokens/secrets as GitHub repository secrets:
    Go to `Settings >> Secrets and variables >> Actions >> Repository secrets` and add these variables:
    - `VERCEL_ORG_ID`
    - `VERCEL_PROJECT_ID`
    - `VERCEL_TOKEN`
3. Every time you push to `main` and _version is updated_, GitHub Actions will trigger and deploy your server to Vercel.

You can customize the workflow to fit your own CI/CD needs (e.g., change branches, add tests, deploy elsewhere).

---

Made with ❤️ by [Nazmul Hassan](https://github.com/nazmul-nhb)

**Powered by `nhb-express`** 🚀
