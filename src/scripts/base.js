document.addEventListener("DOMContentLoaded", () => {
  const adminLink = document.getElementById("adminLink");

  if (!adminLink) return;

  adminLink.style.display = "none";

  const user = netlifyIdentity.currentUser();

  if (user && user.role === "admin") {
    adminLink.style.display = "inline-block";
  }

  netlifyIdentity.on("login", (user) => {
    if (user.role === "admin") {
      adminLink.style.display = "inline-block";
    }
  });

  netlifyIdentity.on("logout", () => {
    adminLink.style.display = "none";
  });
});