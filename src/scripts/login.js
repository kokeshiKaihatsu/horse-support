document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");

  if (!loginBtn) return;

  function updateButton() {
    const user = netlifyIdentity.currentUser();

    loginBtn.textContent = user
      ? "ログアウト"
      : "ログイン";
  }

  updateButton();

  loginBtn.addEventListener("click", async () => {
    const user = netlifyIdentity.currentUser();

    if (user) {
      await netlifyIdentity.logout();
      updateButton();
    } else {
      // 「自分でログインボタンを押した」印を付ける
      sessionStorage.setItem("justLoggedIn", "true");
      netlifyIdentity.open("login");
    }
  });

  netlifyIdentity.on("login", () => {
    updateButton();

    // ログイン直後だけトップへ飛ばす
    if (sessionStorage.getItem("justLoggedIn")) {
      sessionStorage.removeItem("justLoggedIn");
      window.location.href = "/";
    }
  });
});