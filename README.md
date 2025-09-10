# Notion MCP Server

This is a simple MCP-compatible server for Notion.

## Endpoints
- `/manifest.json` - MCP manifest
- `/openapi.json` - OpenAPI schema
- `/search` - Search Notion pages
- `/fetch` - Fetch a Notion page
- `/update` - Update a Notion page

## Deploy on Vercel
1. Upload `server.js`, `package.json`, `vercel.json` to your GitHub repo
2. Connect repo to Vercel
3. Open `https://your-project.vercel.app/manifest.json`
