(function () {
  const dismissedKey = "krafted-brews-install-dismissed";
  let deferredPrompt = null;
  let banner;
  let actionButton;
  let instructions;

  function isStandalone() {
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      navigator.standalone === true
    );
  }

  function wasDismissed() {
    try {
      return window.sessionStorage.getItem(dismissedKey) === "true";
    } catch (error) {
      console.warn("Could not read the install prompt preference:", error);
      return false;
    }
  }

  function rememberDismissal() {
    try {
      window.sessionStorage.setItem(dismissedKey, "true");
    } catch (error) {
      console.warn("Could not save the install prompt preference:", error);
    }
  }

  function hideBanner() {
    if (!banner) return;
    banner.hidden = true;
    document.body.classList.remove("has-pwa-install-prompt");
  }

  function showInstructions() {
    const isAppleMobile =
      /iphone|ipad|ipod/i.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    instructions.textContent = isAppleMobile
      ? "Tap Share, then choose “Add to Home Screen.”"
      : "Open your browser menu and choose “Install app” or “Add to Home Screen.”";
    instructions.hidden = false;
    actionButton.textContent = deferredPrompt ? "Install" : "How to install";
  }

  function createBanner() {
    banner = document.createElement("aside");
    banner.className = "pwa-install-prompt";
    banner.setAttribute("aria-label", "Install Krafted Brews");
    banner.hidden = true;

    const icon = document.createElement("img");
    icon.className = "pwa-install-icon";
    icon.src = "/icons/krafted-brews-192.png";
    icon.alt = "";
    icon.width = 48;
    icon.height = 48;

    const copy = document.createElement("div");
    copy.className = "pwa-install-copy";

    const title = document.createElement("strong");
    title.textContent = "Install Krafted Brews";

    const description = document.createElement("p");
    description.textContent = "Keep the café menu one tap away.";

    instructions = document.createElement("p");
    instructions.className = "pwa-install-instructions";
    instructions.setAttribute("aria-live", "polite");
    instructions.hidden = true;

    copy.append(title, description, instructions);

    actionButton = document.createElement("button");
    actionButton.className = "pwa-install-action";
    actionButton.type = "button";
    actionButton.textContent = "Install";
    actionButton.addEventListener("click", async function () {
      if (!deferredPrompt) {
        showInstructions();
        return;
      }

      const installEvent = deferredPrompt;
      deferredPrompt = null;
      actionButton.disabled = true;
      try {
        await installEvent.prompt();
        const choice = await installEvent.userChoice;
        if (choice.outcome === "accepted") {
          rememberDismissal();
          hideBanner();
        } else {
          showInstructions();
        }
      } catch (error) {
        console.error("Could not open the app install prompt:", error);
        showInstructions();
      } finally {
        actionButton.disabled = false;
      }
    });

    const dismissButton = document.createElement("button");
    dismissButton.className = "pwa-install-dismiss";
    dismissButton.type = "button";
    dismissButton.setAttribute("aria-label", "Dismiss install prompt");
    dismissButton.textContent = "×";
    dismissButton.addEventListener("click", function () {
      rememberDismissal();
      hideBanner();
    });

    banner.append(icon, copy, actionButton, dismissButton);
    document.body.appendChild(banner);
  }

  window.addEventListener("beforeinstallprompt", function (event) {
    event.preventDefault();
    deferredPrompt = event;
    if (actionButton) actionButton.textContent = "Install";
    if (instructions) instructions.hidden = true;
  });

  window.addEventListener("appinstalled", function () {
    rememberDismissal();
    hideBanner();
  });

  function initialize() {
    if (isStandalone() || wasDismissed()) return;
    createBanner();
    window.setTimeout(function () {
      if (!isStandalone() && !wasDismissed()) {
        banner.hidden = false;
        document.body.classList.add("has-pwa-install-prompt");
      }
    }, 350);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
})();
