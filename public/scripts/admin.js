document.addEventListener("DOMContentLoaded", () => {

  if (window.netlifyIdentity) {
  window.netlifyIdentity.on('init', user => {
    if (!user) {
      window.netlifyIdentity.on('login', () => {
        document.location.href = '/admin/';
      });
    }
  });

  // 🔥 これがないと Invalid state key が出る
  window.netlifyIdentity.on('error', err => console.error('Identity error:', err));
}

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

      const base64 = await fileToBase64(file);

      const imagePath = `public/images/horses/${id}.jpg`;
      const markdownImagePath = `/images/horses/${id}.jpg`;

      await saveImageFile(imagePath, base64);

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

  // ============================
  // 🔍 共通：画像プレビュー関数
  // ============================
  function setupImagePreview(inputId, previewId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);

    if (!input || !preview) return;

    input.addEventListener("change", () => {
      preview.innerHTML = "";

      for (const file of input.files) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = document.createElement("img");
          img.src = e.target.result;
          img.style.width = "150px";
          img.style.borderRadius = "8px";
          img.style.marginRight = "10px";
          img.style.marginBottom = "10px";
          preview.appendChild(img);
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // ============================
  // 🔍 馬追加ページのプレビュー
  // ============================
  setupImagePreview("horseImage", "imagePreview");

  // ============================
  // 🔍 タイムライン投稿ページのプレビュー
  // ============================
  setupImagePreview("postImages", "imagePreview");

  // ============================
  // 🐴 インライン編集（馬一覧）
  // ============================
  document.querySelectorAll(".edit-btn").forEach(btn => {
    btn.addEventListener("click", () => {

      const card = btn.closest(".horse-card");   // ← クリックされたカードを取得
      const viewMode = card.querySelector(".view-mode");
      const editMode = card.querySelector(".edit-mode");

      viewMode.style.display = "none";
      editMode.style.display = "block";
    });
  });

  document.querySelectorAll(".cancel-btn").forEach(btn => {
    btn.addEventListener("click", () => {

      const card = btn.closest(".horse-card");
      const viewMode = card.querySelector(".view-mode");
      const editMode = card.querySelector(".edit-mode");

      editMode.style.display = "none";
      viewMode.style.display = "block";
    });
  });

document.querySelectorAll(".save-btn").forEach(btn => {
  btn.addEventListener("click", async () => {

    const card = btn.closest(".horse-card");
    const id = card.dataset.id;

    const name = card.querySelector(".edit-name").value;
    const birthday = card.querySelector(".edit-birthday").value;
    const desc = card.querySelector(".edit-desc").value;

    // 既存画像パス（view-mode の img から取る）
    let imagePathMarkdown = card.querySelector(".view-mode img").getAttribute("src");

    // 新しい画像が選択された場合のみ更新
    const fileInput = card.querySelector(".edit-image-file");
    let base64 = null;

    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      base64 = await fileToBase64(file);

      const imagePath = `public/images/horses/${id}.jpg`;
      imagePathMarkdown = `/images/horses/${id}.jpg`;

      await saveImageFile(imagePath, base64);
    }

    // md の内容（インデント無し）
    const content = `---
id: ${id}
name: ${name}
image: ${imagePathMarkdown}
birthday: ${birthday}
description: ${desc}
---
`;

    // ============================
    // 🟥 ローカル保存（本当に md を上書き）
    // ============================
    if (location.hostname === "localhost") {

    // md 保存
    await fetch("http://localhost:3001/api/save-horse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, content })
    });

    // 画像保存
    if (base64) {
      await fetch("http://localhost:3001/api/save-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, base64 })
      });
    }

    alert("ローカルに保存しました！");
    location.reload();
    return;
  }


    // ============================
    // 🟩 本番保存（GitHub API）
    // ============================
    await saveTextFile(`src/horses/${id}.md`, content);

    alert("保存しました！");
    location.reload();
  });
});

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