import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

(function () {
  var T = THREE,
    $ = function (i) {
      return document.getElementById(i);
    };
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var mobile3D = matchMedia("(max-width: 700px), (pointer: coarse)").matches;
  var mouse = { x: 0, y: 0 };
  addEventListener("pointermove", function (e) {
    mouse.x = (e.clientX / innerWidth) * 2 - 1;
    mouse.y = (e.clientY / innerHeight) * 2 - 1;
  });

  /* ---------- navigation + reveal interactions ---------- */
  var primaryNav = $("primaryNav");
  var storyLink = $("storyLink");
  if (storyLink) {
    storyLink.addEventListener("click", function (event) {
      if (reduce) return;
      event.preventDefault();
      var heroCanvas = $("heroCv");
      if (!heroCanvas) {
        location.assign("/our-story.html");
        return;
      }
      var rect = heroCanvas.getBoundingClientRect();
      var bridge = document.createElement("div");
      bridge.className = "story-page-transition";
      bridge.innerHTML =
        '<div class="story-transition-cup" aria-hidden="true">' +
        '<span class="story-transition-lid"></span>' +
        '<span class="story-transition-body"><b>krafted</b><small>BREWS</small></span>' +
        "</div>";
      bridge.style.setProperty("--handoff-x", rect.left + rect.width / 2 + "px");
      bridge.style.setProperty("--handoff-y", rect.top + rect.height / 2 + "px");
      document.body.appendChild(bridge);
      sessionStorage.setItem("kraftedStoryArrival", "1");
      requestAnimationFrame(function () {
        bridge.classList.add("is-running");
      });
      setTimeout(function () {
        location.assign("/our-story.html");
      }, 720);
    });
  }
  document.addEventListener("click", function (event) {
    var action = event.target.closest
      ? event.target.closest("[data-receipt-action]")
      : null;
    if (!action) return;
    var index = Number(action.dataset.receiptAction);
    var receiptCard = document.querySelector(".hero-receipt-card");
    if (!receiptCard) return;
    var slides = Array.from(receiptCard.querySelectorAll("[data-receipt]"));
    var dots = Array.from(receiptCard.querySelectorAll("[data-receipt-dot]"));
    var actions = Array.from(receiptCard.querySelectorAll("[data-receipt-action]"));
    slides.forEach(function (slide, slideIndex) {
      var active = slideIndex === index;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", active ? "false" : "true");
    });
    dots.forEach(function (dot, dotIndex) {
      var active = dotIndex === index;
      dot.classList.toggle("is-active", active);
      dot.setAttribute("aria-pressed", active ? "true" : "false");
    });
    actions.forEach(function (item, itemIndex) {
      var active = itemIndex === index;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", active ? "true" : "false");
    });
    if (typeof window.showHeroReceiptProduct === "function") {
      window.showHeroReceiptProduct(index);
    }
    setTimeout(function () {
      Array.from(document.querySelectorAll("[data-receipt-action]")).forEach(function (item, itemIndex) {
        item.classList.toggle("is-active", itemIndex === index);
        item.setAttribute("aria-pressed", itemIndex === index ? "true" : "false");
      });
    }, 20);
  });

  function initReceiptCard() {
    var receiptCard = document.querySelector(".hero-receipt-card");
    if (!receiptCard || receiptCard.dataset.initialized === "true") return;
    receiptCard.dataset.initialized = "true";
    function resetPaperTilt() {
      receiptCard.style.setProperty("--receipt-tilt-x", "0deg");
      receiptCard.style.setProperty("--receipt-tilt-y", "0deg");
    }
    if (!reduce) {
      receiptCard.addEventListener("pointermove", function (event) {
        if (event.pointerType !== "mouse") return;
        var bounds = receiptCard.getBoundingClientRect();
        var x = (event.clientX - bounds.left) / bounds.width - 0.5;
        var y = (event.clientY - bounds.top) / bounds.height - 0.5;
        receiptCard.style.setProperty(
          "--receipt-tilt-x",
          (-y * 8).toFixed(2) + "deg",
        );
        receiptCard.style.setProperty(
          "--receipt-tilt-y",
          (x * 9).toFixed(2) + "deg",
        );
      });
    }
    receiptCard.addEventListener("pointerleave", resetPaperTilt);
    receiptCard.addEventListener("pointercancel", resetPaperTilt);

    var receiptSlides = Array.from(receiptCard.querySelectorAll(".hero-receipt"));
    var receiptDots = Array.from(receiptCard.querySelectorAll("[data-receipt-dot]"));
    var receiptActions = Array.from(receiptCard.querySelectorAll("[data-receipt-action]"));
    var receiptIndex = 0;
    var receiptPaused = false;
    function showReceipt(index) {
      receiptIndex = (index + receiptSlides.length) % receiptSlides.length;
      receiptSlides.forEach(function (slide, slideIndex) {
        var active = slideIndex === receiptIndex;
        slide.classList.toggle("is-active", active);
        slide.setAttribute("aria-hidden", active ? "false" : "true");
      });
      receiptDots.forEach(function (dot, dotIndex) {
        var active = dotIndex === receiptIndex;
        dot.classList.toggle("is-active", active);
        dot.setAttribute("aria-pressed", active ? "true" : "false");
      });
      receiptActions.forEach(function (action, actionIndex) {
        action.classList.toggle("is-active", actionIndex === receiptIndex);
        action.setAttribute("aria-pressed", actionIndex === receiptIndex ? "true" : "false");
      });
    }
    receiptDots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        showReceipt(Number(dot.dataset.receiptDot));
        if (typeof window.showHeroReceiptProduct === "function") {
          window.showHeroReceiptProduct(Number(dot.dataset.receiptDot));
        }
      });
    });
    receiptActions.forEach(function (action) {
      action.addEventListener("click", function () {
        var index = Number(action.dataset.receiptAction);
        showReceipt(index);
        if (typeof window.showHeroReceiptProduct === "function") {
          window.showHeroReceiptProduct(index);
        }
      });
    });
    receiptCard.addEventListener("pointerenter", function () {
      receiptPaused = true;
    });
    receiptCard.addEventListener("pointerleave", function () {
      receiptPaused = false;
    });
    receiptCard.addEventListener("focusin", function () {
      receiptPaused = true;
    });
    receiptCard.addEventListener("focusout", function (event) {
      if (!receiptCard.contains(event.relatedTarget)) receiptPaused = false;
    });
    var receiptTimer = setInterval(function () {
      if (!receiptPaused && !reduce && !document.hidden) {
        showReceipt(receiptIndex + 1);
      }
    }, 2800);
    window.addEventListener("beforeunload", function () {
      clearInterval(receiptTimer);
    });
    showReceipt(0);
  }
  initReceiptCard();
  setTimeout(initReceiptCard, 0);
  setTimeout(initReceiptCard, 250);
  var revealTargets = document.querySelectorAll(
    "#hero .cards,#menu .wrap,#visit .wrap,footer",
  );
  revealTargets.forEach(function (el) {
    el.classList.add("reveal");
  });
  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );
  revealTargets.forEach(function (el) {
    revealObserver.observe(el);
  });
  var navLinks = primaryNav ? primaryNav.querySelectorAll("a") : [];
  var sectionObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.toggle(
            "active",
            a.getAttribute("href") === "#" + entry.target.id,
          );
        });
      });
    },
    { rootMargin: "-35% 0px -55% 0px", threshold: 0 },
  );
  document
    .querySelectorAll("#hero,#menu,#visit")
    .forEach(function (section) {
      sectionObserver.observe(section);
    });
  function updateScroll() {
    var max = document.documentElement.scrollHeight - innerHeight;
    $("scrollProgress").style.width =
      (max > 0 ? (scrollY / max) * 100 : 0) + "%";
  }
  addEventListener("scroll", updateScroll, { passive: true });
  updateScroll();
  var heroBeans = document.querySelectorAll(".hero-bean");
  var cursor = $("cursorDot");
  addEventListener(
    "pointermove",
    function (e) {
      if (!reduce && !mobile3D) {
        document.body.classList.add("cursor-active");
        cursor.style.left = e.clientX + "px";
        cursor.style.top = e.clientY + "px";
      }
    },
    { passive: true },
  );
  document
    .querySelectorAll("a,button,.gcard,.item,.pbtn")
    .forEach(function (el) {
      el.addEventListener("pointerenter", function () {
        cursor.classList.add("is-hovering");
      });
      el.addEventListener("pointerleave", function () {
        cursor.classList.remove("is-hovering");
      });
    });

  /* ---------- menu ---------- */
  var MENU = {
    "Coffee & Cocoa": [
      ["Espresso Shot", "72", "Hot", "Single espresso"],
      ["Affogato", "156", "Hot", "Espresso over vanilla ice cream"],
      ["Caffè Americano", "126 / 143", "Hot / iced", "Espresso and water"],
      ["Caffè Latte", "158 / 176", "Hot / iced", "Espresso and steamed milk"],
      ["Caffè Mocha", "173 / 193", "Hot / iced", "Espresso, chocolate and milk"],
      ["Cappuccino", "158 / 176", "Hot / iced", "Espresso and milk foam"],
      ["Caramel Macchiato", "173 / 193", "Hot / iced", "Espresso, milk and caramel"],
      ["Chocolate", "163 / 183", "Hot / iced", "Chocolate and milk"],
      ["Hiraya Latte", "173 / 193", "Hot / iced", "House specialty latte"],
      ["Iced Spanish Latte", "203", "Iced", "Espresso, milk and condensed milk"],
      ["Matcha", "198 / 238", "Hot / iced", "Ceremonial matcha and milk"],
      ["Spanish Latte", "176 / 203", "Hot / iced", "Espresso, milk and condensed milk"],
    ],
    "Pastries": [
      ["Classic Pan De Sal (6 pcs)", "62", "Freshly baked", "Soft Filipino bread rolls"],
      ["Cream Cheese De Sal (2 pcs)", "103", "Freshly baked", "Pan de sal with cream cheese"],
      ["PB&J Duo Pan De Sal (2 pcs)", "53", "Freshly baked", "Peanut butter and jam"],
      ["Flatbread", "136", "Freshly baked", "House flatbread"],
      ["French Macarons (6 pcs)", "268", "Assorted flavors", "French macarons"],
      ["Hotdog Roll", "93", "Freshly baked", "Savory hotdog roll"],
      ["Low-Carb Brownie", "113", "Baked fresh", "Rich low-carb brownie"],
      ["Key Lime Pie (1 slice)", "198", "By the slice", "Tart key lime pie"],
      ["Krafted Cheesecake (1 slice)", "188", "By the slice", "Krafted house cheesecake"],
      ["Ensaymada Cheesecake", "", "", ""],
      ["Matte Chocolate Cake (1 slice)", "203", "By the slice", "Chocolate cake"],
      ["Oatmeal Cookie", "103", "Baked fresh", "Chewy oatmeal cookie"],
    ],
    "Miscellaneous": [
      ["Caramel Babyccino", "148", "Cold", "Caramel milk foam"],
      ["Fruit Soda", "156", "Cold", "Sparkling fruit soda"],
      ["Kold Brew (500 ml)", "178", "Cold", "Ready-to-drink cold brew"],
      ["Lemonade", "136", "Cold", "Fresh house lemonade"],
      ["Lemangonade", "", "Iced", "Mango lemonade"],
      ["Lemonade Special", "156", "Cold", "Special lemonade"],
      ["Matcha Milkshake", "", "Cold", "Matcha milkshake"],
      ["Vanilla Ice Cream", "53", "Cold", "Vanilla ice cream"],
      ["Vanilla Milkshake", "178", "Cold", "Vanilla milkshake"],
      ["Barista's Drink (600 ml)", "209", "Cold", "Double-shot specialty drink"],
      ["Midori Tea", "138", "Hot / iced", "Midori tea"],
    ],
    "Whole Cakes": [
      ["Key Lime Pie", "1,419", "Whole pie", "Whole key lime pie"],
      ["Krafted Cheesecake", "1,369", "Whole cake", "Whole Krafted cheesecake"],
      ["Matte Chocolate Cake", "1,469", "Whole cake", "Whole chocolate cake"],
      ["9pcs Low-Carb Brownies", "949", "Box", "Nine low-carb brownies"],
      ["8pcs French Macarons", "356", "Box", "Eight French macarons"],
      ["12pcs French Macarons", "536", "Box", "Twelve French macarons"],
      ["12pcs Thicc Cookies", "659", "Box", "Twelve thick cookies"],
    ],
  };
  var ACC = {
    "Coffee & Cocoa": "#C98A3D",
    Pastries: "#B5586A",
    Miscellaneous: "#5E8BA3",
    "Whole Cakes": "#7C9070",
  };
  var cats = Object.keys(MENU),
    tabs = $("tabs"),
    list = $("menuList"),
    productDialog = $("menuProductDialog"),
    dialogArtwork = $("menuDialogArtwork"),
    dialogViewImage = $("menuDialogViewImage"),
    fullImageDialog = $("menuFullImageDialog"),
    fullImage = $("menuFullImage"),
    fullImageClose = $("menuFullImageClose"),
    dialogTitle = $("menuDialogTitle"),
    dialogPrice = $("menuDialogPrice"),
    dialogOptions = $("menuDialogOptions"),
    dialogProducts = $("menuDialogProducts"),
    dialogTags = $("menuDialogTags"),
    dialogNotes = $("menuDialogNotes"),
    dialogIng = $("menuDialogIng"),
    productDialogCloseTimer;
  function getProductOptions(product) {
    var prices = product[1].split("/").map(function (value) {
        return value.trim();
      }),
      servings = product[2].split("/").map(function (value) {
        return value.trim();
      });
    if (prices.length < 2 || prices.length !== servings.length) return [];
    return servings.map(function (serving, index) {
      return {
        serving: serving.charAt(0).toUpperCase() + serving.slice(1),
        price: prices[index],
      };
    });
  }
  function renderDialogProducts(category, selectedIndex) {
    var label = document.createElement("span");
    label.className = "menu-dialog-products-label";
    label.textContent = "More products";
    dialogProducts.replaceChildren(label);
    MENU[category].forEach(function (product, productIndex) {
      var button = document.createElement("button"),
        artwork = document.createElement("span"),
        name = document.createElement("span");
      button.className = "menu-dialog-product";
      button.type = "button";
      button.setAttribute("aria-label", "View " + product[0]);
      button.setAttribute(
        "aria-pressed",
        productIndex === selectedIndex ? "true" : "false",
      );
      artwork.className = "menu-dialog-product-image";
      artwork.setAttribute("aria-hidden", "true");
      artwork.innerHTML = productArtwork(category, productIndex, product[0]);
      var image = artwork.querySelector("img");
      if (image) image.alt = "";
      name.className = "menu-dialog-product-name";
      name.textContent = product[0];
      button.append(artwork, name);
      button.addEventListener("click", function () {
        showProductDialog(category, productIndex, product);
      });
      dialogProducts.appendChild(button);
    });
  }
  function showProductDialog(category, index, product) {
    var wasOpen = productDialog.open,
      isMobile = window.matchMedia("(max-width: 700px)").matches,
      options = getProductOptions(product),
      useServingOptions =
        options.length > 0 && isMobile;
    dialogArtwork.innerHTML = productArtwork(category, index, product[0]);
    var productArt = dialogArtwork.querySelector(".item-art");
    dialogViewImage.hidden = !productArt;
    if (productArt) productArt.appendChild(dialogViewImage);
    renderDialogProducts(category, index);
    dialogTitle.textContent = product[0];
    dialogPrice.textContent = useServingOptions
      ? "₱" + options[0].price
      : product[1]
        ? "₱" + product[1]
        : "";
    dialogPrice.hidden = !product[1];
    dialogOptions.hidden = !useServingOptions;
    dialogOptions.innerHTML = options
      .map(function (option, optionIndex) {
        return (
          '<button class="menu-dialog-option" type="button" data-price-option aria-pressed="' +
          (optionIndex === 0 ? "true" : "false") +
          '" data-price="' +
          option.price +
          '">' +
          option.serving +
          "</button>"
        );
      })
      .join("");
    dialogTags.innerHTML = [category, "Made to order"]
      .map(function (tag, tagIndex) {
        return (
          '<span class="menu-dialog-tag' +
          (tagIndex ? " is-matcha" : "") +
          '">' +
          tag +
          "</span>"
        );
      })
      .join("");
    dialogNotes.textContent = product[2];
    dialogNotes.hidden = !product[2] || useServingOptions;
    dialogIng.textContent = product[3];
    dialogIng.hidden = !product[3];
    window.clearTimeout(productDialogCloseTimer);
    if (wasOpen) {
      productDialog.classList.remove("is-closing");
      if (isMobile) productDialog.classList.add("is-visible");
      var selectedButton = dialogProducts.querySelector('[aria-pressed="true"]');
      if (selectedButton) selectedButton.focus();
    } else {
      productDialog.classList.remove("is-visible", "is-closing");
      productDialog.showModal();
    }
    requestAnimationFrame(function () {
      if (isMobile) productDialog.classList.add("is-visible");
      var selectedButton = dialogProducts.querySelector('[aria-pressed="true"]');
      if (selectedButton)
        selectedButton.scrollIntoView({ block: "nearest", inline: "center" });
    });
  }
  function closeProductDialog() {
    if (!productDialog.open || productDialog.classList.contains("is-closing"))
      return;
    if (
      !window.matchMedia("(max-width: 700px)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      productDialog.close();
      return;
    }
    productDialog.classList.remove("is-visible");
    productDialog.classList.add("is-closing");
    productDialogCloseTimer = window.setTimeout(function () {
      if (productDialog.open) productDialog.close();
    }, 300);
  }
  dialogOptions.addEventListener("click", function (event) {
    var selectedOption = event.target.closest("[data-price-option]");
    if (!selectedOption || !dialogOptions.contains(selectedOption)) return;
    dialogOptions.querySelectorAll("[data-price-option]").forEach(function (option) {
      option.setAttribute(
        "aria-pressed",
        option === selectedOption ? "true" : "false",
      );
    });
    dialogPrice.textContent = "₱" + selectedOption.dataset.price;
  });
  $("menuDialogClose").addEventListener("click", function () {
    closeProductDialog();
  });
  dialogViewImage.addEventListener("click", function () {
    var productImage = dialogArtwork.querySelector(".product-photo");
    if (!productImage) return;
    fullImage.src = productImage.currentSrc || productImage.src;
    fullImage.alt = productImage.alt || dialogTitle.textContent;
    fullImageDialog.showModal();
  });
  fullImageDialog.addEventListener("cancel", function (event) {
    event.preventDefault();
    fullImageDialog.close();
  });
  fullImageDialog.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;
    event.preventDefault();
    fullImageDialog.close();
  });
  fullImageClose.addEventListener("click", function () {
    fullImageDialog.close();
  });
  fullImageDialog.addEventListener("click", function (event) {
    if (event.target === fullImageDialog) fullImageDialog.close();
  });
  fullImageDialog.addEventListener("close", function () {
    fullImage.removeAttribute("src");
    fullImage.alt = "";
    if (productDialog.open) dialogViewImage.focus();
  });
  productDialog.addEventListener("cancel", function (event) {
    event.preventDefault();
    closeProductDialog();
  });
  productDialog.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;
    event.preventDefault();
    closeProductDialog();
  });
  productDialog.addEventListener("click", function (event) {
    if (event.target === productDialog) closeProductDialog();
  });
  productDialog.addEventListener("close", function () {
    productDialog.classList.remove("is-visible", "is-closing");
  });
  var productSheetPointerStart = null;
  productDialog.addEventListener("pointerdown", function (event) {
    if (
      !event.target.closest(".menu-dialog-artwork") ||
      event.target.closest(".menu-dialog-view-image")
    )
      return;
    productSheetPointerStart = { x: event.clientX, y: event.clientY };
    productDialog.setPointerCapture(event.pointerId);
  });
  productDialog.addEventListener("pointercancel", function () {
    productSheetPointerStart = null;
  });
  productDialog.addEventListener("pointermove", function (event) {
    if (!productSheetPointerStart) return;
    var deltaY = event.clientY - productSheetPointerStart.y,
      deltaX = event.clientX - productSheetPointerStart.x;
    if (deltaY > 100 && Math.abs(deltaX) < 80) {
      productSheetPointerStart = null;
      closeProductDialog();
    }
  });
  productDialog.addEventListener("pointerup", function () {
    productSheetPointerStart = null;
  });
  var productSheetTouchStart = null;
  dialogArtwork.addEventListener(
    "touchstart",
    function (event) {
      if (event.touches.length !== 1 || event.changedTouches.length !== 1) {
        productSheetTouchStart = null;
        return;
      }
      var touch = event.changedTouches[0];
      productSheetTouchStart = { x: touch.clientX, y: touch.clientY };
    },
    { passive: true },
  );
  dialogArtwork.addEventListener(
    "touchend",
    function (event) {
      if (!productSheetTouchStart || !event.changedTouches.length) return;
      var touch = event.changedTouches[0],
        deltaY = touch.clientY - productSheetTouchStart.y,
        deltaX = touch.clientX - productSheetTouchStart.x;
      productSheetTouchStart = null;
      if (deltaY > 80 && Math.abs(deltaX) < 80) closeProductDialog();
    },
    { passive: true },
  );
  dialogArtwork.addEventListener("touchcancel", function () {
    productSheetTouchStart = null;
  });
  var promoDialog = $("promoDialog"),
    promoTrigger = $("promoTrigger"),
    promoDialogClose = $("promoDialogClose");
  if (promoDialog && promoTrigger && promoDialogClose) {
    promoTrigger.addEventListener("click", function () {
      promoDialog.showModal();
    });
    promoDialogClose.addEventListener("click", function () {
      promoDialog.close();
    });
    promoDialog.addEventListener("cancel", function (event) {
      event.preventDefault();
      promoDialog.close();
    });
    promoDialog.addEventListener("keydown", function (event) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      promoDialog.close();
    });
    promoDialog.addEventListener("click", function (event) {
      if (event.target === promoDialog) promoDialog.close();
    });
  }
  var productPhotos = {
    Affogato: "/images/products/affogato.jpg",
    "Ensaymada Cheesecake": "/images/products/ensaymada-cheesecake.jpg",
    "Iced Spanish Latte": "/images/products/iced-spanish-latte.jpg",
    Lemangonade: "/images/products/lemangonade.jpg",
    "Matcha Milkshake": "/images/products/matcha-milkshake.jpg",
    "Kold Brew (500 ml)": "/images/products/cutouts/kold-brew-cutout.webp",
  };
  function productArtwork(category, index, productName) {
    var photo = productPhotos[productName];
    if (!photo && category === "Coffee & Cocoa") {
      photo =
        productName === "Affogato"
          ? "/images/menu-affogato.jpg"
          : "/images/menu-coffee.jpg";
    } else if (!photo && category === "Whole Cakes") {
      photo = "/images/menu-cake.jpg";
    } else if (
      !photo &&
      category === "Miscellaneous" &&
      productName === "Midori Tea"
    ) {
      photo = "/images/menu-tea.jpg";
    } else if (!photo && category === "Miscellaneous") {
      photo = "/images/menu-lemonade.jpg";
    } else if (!photo) {
      photo = "/images/menu-pastry.jpg";
    }
    return (
      '<div class="item-art item-art-photo' +
      (productPhotos[productName] ? " item-art-photo-labeled" : "") +
      '" style="--art-bg:' +
      ["#f3e5d1", "#e6ecdf", "#f4e3e6", "#e1ebee"][index % 4] +
      '"><div class="product-photo-wrap"><img class="product-photo" src="' +
      photo +
      '" alt="' +
      productName +
      '" loading="lazy" /></div></div>'
    );
    /*
    var backgrounds = [
        "#f3e5d1",
        "#e6ecdf",
        "#f4e3e6",
        "#e1ebee",
        "#f1e4c8",
        "#e9e1d7",
        "#efe5dc",
      ],
      art;
    if (category === "Coffee & Cocoa") {
      art =
        '<ellipse cx="160" cy="148" rx="70" ry="9" fill="#28150b" opacity=".14"/>' +
        '<path d="M103 64h112l-8 75q-2 16-17 16h-62q-15 0-17-16z" fill="#f7f0e9" stroke="#d9c8b7" stroke-width="3"/>' +
        '<path d="M214 82h15c22 0 22 38 0 38h-13" fill="none" stroke="#e5d7ca" stroke-width="9"/>' +
        '<ellipse cx="159" cy="65" rx="56" ry="13" fill="#fffaf4" stroke="#d9c8b7" stroke-width="3"/>' +
        '<ellipse cx="159" cy="65" rx="47" ry="9" fill="#805035"/>' +
        '<path d="M159 72c-22-20-35 2 0 17 35-15 22-37 0-17zm0-6v22m-15-13 15 7 15-7" fill="#f3e6d3"/>' +
        '<rect x="134" y="106" width="51" height="22" rx="3" fill="#fff" opacity=".8"/>' +
        '<text x="159" y="116" text-anchor="middle" fill="#70452b" font-size="7" font-weight="700" letter-spacing="1">KRAFTED</text>' +
        '<text x="159" y="124" text-anchor="middle" fill="#70452b" font-size="6" letter-spacing="1">BREWS</text>';
    } else if (category === "Whole Cakes") {
      art =
        '<ellipse cx="160" cy="151" rx="55" ry="8" fill="#28150b" opacity=".14"/>' +
        '<path d="M119 37h82l10 107q-51 17-102 0z" fill="#bd926a" stroke="#8a6546" stroke-width="3"/>' +
        '<path d="M119 45h82M121 52h78" stroke="#8a6546" stroke-width="3"/>' +
        '<path d="M132 68h56v57h-56z" rx="4" fill="#f7f0e9"/>' +
        '<text x="160" y="83" text-anchor="middle" fill="#70452b" font-size="7" font-weight="700" letter-spacing="1">KRAFTED</text>' +
        '<text x="160" y="92" text-anchor="middle" fill="#28150b" font-size="7" font-weight="700">SINGLE ORIGIN</text>' +
        '<path d="M160 99c-13 11-2 20 0 21 3-2 13-10 0-21zm0 2v17" fill="#7c9070"/>' +
        '<path d="M128 145h64" stroke="#28150b" stroke-width="3"/>' +
        '<ellipse cx="223" cy="127" rx="13" ry="9" transform="rotate(-35 223 127)" fill="#6c4029"/>' +
        '<path d="M218 120q7 8 10 15" stroke="#d6b38d" stroke-width="2" fill="none"/>';
    } else if (category === "Miscellaneous") {
      art =
        '<ellipse cx="160" cy="151" rx="55" ry="8" fill="#28150b" opacity=".14"/>' +
        '<path d="M112 48h96l-12 94q-2 12-15 12h-42q-13 0-15-12z" fill="#ffffff" fill-opacity=".42" stroke="#dce8e7" stroke-width="4"/>' +
        '<path d="M119 80h82l-8 60q-2 9-12 9h-41q-10 0-12-9z" fill="#815033"/>' +
        '<path d="M149 48 158 24h9l-5 25" stroke="#f7f0e9" stroke-width="6" fill="none"/>' +
        '<path d="m133 70 17 14-3 18-17-14zm37 10 16-14 9 10-17 14z" fill="#eaf4f5" fill-opacity=".85" stroke="#fff" stroke-width="2"/>' +
        '<path d="M105 46h110v9H105z" fill="#e5f0f3" stroke="#c9d8db" stroke-width="2"/>' +
        '<rect x="137" y="108" width="48" height="24" rx="3" fill="#f7f0e9"/>' +
        '<text x="161" y="119" text-anchor="middle" fill="#70452b" font-size="6" font-weight="700" letter-spacing=".8">KRAFTED</text>' +
        '<text x="161" y="127" text-anchor="middle" fill="#70452b" font-size="6" letter-spacing="1">BREWS</text>';
    } else {
      var pastries = [
        '<path d="M83 117q14-49 61-42 12-20 32 0 44-5 61 42-19 28-77 20-58 8-77-20z" fill="#c9823d" stroke="#a8642d" stroke-width="3"/><path d="m119 91 19 41m6-48 18 51m10-43 13 42m9-35 13 29" stroke="#e9b46b" stroke-width="5" stroke-linecap="round"/>',
        '<path d="M104 99q0-30 30-30h52q30 0 30 30v41H104z" fill="#c78342" stroke="#a8642d" stroke-width="3"/><path d="M105 99q8-30 30-30h50q21 0 30 30" fill="#e8b36c" stroke="#a8642d" stroke-width="3"/><path d="M121 93q19-15 38 0t38 0" fill="none" stroke="#f6d69d" stroke-width="5"/>',
        '<circle cx="160" cy="109" r="48" fill="#c77d39" stroke="#a45f2d" stroke-width="3"/><path d="M160 77c-28 0-32 31-4 31s24 27 0 27-27-23-8-28" fill="none" stroke="#f0c27b" stroke-width="8" stroke-linecap="round"/><circle cx="132" cy="84" r="4" fill="#f6dfb4"/><circle cx="188" cy="130" r="4" fill="#f6dfb4"/>',
        '<circle cx="160" cy="108" r="48" fill="#b7773f" stroke="#8e572e" stroke-width="3"/><circle cx="137" cy="91" r="5" fill="#4a281b"/><circle cx="171" cy="84" r="6" fill="#4a281b"/><circle cx="185" cy="110" r="5" fill="#4a281b"/><circle cx="148" cy="124" r="6" fill="#4a281b"/><circle cx="175" cy="137" r="4" fill="#4a281b"/>',
        '<circle cx="160" cy="108" r="46" fill="#c9813e" stroke="#a8642d" stroke-width="3"/><circle cx="160" cy="108" r="27" fill="none" stroke="#f0c27b" stroke-width="11"/><circle cx="160" cy="108" r="12" fill="#9a5d30"/><circle cx="126" cy="85" r="4" fill="#8eaa6e"/><circle cx="194" cy="127" r="5" fill="#8eaa6e"/>',
        '<path d="M103 132 154 66q6-8 13 0l51 66q6 10-8 13h-99q-14-3-8-13z" fill="#f1d8a8" stroke="#c59d62" stroke-width="3"/><path d="M154 67q11 28 64 66" fill="none" stroke="#9c6238" stroke-width="7"/><path d="M111 133h98" stroke="#fff0d4" stroke-width="9"/><circle cx="162" cy="91" r="5" fill="#8d3c4b"/>',
        '<circle cx="160" cy="108" r="47" fill="#b97b48" stroke="#8e572e" stroke-width="3"/><circle cx="137" cy="91" r="5" fill="#4a281b"/><circle cx="172" cy="85" r="5" fill="#4a281b"/><circle cx="186" cy="111" r="5" fill="#4a281b"/><circle cx="148" cy="128" r="5" fill="#4a281b"/><path d="M132 116q28 25 56 0" fill="none" stroke="#d9a875" stroke-width="4"/>',
      ];
      art =
        '<ellipse cx="160" cy="151" rx="74" ry="9" fill="#28150b" opacity=".14"/>' +
        '<ellipse cx="160" cy="143" rx="80" ry="12" fill="#fffaf4" stroke="#e3d3c2" stroke-width="3"/>' +
        pastries[index % pastries.length];
    }
    return (
      '<div class="item-art" style="--art-bg:' +
      backgrounds[index % backgrounds.length] +
      '" aria-hidden="true"><svg viewBox="0 0 320 180" focusable="false">' +
      art +
      "</svg></div>"
    );
    */
  }
  var categoryPanels = new Map();
  function createMenuItem(c, i, m) {
    var d = document.createElement("article");
    d.className = "item";
    d.id =
      "menu-item-" +
      m[0]
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    d.style.animationDelay = i * 50 + "ms";
    var priceMarkup = m[1]
      ? '<span class="price">₱' + m[1] + "</span>"
      : "";
    d.innerHTML =
      productArtwork(c, i, m[0]) +
      '<div class="top"><h4>' +
      m[0] +
      "</h4>" +
      priceMarkup +
      "</div>" +
      (m[2] ? '<div class="notes">' + m[2] + "</div>" : "") +
      (m[3] ? '<div class="ing">' + m[3] + "</div>" : "");

    var openButton = document.createElement("button");
    openButton.className = "item-open-mobile";
    openButton.type = "button";
    openButton.setAttribute("aria-haspopup", "dialog");
    openButton.setAttribute("aria-controls", "menuProductDialog");
    openButton.innerHTML =
      '<span class="item-open-title-row"><span class="item-open-name">' +
      m[0] +
      "</span>" +
      priceMarkup +
      '</span><span class="item-open-meta-row"><span class="item-open-meta">' +
      (m[2] ? '<span class="item-open-notes">' + m[2] + "</span>" : "") +
      (m[2] && m[3] ? " · " : "") +
      (m[3] ? '<span class="item-open-ing">' + m[3] + "</span>" : "") +
      '</span><span class="item-open-hint">Tap to view</span></span>';
    openButton.addEventListener("click", function () {
      showProductDialog(c, i, m);
    });
    d.appendChild(openButton);

    var desktopOpenButton = document.createElement("button");
    desktopOpenButton.className = "item-open-desktop";
    desktopOpenButton.type = "button";
    desktopOpenButton.textContent = "View details";
    desktopOpenButton.setAttribute("aria-haspopup", "dialog");
    desktopOpenButton.setAttribute("aria-controls", "menuProductDialog");
    desktopOpenButton.setAttribute("aria-label", "View details for " + m[0]);
    desktopOpenButton.addEventListener("click", function () {
      showProductDialog(c, i, m);
    });
    d.appendChild(desktopOpenButton);

    if (!reduce) {
      d.addEventListener("pointermove", function (event) {
        if (event.pointerType !== "mouse") return;
        var bounds = d.getBoundingClientRect();
        var x = (event.clientX - bounds.left) / bounds.width - 0.5;
        var y = (event.clientY - bounds.top) / bounds.height - 0.5;
        d.style.setProperty("--card-tilt-x", (-y * 7).toFixed(2) + "deg");
        d.style.setProperty("--card-tilt-y", (x * 9).toFixed(2) + "deg");
        d.style.setProperty("--card-shift-x", (x * 3).toFixed(1) + "px");
        d.style.setProperty("--card-shift-y", (y * 3).toFixed(1) + "px");
      });
      d.addEventListener("pointerleave", function () {
        d.style.setProperty("--card-tilt-x", "0deg");
        d.style.setProperty("--card-tilt-y", "0deg");
        d.style.setProperty("--card-shift-x", "0px");
        d.style.setProperty("--card-shift-y", "0px");
      });
    }
    return d;
  }
  function showCat(c) {
    [].forEach.call(tabs.children, function (b) {
      b.setAttribute("aria-selected", b.dataset.c === c);
    });
    list.style.setProperty("--ac", ACC[c]);
    categoryPanels.forEach(function (panel, category) {
      panel.hidden = category !== c;
    });
  }
  window.navigateToProduct = function (category, productName) {
    if (!MENU[category]) return;
    showCat(category);
    var productId =
      "menu-item-" +
      productName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    requestAnimationFrame(function () {
      var product = $(productId);
      if (!product) return;
      product.scrollIntoView({
        behavior: reduce ? "auto" : "smooth",
        block: "center",
      });
      product.classList.add("product-highlight");
      setTimeout(function () {
        product.classList.remove("product-highlight");
      }, 1400);
    });
  };
  cats.forEach(function (c, i) {
    var b = document.createElement("button");
    b.className = "tab";
    b.textContent = c;
    b.dataset.c = c;
    b.style.setProperty("--ac", ACC[c]);
    b.setAttribute("role", "tab");
    b.tabIndex = i === 0 ? 0 : -1;
    b.onclick = function () {
      showCat(c);
      b.focus();
    };
    tabs.appendChild(b);
  });
  cats.forEach(function (category, categoryIndex) {
    var panel = document.createElement("section"),
      heading = document.createElement("h3");
    panel.className = "menu-category";
    panel.dataset.category = category;
    panel.setAttribute("aria-labelledby", "menu-category-" + categoryIndex);
    panel.style.setProperty("--ac", ACC[category]);
    heading.className = "menu-category-heading";
    heading.id = "menu-category-" + categoryIndex;
    heading.textContent = category;
    panel.appendChild(heading);
    MENU[category].forEach(function (product, productIndex) {
      panel.appendChild(createMenuItem(category, productIndex, product));
    });
    categoryPanels.set(category, panel);
    list.appendChild(panel);
  });
  tabs.addEventListener("keydown", function (e) {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    var buttons = Array.from(tabs.children),
      index = buttons.indexOf(document.activeElement),
      next =
        (index + (e.key === "ArrowRight" ? 1 : -1) + buttons.length) %
        buttons.length;
    buttons[next].click();
    buttons.forEach(function (button, i) {
      button.tabIndex = i === next ? 0 : -1;
    });
  });
  showCat(cats[0]);
  var featuredBrews = [
    {
      category: "Coffee & Cocoa",
      product: "Iced Spanish Latte",
      wordmark: "Iced Spanish Latte",
      notes: "Espresso · milk · condensed milk",
      cutout: "/images/products/cutouts/iced-spanish-latte.webp",
      cutoutAlt: "Iced Spanish Latte in a Krafted Brews cup",
      decoration: "beans",
    },
    {
      category: "Coffee & Cocoa",
      product: "Hiraya Latte",
      wordmark: "Hiraya Latte",
      notes: "House specialty latte",
      cutout: "/images/products/cutouts/hiraya-latte-cutout.webp",
      cutoutAlt: "Hiraya Latte in a Krafted Brews cup",
      decoration: "beans",
    },
    {
      category: "Miscellaneous",
      product: "Kold Brew (500 ml)",
      wordmark: "Kold Brew (500 ml)",
      notes: "Cold · ready-to-drink cold brew",
      cutout: "/images/products/cutouts/kold-brew-cutout.webp",
      cutoutAlt: "Krafted Brews Kold Brew bottle",
      decoration: "ice",
    },
    {
      category: "Miscellaneous",
      product: "Berry Soda",
      wordmark: "Berry Soda",
      notes: "Sparkling fruit soda · fresh blueberries",
      cutout: "/images/products/cutouts/berry-soda-cutout.webp",
      cutoutAlt: "Cup of Krafted Brews Berry Soda",
      decoration: "berries",
    },
    {
      category: "Coffee & Cocoa",
      product: "Caramel Macchiato",
      wordmark: "Caramel Macchiato",
      notes: "Espresso · milk · caramel",
      cutout: "/images/products/cutouts/caramel-macchiato-cutout.webp",
      cutoutAlt: "Krafted Brews caramel macchiato",
      decoration: "caramel",
    },
  ];
  var showcase = $("menuShowcase"),
    showcaseCategory = $("menuSlideCategory"),
    showcaseProduct = $("menuSlideProduct"),
    showcaseNotes = $("menuSlideNotes"),
    showcaseLink = $("menuSlideLink"),
    showcaseDots = $("menuSlideDots"),
    showcasePause = $("menuSlidePause"),
    showcaseWordmark = $("menuSlideWordmark"),
    showcaseCutout = $("menuSlideCutout"),
    featuredBrewIndex = 0,
    showcasePaused = reduce,
    showcaseVisible = false,
    showcaseHovered = false,
    showcaseFocused = false,
    swipeStartX = null,
    swipeStartY = null;
  featuredBrews.forEach(function (brew) {
    if (!brew.cutout) return;
    var image = new Image();
    image.decoding = "async";
    image.src = brew.cutout;
  });
  function showFeaturedBrew(index) {
    featuredBrewIndex =
      (index + featuredBrews.length) % featuredBrews.length;
    var brew = featuredBrews[featuredBrewIndex];
    showcase.dataset.slide = featuredBrewIndex;
    showcase.dataset.decoration = brew.decoration;
    showcaseCategory.textContent = brew.category;
    showcaseProduct.textContent = brew.product;
    showcaseNotes.textContent = brew.notes;
    showcaseWordmark.textContent = brew.wordmark;
    showcaseCutout.hidden = false;
    showcaseCutout.src = brew.cutout;
    showcaseCutout.alt = brew.cutoutAlt;
    showcase.setAttribute(
      "aria-label",
      "Featured Krafted Brews menu. Showing " +
        brew.product +
        ", slide " +
        (featuredBrewIndex + 1) +
        " of " +
        featuredBrews.length,
    );
    [].forEach.call(showcaseDots.children, function (dot, dotIndex) {
      dot.setAttribute("aria-pressed", dotIndex === featuredBrewIndex);
      dot.setAttribute("aria-current", dotIndex === featuredBrewIndex ? "true" : "false");
      dot.tabIndex = dotIndex === featuredBrewIndex ? 0 : -1;
    });
  }
  featuredBrews.forEach(function (brew, i) {
    var dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", "Show " + brew.product);
    dot.setAttribute("aria-pressed", i === featuredBrewIndex);
    dot.setAttribute("aria-current", i === featuredBrewIndex ? "true" : "false");
    dot.tabIndex = i === featuredBrewIndex ? 0 : -1;
    dot.onclick = function () {
      showFeaturedBrew(i);
      scheduleShowcaseRotation();
    };
    showcaseDots.appendChild(dot);
  });
  $("menuSlidePrev").onclick = function () {
    showFeaturedBrew(featuredBrewIndex - 1);
    scheduleShowcaseRotation();
  };
  $("menuSlideNext").onclick = function () {
    showFeaturedBrew(featuredBrewIndex + 1);
    scheduleShowcaseRotation();
  };
  showcasePause.setAttribute("aria-pressed", showcasePaused);
  showcasePause.textContent = showcasePaused ? "Play" : "Pause";
  showcasePause.setAttribute(
    "aria-label",
    showcasePaused ? "Resume carousel rotation" : "Pause carousel rotation",
  );
  showcasePause.onclick = function () {
    showcasePaused = !showcasePaused;
    showcasePause.setAttribute("aria-pressed", showcasePaused);
    showcasePause.textContent = showcasePaused ? "Play" : "Pause";
    showcasePause.setAttribute(
      "aria-label",
      showcasePaused ? "Resume carousel rotation" : "Pause carousel rotation",
    );
    scheduleShowcaseRotation();
  };
  showcaseLink.onclick = function (event) {
    event.preventDefault();
    var brew = featuredBrews[featuredBrewIndex];
    window.navigateToProduct(brew.category, brew.product);
  };
  showcase.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showFeaturedBrew(featuredBrewIndex - 1);
      scheduleShowcaseRotation();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      showFeaturedBrew(featuredBrewIndex + 1);
      scheduleShowcaseRotation();
    } else if (event.key === "Home") {
      event.preventDefault();
      showFeaturedBrew(0);
      scheduleShowcaseRotation();
    } else if (event.key === "End") {
      event.preventDefault();
      showFeaturedBrew(featuredBrews.length - 1);
      scheduleShowcaseRotation();
    }
  });
  showcase.addEventListener("pointerenter", function () {
    showcaseHovered = true;
  });
  showcase.addEventListener("pointerleave", function () {
    showcaseHovered = false;
  });
  showcase.addEventListener("focusin", function () {
    showcaseFocused = true;
  });
  showcase.addEventListener("focusout", function (event) {
    if (!showcase.contains(event.relatedTarget)) {
      showcaseFocused = false;
    }
  });
  showcase.addEventListener(
    "touchstart",
    function (event) {
      if (event.touches.length === 1) {
        swipeStartX = event.touches[0].clientX;
        swipeStartY = event.touches[0].clientY;
      }
    },
    { passive: true },
  );
  showcase.addEventListener(
    "touchend",
    function (event) {
      if (swipeStartX === null || !event.changedTouches.length) return;
      var endX = event.changedTouches[0].clientX;
      var endY = event.changedTouches[0].clientY;
      var deltaX = endX - swipeStartX;
      var deltaY = endY - swipeStartY;
      swipeStartX = null;
      swipeStartY = null;
      if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
        showFeaturedBrew(featuredBrewIndex + (deltaX < 0 ? 1 : -1));
        scheduleShowcaseRotation();
      }
    },
    { passive: true },
  );
  showFeaturedBrew(featuredBrewIndex);
  var showcaseTimer = null;
  function scheduleShowcaseRotation() {
    if (showcaseTimer) {
      clearInterval(showcaseTimer);
      showcaseTimer = null;
    }
    if (showcasePaused) return;
    showcaseTimer = setInterval(function () {
      if (
        !showcasePaused &&
        showcaseVisible &&
        !document.hidden
      ) {
        showFeaturedBrew(featuredBrewIndex + 1);
      }
    }, 5600);
  }
  scheduleShowcaseRotation();
  /* ---------- 3D helpers ---------- */
  var mobileFrameInterval = mobile3D ? 1000 / 30 : 0;
  function mk(cv) {
    var r = new T.WebGLRenderer({
      canvas: cv,
      antialias: true,
      alpha: true,
    });
    r.setPixelRatio(Math.min(devicePixelRatio || 1, mobile3D ? 1.35 : 2));
    r.outputColorSpace = T.SRGBColorSpace;
    r.toneMapping = T.ACESFilmicToneMapping;
    r.toneMappingExposure = 1.05;
    var s = new T.Scene(),
      c = new T.PerspectiveCamera(35, 1, 0.1, 100);
    if (!mobile3D) {
      var room = new RoomEnvironment();
      var pmrem = new T.PMREMGenerator(r);
      s.environment = pmrem.fromScene(room).texture;
      pmrem.dispose();
      room.dispose();
    }
    s.add(new T.HemisphereLight(0xffffff, 0xd9c7b0, 0.85));
    var d = new T.DirectionalLight(0xfff1dd, 0.95);
    d.position.set(3, 5, 4);
    s.add(d);
    var o = { r: r, s: s, c: c, w: 1, h: 1 };
    function fit() {
      var w = cv.clientWidth,
        h = cv.clientHeight;
      if (!w || !h) return;
      r.setSize(w, h, false);
      c.aspect = w / h;
      c.updateProjectionMatrix();
      o.w = w;
      o.h = h;
      o.onfit && o.onfit();
    }
    new ResizeObserver(fit).observe(cv);
    fit();
    return o;
  }
  function lat(pts, mat, seg) {
    return new T.Mesh(
      new T.LatheGeometry(
        pts.map(function (p) {
          return new T.Vector2(p[0], p[1]);
        }),
        seg || 48,
      ),
      mat,
    );
  }
  var ceramic = new T.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.25,
    metalness: 0,
    side: T.DoubleSide,
  });
  function artTex() {
    var c = document.createElement("canvas");
    c.width = c.height = 256;
    var x = c.getContext("2d");
    var g = x.createRadialGradient(128, 128, 10, 128, 128, 128);
    g.addColorStop(0, "#9a6238");
    g.addColorStop(1, "#5a3219");
    x.fillStyle = g;
    x.fillRect(0, 0, 256, 256);
    x.fillStyle = "#f4e4cc";
    for (var i = 0; i < 5; i++) {
      var k = 1 - i * 0.17,
        cy = 60 + i * 28;
      x.beginPath();
      x.moveTo(128, cy + 55 * k);
      x.bezierCurveTo(
        128 - 90 * k,
        cy - 5 * k,
        128 - 40 * k,
        cy - 40 * k,
        128,
        cy - 5 * k,
      );
      x.bezierCurveTo(
        128 + 40 * k,
        cy - 40 * k,
        128 + 90 * k,
        cy - 5 * k,
        128,
        cy + 55 * k,
      );
      x.globalAlpha = i % 2 ? 0.0 : 1;
      x.fill();
    }
    x.globalAlpha = 1;
    x.strokeStyle = "#5a3219";
    x.lineWidth = 3;
    x.beginPath();
    x.moveTo(128, 50);
    x.lineTo(128, 215);
    x.stroke();
    return new T.CanvasTexture(c);
  }
  function cup(tex) {
    var g = new T.Group();
    g.add(
      lat(
        [
          [0, 0],
          [0.4, 0],
          [0.46, 0.06],
          [0.82, 0.75],
          [0.92, 0.92],
          [0.86, 0.93],
          [0.8, 0.86],
          [0.7, 0.5],
          [0.35, 0.2],
          [0, 0.18],
        ],
        ceramic,
      ),
    );
    var h = new T.Mesh(
      new T.TorusGeometry(0.27, 0.065, 12, 24, Math.PI),
      ceramic,
    );
    h.position.set(0.86, 0.52, 0);
    h.rotation.z = -Math.PI / 2;
    g.add(h);
    var cf = new T.Mesh(
      new T.CircleGeometry(0.77, 48),
      new T.MeshStandardMaterial({
        map: tex || null,
        color: tex ? 0xffffff : 0x4a2412,
        roughness: 0.45,
      }),
    );
    cf.rotation.x = -Math.PI / 2;
    cf.position.y = 0.8;
    g.add(cf);
    var sc = lat(
      [
        [0, -0.06],
        [1.2, -0.06],
        [1.4, 0.02],
        [1.45, 0.05],
        [1.4, 0.04],
        [1.1, 0],
        [0, 0],
      ],
      ceramic,
      64,
    );
    sc.position.y = 0;
    g.add(sc);
    return g;
  }
  function makeCupLabel() {
    var canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 768;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#f7f0e9";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.roundRect(24, 24, 976, 720, 140);
    ctx.strokeStyle = "#e7d5c6";
    ctx.lineWidth = 10;
    ctx.stroke();
    ctx.textAlign = "center";
    ctx.fillStyle = "#643a24";
    ctx.font = "italic 54px Georgia, serif";
    ctx.fillText("COFFEE AND COCOA", 512, 182);
    ctx.font = '150px "Kaushan Script", cursive';
    ctx.fillText("krafted", 512, 372);
    ctx.font = '126px "Alfa Slab One", Georgia, serif';
    ctx.fillText("BREWS", 512, 522);
    ctx.font = "600 42px Arial, sans-serif";
    ctx.letterSpacing = "10px";
    ctx.fillText("EST 2019", 512, 642);
    var texture = new T.CanvasTexture(canvas);
    texture.colorSpace = T.SRGBColorSpace;
    var image = new Image();
    image.onload = function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      texture.needsUpdate = true;
    };
    image.onerror = function (error) {
      console.error("Could not load the cup label texture.", error);
    };
    image.src = "/images/krafted-cup-label.png";
    return texture;
  }

  function buildIcedCoffeeCup() {
    var cup = new T.Group();
    var drinkCanvas = document.createElement("canvas");
    drinkCanvas.width = 512;
    drinkCanvas.height = 512;
    var drinkContext = drinkCanvas.getContext("2d");
    var drinkGradient = drinkContext.createLinearGradient(0, 0, 0, 512);
    drinkGradient.addColorStop(0, "#d8b98f");
    drinkGradient.addColorStop(0.16, "#c79561");
    drinkGradient.addColorStop(0.42, "#a86e40");
    drinkGradient.addColorStop(0.74, "#75452b");
    drinkGradient.addColorStop(1, "#321c14");
    drinkContext.fillStyle = drinkGradient;
    drinkContext.fillRect(0, 0, drinkCanvas.width, drinkCanvas.height);
    for (var streak = 0; streak < 18; streak++) {
      var sx = 18 + streak * 29;
      drinkContext.beginPath();
      drinkContext.moveTo(sx, 0);
      drinkContext.bezierCurveTo(sx + 20, 150, sx - 18, 360, sx + 8, 512);
      drinkContext.strokeStyle =
        streak % 2 ? "rgba(255,235,205,.035)" : "rgba(50,22,12,.045)";
      drinkContext.lineWidth = 6 + (streak % 3) * 3;
      drinkContext.stroke();
    }
    var drinkTexture = new T.CanvasTexture(drinkCanvas);
    drinkTexture.colorSpace = T.SRGBColorSpace;

    var drink = new T.Mesh(
      new T.CylinderGeometry(0.735, 0.54, 1.94, 96, 2),
      new T.MeshStandardMaterial({
        map: drinkTexture,
        roughness: 0.34,
        metalness: 0,
      }),
    );
    drink.position.y = -0.1;
    cup.add(drink);
    var crema = new T.Mesh(
      new T.CircleGeometry(0.728, 96),
      new T.MeshStandardMaterial({
        color: 0xc38d5f,
        roughness: 0.5,
      }),
    );
    crema.rotation.x = -Math.PI / 2;
    crema.position.y = 0.875;
    cup.add(crema);

    var iceMaterial = new T.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.75,
      roughness: 0.12,
      transmission: 0.08,
      thickness: 0.4,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
    });
    [
      [-0.34, 0.95, 0.16, 0.1],
      [0, 0.98, -0.08, -0.18],
      [0.34, 0.94, 0.1, 0.12],
    ].forEach(function (position) {
      var ice = new T.Mesh(
        new RoundedBoxGeometry(0.24, 0.24, 0.21, 4, 0.04),
        iceMaterial,
      );
      ice.position.set(position[0], position[1], position[2]);
      ice.rotation.set(position[3], position[3] * 0.7, position[3] * 0.5);
      cup.add(ice);
    });

    var labelMaterial = new T.MeshStandardMaterial({
      map: makeCupLabel(),
      transparent: true,
      alphaTest: 0.02,
      depthWrite: false,
      roughness: 0.82,
      side: T.DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: -1,
    });
    var label = new T.Mesh(
      new T.CylinderGeometry(0.75, 0.65, 0.94, 96, 1, true, -0.8, 1.6),
      labelMaterial,
    );
    label.position.y = 0.03;
    cup.add(label);

    var glassMaterial = new T.MeshPhysicalMaterial({
      color: 0xe7f3f6,
      transparent: true,
      opacity: 0.16,
      roughness: 0.045,
      metalness: 0.01,
      transmission: 0.46,
      thickness: 0.08,
      ior: 1.33,
      clearcoat: 1,
      clearcoatRoughness: 0.025,
      side: T.DoubleSide,
      depthWrite: false,
    });
    var glass = lat(
      [
        [0, -1.12],
        [0.535, -1.12],
        [0.565, -1.18],
        [0.585, -1.2],
        [0.605, -1.16],
        [0.81, 1.1],
        [0.84, 1.17],
        [0.79, 1.18],
        [0.755, 1.12],
        [0.555, -1.04],
        [0, -1.04],
      ],
      glassMaterial,
      96,
    );
    glass.renderOrder = 3;
    cup.add(glass);
    var baseRing = new T.Mesh(
      new T.TorusGeometry(0.585, 0.018, 12, 96),
      glassMaterial,
    );
    baseRing.rotation.x = Math.PI / 2;
    baseRing.position.y = -1.17;
    cup.add(baseRing);

    var lidMaterial = new T.MeshPhysicalMaterial({
      color: 0xe5f0f3,
      transparent: true,
      opacity: 0.34,
      roughness: 0.055,
      metalness: 0.02,
      transmission: 0.48,
      thickness: 0.08,
      ior: 1.34,
      clearcoat: 1,
      clearcoatRoughness: 0.025,
      side: T.DoubleSide,
      depthWrite: false,
    });
    var lid = lat(
      [
        [0, 0],
        [0.68, 0],
        [0.76, 0.025],
        [0.83, 0.045],
        [0.87, 0.085],
        [0.88, 0.12],
        [0.86, 0.15],
        [0.81, 0.15],
        [0.78, 0.11],
        [0.72, 0.09],
        [0, 0.09],
      ],
      lidMaterial,
      96,
    );
    lid.position.y = 1.14;
    cup.add(lid);
    [0.85, 0.73].forEach(function (radius, index) {
      var rim = new T.Mesh(
        new T.TorusGeometry(radius, index === 0 ? 0.023 : 0.012, 12, 96),
        lidMaterial,
      );
      rim.rotation.x = Math.PI / 2;
      rim.position.y = index === 0 ? 1.24 : 1.265;
      cup.add(rim);
    });

    var dropletMaterial = new T.MeshPhysicalMaterial({
      color: 0xeaf7fb,
      transparent: true,
      opacity: 0.58,
      roughness: 0.04,
      metalness: 0,
      clearcoat: 1,
    });
    [
      [-1.04, 0.84, 0.022],
      [-0.9, 0.59, 0.017],
      [1.02, 0.7, 0.026],
      [0.91, 0.2, 0.018],
      [-1.12, -0.08, 0.02],
      [1.08, -0.53, 0.024],
      [-0.98, -0.79, 0.018],
      [0.92, -0.91, 0.02],
      [-1.2, 0.37, 0.014],
      [1.18, -0.12, 0.015],
    ].forEach(function (drop) {
      var y = drop[1];
      var radius = 0.585 + ((y + 1.2) / 2.37) * 0.255 + 0.012;
      var bead = new T.Mesh(
        new T.SphereGeometry(drop[2], 12, 10),
        dropletMaterial,
      );
      bead.position.set(
        Math.sin(drop[0]) * radius,
        y,
        Math.cos(drop[0]) * radius,
      );
      bead.scale.y = 1.45;
      cup.add(bead);
    });
    return cup;
  }

  function buildFeaturedFlatWhite() {
    var g = new T.Group(),
      paper = new T.MeshStandardMaterial({
        color: 0xf7f0e9,
        roughness: 0.48,
        side: T.DoubleSide,
      });
    g.add(
      lat(
        [
          [0, -0.95],
          [0.52, -0.95],
          [0.57, -0.88],
          [0.74, 0.64],
          [0.76, 0.78],
          [0.69, 0.81],
          [0.66, 0.68],
          [0.5, -0.82],
          [0, -0.82],
        ],
        paper,
        64,
      ),
    );
    var coffee = new T.Mesh(
      new T.CircleGeometry(0.67, 48),
      new T.MeshStandardMaterial({ color: 0x4a2718, roughness: 0.35 }),
    );
    coffee.rotation.x = -Math.PI / 2;
    coffee.position.y = 0.77;
    g.add(coffee);
    var latteArt = new T.Mesh(
      new T.CircleGeometry(0.47, 48),
      new T.MeshStandardMaterial({ map: artTex(), roughness: 0.45 }),
    );
    latteArt.rotation.x = -Math.PI / 2;
    latteArt.position.y = 0.782;
    g.add(latteArt);
    var rim = new T.Mesh(
      new T.TorusGeometry(0.72, 0.035, 12, 64),
      paper,
    );
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.79;
    g.add(rim);
    var label = new T.Mesh(
      new T.PlaneGeometry(1.02, 0.72),
      new T.MeshBasicMaterial({
        map: makeCupLabel(),
        transparent: true,
        alphaTest: 0.02,
        side: T.DoubleSide,
      }),
    );
    label.position.set(0, -0.06, 0.7);
    label.renderOrder = 2;
    g.add(label);
    return g;
  }

  /* ---------- interactive landing cup ---------- */
  var H = mk($("heroCv")),
    heroScene = new T.Group(),
    heroCup = new T.Group(),
    heroRotation = { x: 0, y: -0.16, velocity: 0 },
    heroDragging = false,
    heroLast = { x: 0, y: 0 },
    heroCamDistance = 7.2,
    heroCamTarget = 7.2;
  heroCup.add(buildIcedCoffeeCup());
  heroScene.add(heroCup);
  H.s.add(heroScene);
  H.c.position.set(0, 1.7, heroCamDistance);
  H.c.lookAt(0, -0.3, 0);
  H.onfit = function () {
    var compact = H.w / H.h < 0.9;
    heroCup.scale.setScalar(compact ? 0.93 : 1.04);
    heroCamDistance = heroCamTarget = 7.2;
  };
  H.onfit();
  var heroCanvas = $("heroCv");
  heroCanvas.addEventListener("pointerdown", function (event) {
    heroDragging = true;
    heroLast.x = event.clientX;
    heroLast.y = event.clientY;
    heroCanvas.setPointerCapture(event.pointerId);
  });
  heroCanvas.addEventListener("pointermove", function (event) {
    if (!heroDragging) return;
    var dx = event.clientX - heroLast.x;
    var dy = event.clientY - heroLast.y;
    heroRotation.velocity = dx * 0.008;
    heroRotation.y += heroRotation.velocity;
    heroRotation.x = Math.max(
      -0.32,
      Math.min(0.32, heroRotation.x + dy * 0.004),
    );
    heroLast.x = event.clientX;
    heroLast.y = event.clientY;
  });
  function stopHeroDrag() {
    heroDragging = false;
  }
  heroCanvas.addEventListener("pointerup", stopHeroDrag);
  heroCanvas.addEventListener("pointercancel", stopHeroDrag);
  heroCanvas.addEventListener(
    "wheel",
    function (event) {
      event.preventDefault();
      heroCamTarget = Math.min(
        7.2,
        Math.max(4.1, heroCamTarget + event.deltaY * 0.004),
      );
    },
    { passive: false },
  );

  var koldBrewTexture = null,
    koldBrewCapTexture = null,
    koldBrewModelTemplate = null;
  function buildKoldBrewBottle() {
    if (koldBrewModelTemplate) return koldBrewModelTemplate.clone(true);

    var bottle = new T.Group();
    var profile = [
      [0.35, 0],
      [0.43, 0.05],
      [0.49, 0.14],
      [0.52, 0.28],
      [0.53, 1.62],
      [0.51, 1.82],
      [0.46, 1.98],
      [0.39, 2.14],
      [0.32, 2.3],
      [0.29, 2.48],
      [0.29, 2.68],
      [0.29, 2.74],
      [0.29, 2.78],
      [0.29, 3.02],
      [0.27, 3.06],
    ];
    var shellProfile = [[0, 0]].concat(
      profile.filter(function (point) {
        return point[1] <= 2.74;
      }),
      [[0, 2.74]],
    );
    var shellMaterial = new T.MeshPhysicalMaterial({
      color: 0xd8e7ed,
      transparent: true,
      opacity: 0.22,
      roughness: 0.12,
      transmission: 0.16,
      thickness: 0.08,
      ior: 1.33,
      clearcoat: 1,
      clearcoatRoughness: 0.04,
      side: T.DoubleSide,
      depthWrite: false,
    });
    bottle.add(lat(shellProfile, shellMaterial, 72));
    bottle.add(
      lat(
        [
          [0, 0.12],
          [0.36, 0.12],
          [0.45, 0.18],
          [0.49, 0.3],
          [0.49, 1.6],
          [0.48, 1.84],
          [0.43, 1.99],
          [0.36, 2.08],
          [0, 2.08],
        ],
        new T.MeshStandardMaterial({
          color: 0x32170f,
          roughness: 0.32,
        }),
        72,
      ),
    );

    if (!koldBrewCapTexture) {
      var capCanvas = document.createElement("canvas");
      capCanvas.width = 256;
      capCanvas.height = 64;
      var capContext = capCanvas.getContext("2d");
      capContext.fillStyle = "#14151d";
      capContext.fillRect(0, 0, capCanvas.width, capCanvas.height);
      for (var rib = 0; rib < 64; rib++) {
        capContext.fillStyle = rib % 2 ? "#242630" : "#090a10";
        capContext.fillRect(rib * 4, 0, 2, 45);
      }
      capContext.fillStyle = "#20212a";
      capContext.fillRect(0, 46, capCanvas.width, 12);
      capContext.fillStyle = "#08090f";
      capContext.fillRect(0, 58, capCanvas.width, 2);
      capContext.fillStyle = "#30313a";
      capContext.fillRect(0, 61, capCanvas.width, 1);
      koldBrewCapTexture = new T.CanvasTexture(capCanvas);
      koldBrewCapTexture.colorSpace = T.SRGBColorSpace;
    }
    var capMaterial = new T.MeshStandardMaterial({
      map: koldBrewCapTexture,
      roughness: 0.34,
      metalness: 0.04,
    });
    bottle.add(
      lat(
        [
          [0.25, 2.72],
          [0.27, 2.735],
          [0.29, 2.77],
          [0.29, 2.98],
          [0.28, 3.015],
          [0.27, 3.03],
        ],
        capMaterial,
        64,
      ),
    );
    var capTop = new T.Mesh(
      new T.CylinderGeometry(0.27, 0.27, 0.016, 64),
      new T.MeshStandardMaterial({ color: 0x171820, roughness: 0.38 }),
    );
    capTop.position.y = 3.03;
    bottle.add(capTop);

    [
      [0.29, 2.705, 0.012],
      [0.43, 0.14, 0.018],
      [0.48, 0.29, 0.012],
    ].forEach(function (ring) {
      var rim = new T.Mesh(
        new T.TorusGeometry(ring[0], ring[2], 8, 64),
        shellMaterial,
      );
      rim.rotation.x = Math.PI / 2;
      rim.position.y = ring[1];
      bottle.add(rim);
    });

    if (!koldBrewTexture) {
      koldBrewTexture = new T.TextureLoader().load(
        "/images/products/cutouts/kold-brew-3d.webp",
        function (texture) {
          texture.colorSpace = T.SRGBColorSpace;
          if (H) {
            texture.anisotropy = Math.min(
              8,
              H.r.capabilities.getMaxAnisotropy(),
            );
          }
        },
        undefined,
        function (error) {
          console.error("Could not load the Kold Brew product texture.", error);
        },
      );
      koldBrewTexture.colorSpace = T.SRGBColorSpace;
    }

    var photoSegments = 72,
      photoRows = 112,
      photoHeight = 3.06,
      photoArc = Math.PI * 2,
      positions = [],
      uvs = [],
      indices = [];
    function radiusAt(y) {
      for (var index = 1; index < profile.length; index++) {
        if (y <= profile[index][1]) {
          var lower = profile[index - 1],
            upper = profile[index],
            t = (y - lower[1]) / (upper[1] - lower[1]);
          return lower[0] + (upper[0] - lower[0]) * t;
        }
      }
      return profile[profile.length - 1][0];
    }
    for (var row = 0; row <= photoRows; row++) {
      var v = row / photoRows,
        y = v * photoHeight,
        radius = radiusAt(y) + 0.008;
      for (var column = 0; column <= photoSegments; column++) {
        var u = column / photoSegments,
          angle = (u - 0.5) * photoArc;
        positions.push(
          Math.sin(angle) * radius,
          y,
          Math.cos(angle) * radius,
        );
        uvs.push(u, v);
      }
    }
    for (var rowIndex = 0; rowIndex < photoRows; rowIndex++) {
      for (var columnIndex = 0; columnIndex < photoSegments; columnIndex++) {
        var lowerLeft = rowIndex * (photoSegments + 1) + columnIndex,
          lowerRight = lowerLeft + 1,
          upperLeft = lowerLeft + photoSegments + 1,
          upperRight = upperLeft + 1;
        indices.push(
          lowerLeft,
          lowerRight,
          upperLeft,
          lowerRight,
          upperRight,
          upperLeft,
        );
      }
    }
    var photoGeometry = new T.BufferGeometry();
    photoGeometry.setAttribute(
      "position",
      new T.Float32BufferAttribute(positions, 3),
    );
    photoGeometry.setAttribute("uv", new T.Float32BufferAttribute(uvs, 2));
    photoGeometry.setIndex(indices);
    photoGeometry.computeVertexNormals();
    var photo = new T.Mesh(
      photoGeometry,
      new T.MeshBasicMaterial({
        map: koldBrewTexture,
        transparent: true,
        alphaTest: 0.02,
        depthWrite: false,
        side: T.FrontSide,
        toneMapped: false,
      }),
    );
    photo.renderOrder = 2;
    bottle.add(photo);

    bottle.scale.setScalar(1.15);
    koldBrewModelTemplate = bottle;
    return bottle.clone(true);
  }

  /* ---------- featured products ---------- */
  var PRODUCTS = [
    {
      n: "Flat white",
      d: "Latte art, crema and ceramic",
      build: function () {
        var g = new T.Group();
        var hotCup = cup(artTex());
        var hotLabel = new T.Mesh(
          new T.CylinderGeometry(0.79, 0.55, 0.52, 96, 1, true, -0.8, 1.6),
          new T.MeshStandardMaterial({
            map: makeCupLabel(),
            transparent: true,
            alphaTest: 0.02,
            depthWrite: false,
            roughness: 0.82,
            side: T.DoubleSide,
            polygonOffset: true,
            polygonOffsetFactor: -1,
          }),
        );
        hotLabel.position.y = 0.48;
        hotCup.add(hotLabel);
        g.add(hotCup);
        g.position.y = -0.5;
        g.scale.setScalar(1.5);
        return g;
      },
      hot: [
        [
          0,
          1.25,
          0,
          "Latte art",
          "Velvety microfoam over a double ristretto. Look closely for the rosetta pour.",
        ],
        [
          0.95,
          0.55,
          0.3,
          "Roast level",
          "Medium roast. Notes of toasted hazelnut and brown sugar.",
        ],
        [
          -0.5,
          0.4,
          0.8,
          "Milk options",
          "Whole, oat, almond or soy. Oat is our barista favourite.",
        ],
      ],
    },
    {
      n: "Key Lime Pie",
      d: "Citrus filling, graham crust and cream",
      build: function () {
        var g = new T.Group();
        var crust = new T.Mesh(
          new T.CylinderGeometry(1.38, 1.38, 0.28, 64),
          new T.MeshStandardMaterial({
            color: 0x9a5d32,
            roughness: 0.72,
          }),
        );
        crust.position.y = -0.32;
        g.add(crust);

        var filling = new T.Mesh(
          new T.CylinderGeometry(1.24, 1.24, 0.46, 64),
          new T.MeshStandardMaterial({
            color: 0xe3ad17,
            roughness: 0.48,
          }),
        );
        filling.position.y = 0.02;
        g.add(filling);

        var cream = new T.MeshStandardMaterial({
          color: 0xfff4dc,
          roughness: 0.65,
        });
        for (var i = 0; i < 10; i++) {
          var angle = (i / 10) * Math.PI * 2;
          var dollop = new T.Mesh(
            new T.SphereGeometry(0.13, 16, 12),
            cream,
          );
          dollop.position.set(
            Math.cos(angle) * 1.02,
            0.34,
            Math.sin(angle) * 1.02,
          );
          dollop.scale.y = 1.25;
          g.add(dollop);
        }

        var lime = new T.Mesh(
          new T.CylinderGeometry(0.28, 0.28, 0.025, 32),
          new T.MeshStandardMaterial({
            color: 0x87a62a,
            roughness: 0.45,
          }),
        );
        lime.rotation.z = Math.PI / 2;
        lime.position.set(0.82, 0.42, 0);
        g.add(lime);

        var spoke = new T.MeshStandardMaterial({
          color: 0x7e4b2c,
          roughness: 0.7,
        });
        for (var slice = 0; slice < 8; slice++) {
          var spokeAngle = (slice / 8) * Math.PI * 2;
          var spokeMesh = new T.Mesh(
            new T.BoxGeometry(1.08, 0.018, 0.018),
            spoke,
          );
          spokeMesh.position.y = 0.255;
          spokeMesh.rotation.y = -spokeAngle;
          spokeMesh.position.x = Math.cos(spokeAngle) * 0.54;
          spokeMesh.position.z = Math.sin(spokeAngle) * 0.54;
          g.add(spokeMesh);
        }

        g.rotation.x = 0.72;
        g.position.y = -0.12;
        g.scale.setScalar(1.05);
        return g;
      },
      hot: [
        [
          0.8,
          0.2,
          0.5,
          "Key lime filling",
          "Smooth, bright citrus filling with a balanced sweet-tart finish.",
        ],
        [
          0,
          0.6,
          0.4,
          "Graham crust",
          "Buttery, toasted crust made for the chilled lime filling.",
        ],
        [
          -0.7,
          0.4,
          0.5,
          "Whipped cream",
          "Light cream piped around the edge for a soft finish.",
        ],
      ],
    },
    {
      n: "Kold Brew",
      d: "500 ml ready-to-drink cold brew bottle",
      build: buildKoldBrewBottle,
      hot: [
        [
          0,
          0.5,
          0.5,
          "500 ml bottle",
          "Ready-to-drink cold brew.",
        ],
        [
          0,
          1.25,
          0.5,
          "BLACK | STRONG",
          "The product label shown on the bottle.",
        ],
        [
          0,
          1.95,
          0.45,
          "Krafted Brews",
          "Original branding preserved from the product image.",
        ],
      ],
    },
    {
      n: "Ethiopia Guji beans",
      d: "250 g retail bag",
      build: function () {
        var g = new T.Group();
        var c = document.createElement("canvas");
        c.width = 256;
        c.height = 380;
        var x = c.getContext("2d");
        x.fillStyle = "#FAF7F2";
        x.fillRect(0, 0, 256, 380);
        x.fillStyle = "#28150B";
        x.fillRect(0, 300, 256, 80);
        x.fillStyle = "#000";
        x.textAlign = "center";
        x.font = "64px 'Kaushan Script',cursive";
        x.fillText("krafted", 128, 110);
        x.font = "40px 'Alfa Slab One',serif";
        x.fillText("BREWS", 128, 156);
        x.fillStyle = "#28150B";
        x.font = "500 13px Outfit,sans-serif";
        x.fillText("S P E C I A L T Y   C O F F E E   H O U S E", 128, 184);
        x.fillStyle = "#E5E5E5";
        x.fillRect(40, 205, 176, 1);
        x.fillStyle = "#28150B";
        x.font = "600 22px Outfit,sans-serif";
        x.fillText("ETHIOPIA GUJI", 128, 245);
        x.font = "14px Outfit,sans-serif";
        x.fillText("Blueberry · Jasmine · Black tea", 128, 270);
        x.fillStyle = "#fff";
        x.font = "600 14px Outfit,sans-serif";
        x.fillText("LIGHT ROAST  250 g", 128, 345);
        var tx = new T.CanvasTexture(c);
        tx.colorSpace = T.SRGBColorSpace;
        var bm = new T.MeshStandardMaterial({
          color: 0xfaf7f2,
          roughness: 0.7,
        });
        var box = new T.Mesh(new T.BoxGeometry(1.7, 2.5, 0.7), bm);
        g.add(box);
        var label = new T.Mesh(
          new T.PlaneGeometry(1.68, 2.48),
          new T.MeshBasicMaterial({ map: tx, side: T.DoubleSide }),
        );
        label.position.z = 0.356;
        g.add(label);
        var top = new T.Mesh(
          new T.BoxGeometry(1.72, 0.28, 0.76),
          new T.MeshStandardMaterial({ color: 0x28150b, roughness: 0.6 }),
        );
        top.position.y = 1.3;
        g.add(top);
        var tab = new T.Mesh(
          new T.BoxGeometry(1.2, 0.05, 0.12),
          new T.MeshStandardMaterial({ color: 0x6b5f57 }),
        );
        tab.position.set(0, 1.46, 0);
        g.add(tab);
        return g;
      },
      hot: [
        [
          0,
          0.4,
          0.4,
          "Packaging",
          "Resealable kraft-lined bag with a one-way degassing valve.",
        ],
        [
          -0.5,
          -0.4,
          0.4,
          "Origin notes",
          "Guji, Ethiopia. Washed process, grown at 2,000 m.",
        ],
        [
          0.6,
          1.3,
          0.4,
          "Roast level",
          "Light roast. Roasted in small batches the week you buy it.",
        ],
      ],
    },
  ];
  window.showHeroReceiptProduct = function (index) {
    if (!heroCup) return;
    while (heroCup.children.length) {
      heroCup.remove(heroCup.children[0]);
    }
    var object;
    if (index === 1) {
      object = PRODUCTS[1].build();
    } else if (index === 2) {
      object = PRODUCTS[2].build();
    } else {
      object = buildIcedCoffeeCup();
    }
    object.updateMatrixWorld(true);
    var bounds = new T.Box3().setFromObject(object);
    var center = bounds.getCenter(new T.Vector3());
    object.position.sub(center);
    heroCup.add(object);
  };
  /* ---------- loop ---------- */
  var vis = { h: true };
  var loopPending = false;
  function scheduleLoop() {
    if (loopPending || document.hidden || !vis.h) return;
    loopPending = true;
    requestAnimationFrame(loop);
  }
  new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      vis.h = entry.isIntersecting;
      scheduleLoop();
    });
  }).observe($("hero"));
  new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      showcaseVisible = entry.isIntersecting;
    });
  }).observe(showcase);
  var last3DFrame = 0;
  function loop() {
    loopPending = false;
    if (document.hidden || !vis.h) return;
    var now = performance.now();
    if (mobileFrameInterval && now - last3DFrame < mobileFrameInterval) {
      scheduleLoop();
      return;
    }
    last3DFrame = now;
    if (vis.h) {
      if (!heroDragging) {
        heroRotation.velocity *= 0.94;
        heroRotation.y += heroRotation.velocity + (reduce ? 0 : 0.002);
      }
      heroScene.rotation.set(heroRotation.x, heroRotation.y, 0);
      heroCamDistance += (heroCamTarget - heroCamDistance) * 0.1;
      H.c.position.set(0, 1.7, heroCamDistance);
      H.c.lookAt(0, -0.3, 0);
      H.r.render(H.s, H.c);
      if (!reduce && !mobile3D) {
        heroBeans.forEach(function (bean) {
          var depth = Number(bean.dataset.depth) || 1;
          bean.style.setProperty(
            "--bean-offset-x",
            (mouse.x * depth * 16).toFixed(1) + "px",
          );
          bean.style.setProperty(
            "--bean-offset-y",
            (mouse.y * depth * 12).toFixed(1) + "px",
          );
        });
      }
    }
    scheduleLoop();
  }
  document.addEventListener("visibilitychange", scheduleLoop);
  scheduleLoop();

  /* ---------- magnetic + tilt ---------- */
  document.querySelectorAll(".mag").forEach(function (el) {
    el.addEventListener("pointermove", function (e) {
      var r = el.getBoundingClientRect();
      el.style.transform =
        "translate(" +
        (e.clientX - r.left - r.width / 2) * 0.22 +
        "px," +
        (e.clientY - r.top - r.height / 2) * 0.3 +
        "px)";
    });
    el.addEventListener("pointerleave", function () {
      el.style.transform = "";
    });
  });
  document.querySelectorAll(".gcard").forEach(function (el, i) {
    el.style.transform = "translateZ(" + i * 8 + "px)";
    el.addEventListener("pointermove", function (e) {
      var r = el.getBoundingClientRect(),
        x = (e.clientX - r.left) / r.width - 0.5,
        y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform =
        "translateZ(40px) rotateY(" +
        x * 16 +
        "deg) rotateX(" +
        -y * 16 +
        "deg) translate(" +
        x * 8 +
        "px," +
        y * 8 +
        "px)";
    });
    el.addEventListener("pointerleave", function () {
      el.style.transform = "translateZ(" + i * 8 + "px)";
    });
  });
  addEventListener("pointermove", function (e) {
    if (reduce) return;
    document.querySelectorAll(".cards .gcard").forEach(function (el, i) {
      if (!el.matches(":hover")) {
        el.style.transform =
          "translateZ(" +
          i * 8 +
          "px) rotateY(" +
          mouse.x * 5 +
          "deg) rotateX(" +
          -mouse.y * 4 +
          "deg)";
      }
    });
  });

  /* ---------- hours + map ---------- */
  var HRS = [
      ["Monday – Friday", "7:00 am – 7:00 pm"],
      ["Saturday", "8:00 am – 8:00 pm"],
      ["Sunday", "8:00 am – 5:00 pm"],
    ],
    dow = new Date().getDay(),
    ti = dow === 0 ? 2 : dow === 6 ? 1 : 0;
  $("hours").innerHTML = HRS.map(function (h, i) {
    return (
      "<tr" +
      (i === ti ? ' class="today"' : "") +
      "><td>" +
      h[0] +
      (i === ti ? " (today)" : "") +
      "</td><td>" +
      h[1] +
      "</td></tr>"
    );
  }).join("");
  var mapFrame = $("mapFrame"),
    mz = 16;
  function mapz(d) {
    mz = Math.min(20, Math.max(11, mz + d));
    mapFrame.src =
      "https://www.google.com/maps?q=16.4010444%2C121.1110396&z=" +
      mz +
      "&output=embed";
  }
  $("mp").onclick = function () {
    mapz(1);
  };
  $("mm").onclick = function () {
    mapz(-1);
  };

  /* ---------- chat ---------- */
  var chat = $("chat"),
    log = $("log");
  function say(t, w) {
    var d = document.createElement("div");
    d.className = "m " + w;
    d.textContent = t;
    log.appendChild(d);
    log.scrollTop = log.scrollHeight;
  }
  function reply(q) {
    q = q.toLowerCase();
    if (/hour|open|close|time/.test(q))
      return "We’re open 7 am – 7 pm on weekdays, 8 am – 8 pm on Saturdays and 8 am – 5 pm on Sundays.";
    if (/where|address|locat|direction|find/.test(q))
      return "You’ll find us at Krafted Brews Kafe in Bambang, Nueva Vizcaya, Philippines. The Get directions button in the Visit us section opens the exact map pin.";
    if (/wifi|wi-fi|work|laptop|study|seat|pet|dog/.test(q))
      return "Yes to Wi-Fi, power at every table and a quiet upstairs workspace. Pets are welcome on the patio.";
    if (/pastry|food|eat|croissant|cookie|bun/.test(q))
      return "Our butter croissant is baked fresh each morning, and the cardamom bun pairs well with a flat white.";
    if (/ice|cold|iced|cool/.test(q))
      return "Try the 18-hour cold brew. It’s chocolatey and smooth. For something lighter, the sparkling cold brew is a good fit.";
    if (/sweet|dessert|sugar/.test(q))
      return "The honey oat latte is our sweetest pick. A cardamom bun on the side makes it a treat.";
    if (/strong|bold|kick|caffeine/.test(q))
      return "Go for a cortado, or a double ristretto flat white. Both are rich and strong.";
    if (/fruit|light|bright|tea|floral|pour/.test(q))
      return "Ethiopia Guji by hand pour. It tastes of blueberry and jasmine, and it’s very clean.";
    if (/milk|oat|vegan|dairy|almond|soy/.test(q))
      return "We offer oat, almond, soy and whole milk. Oat is our favourite for lattes.";
    if (/recommend|suggest|drink|best|menu|what/.test(q))
      return "Tell me what you like: sweet, strong, fruity or iced? I’ll pick something for you.";
    if (/hi|hello|hey/.test(q))
      return "Hello! I can help with drinks, hours or finding us.";
    return "I’m not sure about that one. I can help with drinks, hours, seating and directions.";
  }
  function send(t) {
    t = t.trim();
    if (!t) return;
    say(t, "u");
    setTimeout(function () {
      say(reply(t), "b");
    }, 380);
    $("ci").value = "";
  }
  [
    "Recommend a drink",
    "Opening hours",
    "Where are you?",
    "Is there Wi-Fi?",
  ].forEach(function (c) {
    var b = document.createElement("button");
    b.textContent = c;
    b.onclick = function () {
      send(c);
    };
    $("chips").appendChild(b);
  });
  $("cs").onclick = function () {
    send($("ci").value);
  };
  $("ci").addEventListener("keydown", function (e) {
    if (e.key === "Enter") send($("ci").value);
  });
  var greeted = false;
  function tog(o) {
    chat.classList.toggle("open", o);
    $("chatTab").style.display = o ? "none" : "";
    $("chatTab").setAttribute("aria-expanded", o);
    if (o) {
      if (!greeted) {
        say("Welcome to Krafted Brews! What can I help you find today?", "b");
        greeted = true;
      }
      $("ci").focus();
    }
  }
  $("chatTab").onclick = function () {
    tog(true);
  };
  $("cx").onclick = function () {
    tog(false);
  };
})();
