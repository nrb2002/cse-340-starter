/* ****************************************
*  Toggle password view on login/registration form
* *************************************** */
const togglePassword = document.querySelector(".togglePassword");
const passwordInput = document.querySelector("#accountPassword");

togglePassword.addEventListener("click", () => {
    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    togglePassword.textContent = type === "password" ? "👁" : "🙈";
});