const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// MCP manifest endpoint
app.get("/manifest.json", (req, res) => {
  res.json({
    schema_version: "v1",
    name_for_human: "Notion MCP Server",
    name_for_model: "notion_mcp",
    description_for_human: "Search and manage Notion pages via MCP",
    description_for_model: "Plugin for querying and managing Notion data",
    auth: { type: "none" },
    api: {
      type: "openapi",
      url: `${req.protocol}://${req.get("host")}/openapi.json`
    }
  });
});

// OpenAPI spec (임시 빈 JSON)
app.get("/openapi.json", (req, res) => {
  res.json({
    openapi: "3.0.0",
    info: {
      title: "Notion MCP API",
      version: "1.0.0"
    },
    paths: {}
  });
});

// 기본 root 응답
app.get("/", (req, res) => {
  res.send("✅ Notion MCP server is running. Try /manifest.json");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`MCP server listening on port ${port}`);
});