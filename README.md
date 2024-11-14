# Fullstack Notion Clone: Next.js 14, React, Convex, Tailwind

This is a repository for Fullstack Notion Clone: Next.js 14, React, Convex, Tailwind

Key Features:

- Real-time database  🔗
- Notion-style editor 📝
- AI text generation features ✨
- Light and Dark mode 🌓
- Infinite children documents 🌲
- Trash can & soft delete 🗑️
- Authentication 🔐
- File upload ☁️
- File deletion 🗑️
- File replacement 🔧
- Icons for each document (changes in real-time) 🌠
- Expandable sidebar ➡️🔀⬅️
- Full mobile responsiveness 📱
- Publish your note to the web 🌐
- Fully collapsable sidebar ↕️
- Landing page 🛬
- Cover image of each document 🖼️
- Recover deleted files 🔄📄

Try it out from [here](https://jotion-stell.vercel.app)

## Prerequisites

### Node version 23.x.x

## Cloning the repository

```shell
git clone https://github.com/AtelierMizumi/Jotion
```

### Install packages

```shell
npm install
```

### Setup .env file

### You need to create Convex, Clerk and Edge-Store account to get needed keys

### You also need to create a JWT Template in Clerk and update /convex/auth.config.js according to the doc

### You should keep CONVEX_DEPLOYMENT and NEXT_PUBLIC_CONVEX_URL empty

### If you want the AI button feature to be enabled, you must have a valid OpenAPI key

```js
# Read .env.sample.local for instructions
# This will be used for `npx convex dev`
CONVEX_DEPLOYMENT=
CONVEX_DEPLOY_KEY=
NEXT_PUBLIC_CONVEX_URL=

AUTH_DOMAIN=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

EDGE_STORE_ACCESS_KEY=
EDGE_STORE_SECRET_KEY=

OPENAI_API_KEY=
```

### Setup Convex to generate NoSQL schematics

```shell
npx convex dev
```

### Start the app

```shell
npm run dev
```
