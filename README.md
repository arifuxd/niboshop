# Niboshop Frontend

This Next.js app uses **pnpm**. The supported lockfile is `pnpm-lock.yaml`; do not run `npm install` in this directory.

## Install and run

```bash
corepack pnpm install --frozen-lockfile
corepack pnpm dev
```

Corepack reads the `packageManager` field in `package.json` and runs the pinned pnpm version. If you prefer the short `pnpm` command, run `corepack enable` once, open a new terminal, then use `pnpm install --frozen-lockfile` and `pnpm dev`.

Set `NIBOSHOP_API_URL` in `.env.local` if the Laravel API is not at the default `http://127.0.0.1:8000/api`; see `.env.example`.
