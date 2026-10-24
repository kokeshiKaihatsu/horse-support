document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");

  if (!loginBtn) return;

  const user = netlifyIdentity.currentUser();

  if (user) {
    loginBtn.textContent = user.user_metadata.full_name;
  }

  loginBtn.addEventListener("click", () => {
    if (netlifyIdentity.currentUser()) {
      window.location.href = "/members/";
    } else {
      netlifyIdentity.open("login");
    }
  });

  netlifyIdentity.on("login", (user) => {
    loginBtn.textContent = user.user_metadata.full_name;
    window.location.href = "/members/";
  });
});