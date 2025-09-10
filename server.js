// server.js (MCP-ready full version)
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const NOTION_TOKEN = process.env.NOTION_TOKEN || "YOUR_NOTION_API_KEY";
const NOTION_BASE = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";

// ✅ MCP 표준: Manifest 엔드포인트
app.get("/manifest.json", (req, res) => {
  const host = req.get("host");
  const proto = req.protocol;
  res.json({
    schema_version: "v1",
    name_for_human: "Notion MCP Server",
    name_for_model: "notion_mcp",
    description_for_human: "Search, fetch, and update Notion pages via MCP",
    description_for_model: "Use this tool to search, fetch, and update Notion pages",
    auth: { type: "none" },
    api: {
      type: "openapi",
      url: `${proto}://${host}/openapi.json`
    }
  });
});

// ✅ MCP 표준: OpenAPI 스펙
app.get("/openapi.json", (req, res) => {
  res.json({
    openapi: "3.0.1",
    info: {
      title: "Notion MCP API",
      version: "1.0.0"
    },
    paths: {
      "/search": {
        post: {
          summary: "Search Notion",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { type: "object", properties: { query: { type: "string" } } }
              }
            }
          },
          responses: { "200": { description: "Search results" } }
        }
      },
      "/fetch": {
        post: {
          summary: "Fetch Notion page",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { type: "object", properties: { id: { type: "string" } } }
              }
            }
          },
          responses: { "200": { description: "Page data" } }
        }
      },
      "/update": {
        post: {
          summary: "Update Notion page",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    properties: { type: "object" }
                  }
                }
              }
            }
          },
          responses: { "200": { description: "Updated page" } }
        }
      }
    }
  });
});

// ✅ Search
app.post("/search", async (req, res) => {
  const query = req.body.query || "";
  try {
    const resp = await axios.post(
      `${NOTION_BASE}/search`,
      { query },
      {
        headers: {
          Authorization: `Bearer ${NOTION_TOKEN}`,
          "Notion-Version": NOTION_VERSION,
        },
      }
    );
    res.json(resp.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Fetch
app.post("/fetch", async (req, res) => {
  const id = req.body.id;
  if (!id) return res.status(400).json({ error: "Missing id" });
  try {
    const resp = await axios.get(`${NOTION_BASE}/pages/${id}`, {
      headers: {
        Authorization: `Bearer ${NOTION_TOKEN}`,
        "Notion-Version": NOTION_VERSION,
      },
    });
    res.json(resp.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update
app.post("/update", async (req, res) => {
  const { id, properties } = req.body;
  if (!id || !properties)
    return res.status(400).json({ error: "Missing id or properties" });
  try {
    const resp = await axios.patch(
      `${NOTION_BASE}/pages/${id}`,
      { properties },
      {
        headers: {
          Authorization: `Bearer ${NOTION_TOKEN}`,
          "Notion-Version": NOTION_VERSION,
          "Content-Type": "application/json",
        },
      }
    );
    res.json(resp.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Notion MCP server running on http://localhost:${PORT}`);
});
