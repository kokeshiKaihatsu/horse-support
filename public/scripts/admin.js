document.addEventListener("DOMContentLoaded", () => {

  // ============================
  // 🐴 馬追加（画像1枚）
  // ============================
  const horseForm = document.getElementById("addHorseForm");
  if (horseForm) {
    horseForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const id = document.getElementById("horseId").value;
      const name = document.getElementById("horseName").value;
      const desc = document.getElementById("horseDesc").value;

      const file = document.getElementById("horseImage").files[0];
      if (!file) {
        alert("画像を選択してください");
        return;
      }

      // 画像をBase64に変換
      const base64 = await fileToBase64(file);

      // 保存先（GitHub上）
      const imagePath = `public/images/horses/${id}.jpg`;

      // Markdownに書くパス
      const markdownImagePath = `/images/horses/${id}.jpg`;

      // 画像アップロード
      await saveFile(imagePath, base64, true);

      // 馬データMarkdown
      const content = `---
id: ${id}
name: ${name}
image: ${markdownImagePath}
description: ${desc}
---
`;

      await saveFile(`src/horses/${id}.md`, content);

      alert("馬を追加しました！");
    });
  }

  // ============================
  // 📝 投稿追加（画像複数）
  // ============================
  const postForm = document.getElementById("addPostForm");
  if (postForm) {
    postForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const title = document.getElementById("postTitle").value;
      const horseId = document.getElementById("postHorseId").value;
      const body = document.getElementById("postBody").value;

      const files = document.getElementById("postImages").files;
      const timestamp = Date.now();

      let imagesYaml = "";
      let index = 1;

      for (const file of files) {
        const base64 = await fileToBase64(file);

        const filename = `${horseId}-${timestamp}-${index}.jpg`;

        const imagePath = `src/assets/images/${filename}`;
        const markdownImagePath = `/assets/images/${filename}`;

        await saveFile(imagePath, base64, true);

        imagesYaml += `  - image: ${markdownImagePath}\n`;
        index++;
      }

      const mdFilename = `${timestamp}.md`;

      const content = `---
title: ${title}
horse_id: ${horseId}
images:
${imagesYaml}
---

${body}
`;

      await saveFile(`src/posts/${mdFilename}`, content);

      alert("投稿を追加しました！");
    });
  }

});


// ============================
// 🔧 Base64変換
// ============================
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}


// ============================
// 🔧 Git Gateway 保存（画像対応）
// ============================
async function saveFile(path, content, isBinary = false) {
  const token = "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"; // ← ローカル専用。絶対に公開しない。

  await fetch(`https://api.github.com/repos/kokeshiKaihatsu/horse-support/contents/${path}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: `Add ${path}`,
      content: isBinary ? content : btoa(content), // ← 画像はそのまま、テキストは btoa
      encoding: isBinary ? "base64" : "utf-8"
    })
  });
}

// async function saveFile(path, content, isBinary = false) {
//   const user = netlifyIdentity.currentUser();
//   const token = await user.jwt();

//   await fetch(`/.netlify/git/github/contents/${path}`, {
//     method: "PUT",
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify({
//       message: `Add ${path}`,
//       content: isBinary ? content : btoa(content),
//       encoding: isBinary ? "base64" : "utf-8"
//     })
//   });
// }
