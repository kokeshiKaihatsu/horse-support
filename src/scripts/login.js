document.addEventListener("DOMContentLoaded", () => {

  const loginBtn = document.getElementById("loginBtn");
  const emailInput = document.getElementById("loginEmail");
  const passInput = document.getElementById("loginPassword");
  const message = document.getElementById("loginMessage");

  loginBtn.addEventListener("click", async () => {
    const email = emailInput.value;
    const password = passInput.value;

    try {
      const user = await netlifyIdentity.login(email, password, true);
      message.textContent = "ログイン成功！";
      window.location.href = "/admin/"; // ログイン後の遷移先
    } catch (err) {
      message.textContent = "ログイン失敗：" + err.message;
    }
  });

});
