const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

// プロジェクトルートを計算
const projectRoot = path.join(__dirname, "..", "..");

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.post("/api/save-horse", (req, res) => {
  const { id, content } = req.body;
  const filePath = path.join(projectRoot, "src/horses", `${id}.md`);
  fs.writeFile(filePath, content, "utf8", (err) => {
    if (err) return res.status(500).json({ error: "保存できませんでした" });
    res.json({ ok: true });
  });
});

app.post("/api/save-image", (req, res) => {
  const { id, base64 } = req.body;
  const filePath = path.join(projectRoot, "public/images/horses", `${id}.jpg`);
  const buffer = Buffer.from(base64, "base64");
  fs.writeFile(filePath, buffer, (err) => {
    if (err) return res.status(500).json({ error: "画像保存できませんでした" });
    res.json({ ok: true });
  });
});

app.listen(3001, () => {
  console.log("Local API running on http://localhost:3001");
});
