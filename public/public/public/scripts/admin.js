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

      // 保存先
      const imagePath = `public/images/horses/${id}.jpg`;

      // Markdownに書くパス（ローカルでも本番でも同じ）
      const markdownImagePath = `/images/horses/${id}.jpg`;

      // 画像保存（ローカル or 本番）
      await saveImageFile(imagePath, base64);

      // 馬データMarkdown
      const content = `---
id: ${id}
name: ${name}
image: ${markdownImagePath}
description: ${desc}
---
`;

      await saveTextFile(`src/horses/${id}.md`, content);

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

        await saveImageFile(imagePath, base64);

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

      await saveTextFile(`src/posts/${mdFilename}`, content);

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
// 🔧 テキスト保存（ローカル or 本番）
// ============================
async function saveTextFile(path, content) {

  // ローカル環境（localhost）
  if (location.hostname === "localhost") {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = path.split("/").pop();
    a.click();

    URL.revokeObjectURL(url);
    return;
  }

  // 本番環境（Netlify）
  const user = netlifyIdentity.currentUser();
  const token = await user.jwt();

  await fetch(`/.netlify/git/github/contents/${path}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: `Add ${path}`,
      content: btoa(content),
      encoding: "utf-8"
    })
  });
}


// ============================
// 🔧 画像保存（ローカル or 本番）
// ============================
async function saveImageFile(path, base64Data) {

  // ローカル環境（localhost）
  if (location.hostname === "localhost") {
    const byteString = atob(base64Data);
    const array = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      array[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([array], { type: "image/jpeg" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = path.split("/").pop();
    a.click();

    URL.revokeObjectURL(url);
    return;
  }

  // 本番環境（Netlify）
  const user = netlifyIdentity.currentUser();
  const token = await user.jwt();

  await fetch(`/.netlify/git/github/contents/${path}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: `Add ${path}`,
      content: base64Data,
      encoding: "base64"
    })
  });
}
