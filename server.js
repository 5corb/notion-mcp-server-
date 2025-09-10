// server.js
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

// 🔑 노션 API 키 (환경변수에서 읽음)
const NOTION_TOKEN = process.env.NOTION_TOKEN || "YOUR_NOTION_API_KEY";
const NOTION_BASE = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";

// ✅ MCP 도구: search
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

// ✅ MCP 도구: fetch (DB/페이지 가져오기)
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

// ✅ MCP 도구: update (간단한 속성 업데이트)
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
