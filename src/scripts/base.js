document.addEventListener("DOMContentLoaded", () => {
  if (typeof netlifyIdentity === "undefined") return;

  const adminLink = document.getElementById("adminLink");
  const userBtn = document.getElementById("userBtn");

  function updateUI() {
    const user = netlifyIdentity.currentUser();

    // ユーザーボタン
    if (userBtn) {
      if (user) {
        userBtn.textContent =
          user.user_metadata?.full_name || user.email;

        userBtn.href = "/members/";
      } else {
        userBtn.textContent = "ログイン";
        userBtn.href = "/login/";
      }
    }

    // 管理リンク
    if (adminLink) {
      adminLink.style.display =
        user && user.role === "admin"
          ? "inline-block"
          : "none";
    }
  }

  updateUI();

  netlifyIdentity.on("login", updateUI);
  netlifyIdentity.on("logout", updateUI);
});