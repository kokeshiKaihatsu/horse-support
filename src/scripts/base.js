document.addEventListener("DOMContentLoaded", () => {
  if (typeof netlifyIdentity === "undefined") return;

  const adminLink = document.getElementById("adminLink");
  const userBtn = document.getElementById("userBtn");

  function updateUI() {
    const user = netlifyIdentity.currentUser();

     userBtn.href = "/login/";
    // ユーザーボタン
    if (userBtn) {
      if (user) {
        userBtn.textContent =
          user.user_metadata?.full_name || user.email;
      } else {
        userBtn.textContent = "ログイン";
      }
    }

    // 管理リンク
    if (adminLink) {
    adminLink.style.display =
        user?.app_metadata?.roles?.includes("admin")
        ? "inline-block"
        : "none";
    }
  }

  updateUI();

  netlifyIdentity.on("login", updateUI);
  netlifyIdentity.on("logout", updateUI);
});