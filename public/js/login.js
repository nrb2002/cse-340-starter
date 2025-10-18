// Sync logout across tabs
  window.addEventListener("storage", (event) => {
    if (event.key === "logout") {
      window.location.href = "/account/login";
    }
  });