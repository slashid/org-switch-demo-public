# /id Notes

A web app that demonstrates SlashID suborganizations and organization switching.

Uses [React](https://react.dev/), [Vite](https://vitejs.dev/), [Node](https://nodejs.org/en), [Fastify](https://fastify.dev/), and [openapi-typescript-codegen](https://www.npmjs.com/package/openapi-typescript-codegen).

## Read the guide
This repo is a barebones reproduction of the [/id Notes](https://slashid-notes.onrender.com/) full-stack multi-tenant example app with organization switching.

The code here acts as a reference for the guide:  
  
[How to Build a Multi-Tenant App with Organization Switching using React, Fastify and SlashID](https://developer.slashid.dev/docs/guides/suborgs/org-switching-example)

## Using this repo

### Set environment variables
```
mv .env.example .env
```
- `VITE_ROOT_ORG_ID` is your SlashID organization id.
- `ROOT_API_KEY` is your SlashID API key.

Your organization id and API key can be found in the [SlashID Console](https://console.slashid.dev/login) after signing up.

### Install dependencies
```
npm install
```

### Generate the API client & build the frontend
```
npm run build
```

### Run the full-stack web application
```
npm start
```