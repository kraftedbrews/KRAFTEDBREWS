if (import.meta.env.PROD && "serviceWorker" in navigator) {
  if (navigator.serviceWorker.controller) {
    let refreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", function () {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });
  }

  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("/sw.js", { updateViaCache: "none" })
      .then(function (registration) {
        registration.update().catch(function (error) {
          console.error("Service worker update check failed:", error);
        });
      })
      .catch(function (error) {
        console.error("Service worker registration failed:", error);
      });
  });
}
