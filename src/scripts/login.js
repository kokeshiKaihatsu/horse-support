document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");

  if (!loginBtn) return;

  loginBtn.addEventListener("click", () => {
    netlifyIdentity.open("login");
  });

  netlifyIdentity.on("login", () => {
    window.location.href = "/members/";
  });
});