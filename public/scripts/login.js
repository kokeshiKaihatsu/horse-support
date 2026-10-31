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
      netlifyIdentity.open("login");
    }
  });

  netlifyIdentity.on("login", () => {
    updateButton();
    window.location.href = "/members/";
  });

  netlifyIdentity.on("logout", () => {
    updateButton();
  });
});