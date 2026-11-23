import { useRef, useState } from "react";

const promoImages = [
  {
    src: "/images/promo/promo-1.png",
    alt: "Customer celebrating a Match Your Bill win in a maroon shirt.",
  },
  {
    src: "/images/promo/promo-2.png",
    alt: "Customer holding a winning receipt during the Match Your Bill promotion.",
  },
  {
    src: "/images/promo/promo-3.png",
    alt: "Customer celebrating the Match Your Bill challenge in a yellow cardigan.",
  },
  {
    src: "/images/promo/promo-4.png",
    alt: "Customer showing a receipt beside the Match Your Bill timer.",
  },
  {
    src: "/images/promo/promo-5.png",
    alt: "Customer celebrating a Match Your Bill win in a red shirt.",
  },
];

const galleryImages = [
  {
    src: "/images/gallery/gallery-1.png",
    alt: "Krafted Brews storefront",
    caption: "Find your way to Krafted",
  },
  {
    src: "/images/gallery/gallery-2.png",
    alt: "The welcoming entrance to the Krafted Brews cafe",
    caption: "Come on in",
  },
  {
    src: "/images/gallery/gallery-3.png",
    alt: "Krafted Brews sign, coffee, and leafy decor",
    caption: "A little Krafted character",
  },
  {
    src: "/images/gallery/gallery-4.png",
    alt: "Books and greenery inside the cafe",
    caption: "Settle into a cozy corner",
  },
  {
    src: "/images/gallery/gallery-5.png",
    alt: "Colorful cactus cups on the cafe counter",
    caption: "The little details",
  },
  {
    src: "/images/gallery/gallery-6.png",
    alt: "Framed coffee-themed wall art",
    caption: "Made for coffee lovers",
  },
  {
    src: "/images/gallery/gallery-7.png",
    alt: "Botanical artwork on the cafe wall",
    caption: "A thoughtful touch",
  },
  {
    src: "/images/gallery/gallery-8.png",
    alt: "A cup of coffee served beside a book",
    caption: "Pause for a proper cup",
  },
  {
    src: "/images/gallery/gallery-9.png",
    alt: "A bag of Krafted Brews coffee beans",
    caption: "Take Krafted home",
  },
];

function GalleryCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const swipeStartX = useRef(null);
  const count = galleryImages.length;

  function moveBy(step) {
    setActiveIndex((current) => (current + step + count) % count);
  }

  function startSwipe(event) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if (event.target instanceof Element && event.target.closest("button")) return;

    swipeStartX.current = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function finishSwipe(event) {
    if (swipeStartX.current === null) return;

    const distance = event.clientX - swipeStartX.current;
    swipeStartX.current = null;
    if (Math.abs(distance) > 40) {
      moveBy(distance < 0 ? 1 : -1);
    }
  }

  return (
    <div
      className="gallery-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label="Krafted Brews gallery"
    >
      <article
        className="instagram-post"
        aria-label="Krafted Brews Instagram-style post"
      >
        <header className="instagram-post-header">
          <span className="instagram-avatar" aria-hidden="true">
            <img src="/images/krafted-brews-header-logo.png" alt="" />
          </span>
          <div className="instagram-account">
            <strong>kraftedbrews</strong>
            <span>Bambang, Nueva Vizcaya</span>
          </div>
          <span className="instagram-more" aria-hidden="true">
            ···
          </span>
        </header>
        <div
          className="instagram-photo-window"
          role="group"
          aria-roledescription="slide"
          aria-label={`Photo ${activeIndex + 1} of ${count}: ${galleryImages[activeIndex].caption}`}
          onPointerDown={startSwipe}
          onPointerUp={finishSwipe}
          onPointerCancel={() => {
            swipeStartX.current = null;
          }}
        >
          <div
            className="instagram-photo-track"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {galleryImages.map((image, index) => (
              <figure
                className="instagram-photo-slide"
                key={image.src}
                aria-hidden={index !== activeIndex}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  loading={index === activeIndex ? "eager" : "lazy"}
                  decoding="async"
                  draggable="false"
                />
              </figure>
            ))}
          </div>
          <button
            className="instagram-photo-arrow instagram-photo-previous"
            type="button"
            aria-label="Previous photo"
            onClick={() => moveBy(-1)}
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m14.5 5.5-6.5 6.5 6.5 6.5" />
            </svg>
          </button>
          <button
            className="instagram-photo-arrow instagram-photo-next"
            type="button"
            aria-label="Next photo"
            onClick={() => moveBy(1)}
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m9.5 5.5 6.5 6.5-6.5 6.5" />
            </svg>
          </button>
        </div>
        <footer className="instagram-post-footer">
          <div className="instagram-post-actions" aria-hidden="true">
            <span>♡</span>
            <span>◯</span>
            <span>➤</span>
            <span className="instagram-bookmark">▱</span>
          </div>
          <div
            className="instagram-photo-dots"
            role="group"
            aria-label="Choose a gallery photo"
          >
            {galleryImages.map((image, index) => (
              <button
                key={image.src}
                type="button"
                aria-label={`Show photo ${index + 1} of ${count}`}
                aria-current={index === activeIndex ? "true" : undefined}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
          <p className="instagram-post-caption" aria-live="polite">
            <strong>kraftedbrews</strong> {galleryImages[activeIndex].caption}
          </p>
        </footer>
      </article>
    </div>
  );
}

export default function App() {
  return (
    <>
      <div className="scroll-progress" id="scrollProgress" aria-hidden="true" />
      <div className="cursor-dot" id="cursorDot" aria-hidden="true" />
      <nav>
        <a
          className="logo header-brand"
          href="#hero"
          style={{ "--s": "20px" }}
          aria-label="Krafted Brews home"
        >
          <span className="brand-mark-frame" aria-hidden="true">
            <img
              className="brand-mark"
              src="/images/krafted-brews-header-logo.png"
              alt=""
            />
          </span>
          <span className="header-brand-copy">
            <span className="w">
              <span className="script">krafted</span>
              <span className="slab">BREWS</span>
            </span>
            <small className="header-brand-tagline">Specialty Coffee House</small>
          </span>
        </a>
        <span className="mobile-branch-label">
          <span>Bambang, Nueva Vizcaya</span>
          <span>Branch</span>
        </span>
        <ul id="primaryNav">
          <li>
            <a href="#menu">
              <svg className="mobile-nav-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 8h16l-1.3 11H5.3L4 8Z" />
                <path d="M8 8a4 4 0 0 1 8 0M20 11h1a2 2 0 0 1 0 4h-2" />
              </svg>
              <span>Menu</span>
            </a>
          </li>
          <li>
            <a href="#gallery">
              <svg
                className="mobile-nav-icon"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <rect x="4" y="5" width="13" height="15" rx="1.5" />
                <path d="m5.5 17 3.2-3.5a1.2 1.2 0 0 1 1.8 0l2 2.2 1.2-1.2a1.2 1.2 0 0 1 1.8 0l.5.5" />
                <circle cx="8.5" cy="9" r="1" />
                <path d="M8 2.5h11.5a2 2 0 0 1 2 2V17" />
              </svg>
              <span>Gallery</span>
            </a>
          </li>
          <li>
            <a href="/our-story.html" id="storyLink">
              <svg className="mobile-nav-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 6.5c-2.2-1.7-5-2-8-1.5v13c3-.5 5.8-.2 8 1.5m0-13c2.2-1.7 5-2 8-1.5v13c-3-.5-5.8-.2-8 1.5m0-13v13" />
              </svg>
              <span>Our Story</span>
            </a>
          </li>
          <li>
            <a href="#visit">
              <svg className="mobile-nav-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
                <circle cx="12" cy="10" r="2.2" />
              </svg>
              <span>Visit us</span>
            </a>
          </li>
        </ul>
        <a className="btn mag" style={{ padding: "10px 20px" }} href="#visit">
          Find our café
        </a>
        <button
          className="promo-ticket"
          id="promoTrigger"
          type="button"
          aria-label="Open the Match Your Bill promo for 50% off"
          aria-controls="promoDialog"
          title="See the Match Your Bill promo"
        >
          <span className="promo-ticket-symbol" aria-hidden="true">%</span>
          <span className="promo-ticket-copy">
            <span>PROMO</span>
            <strong>50% OFF</strong>
          </span>
        </button>
      </nav>

      <header id="hero">
        <div className="hero-beans" aria-hidden="true">
          <span className="hero-bean hero-bean-one" data-depth="1.1" />
          <span className="hero-bean hero-bean-two" data-depth="0.7" />
          <span className="hero-bean hero-bean-three" data-depth="1.35" />
          <span className="hero-bean hero-bean-four" data-depth="0.85" />
          <span className="hero-bean hero-bean-five" data-depth="1.2" />
          <span className="hero-bean hero-bean-six" data-depth="0.6" />
          <span className="hero-bean hero-bean-seven" data-depth="1" />
          <span className="hero-bean hero-bean-eight" data-depth="0.8" />
          <span className="hero-bean hero-bean-nine" data-depth="0.9" />
          <span className="hero-bean hero-bean-ten" data-depth="1.25" />
          <span className="hero-bean hero-bean-eleven" data-depth="0.7" />
          <span className="hero-bean hero-bean-twelve" data-depth="1.1" />
        </div>
        <div className="hero-copy" id="hc">
          <h1>
            <span className="script">Crafted slowly.</span> Poured with
            purpose.
          </h1>
          <div className="cards">
            <a className="gcard" href="#menu">
              <b>Explore Menu</b>
              <span>Espresso, pour-overs, cold brews and pastries</span>
            </a>
            <a className="gcard" href="#visit">
              <b>Find Our Café</b>
              <span>Hours, seating and directions</span>
            </a>
            <a className="gcard" href="/our-story.html">
              <b>Our Story</b>
              <span>Meet the people and purpose behind every cup</span>
            </a>
          </div>
        </div>
        <div className="hero-feature">
          <figure className="hero-product">
            <canvas
              id="heroCv"
              aria-label="Interactive 3D Krafted Brews product"
            />
            <figcaption className="hero-3d-hint">
              Drag to rotate · scroll to zoom
            </figcaption>
          </figure>
          <div className="hero-feature-side">
            <span className="hero-feature-brand logo" style={{ "--s": "28px" }}>
              <span className="w">
                <span className="script">krafted</span>
                <span className="slab">BREWS</span>
              </span>
              <small>Specialty Coffee House</small>
            </span>
            <aside className="hero-receipt-card" aria-label="Featured Krafted Brews selections">
              <div className="hero-receipt-toolbar" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <div className="hero-receipt-stage">
                <article className="hero-receipt is-active" data-receipt="0" aria-live="polite">
                  <p className="hero-receipt-kicker">Crafted daily</p>
                  <div className="hero-receipt-art hero-receipt-art-cup" aria-hidden="true">
                    <span className="receipt-cup-lid" />
                    <span className="receipt-cup-body">
                      <b>krafted</b>
                      <small>BREWS</small>
                    </span>
                  </div>
                  <h2>Caffè Latte</h2>
                  <div className="hero-receipt-divider" aria-hidden="true">••••••••••••••••••••••••••••••</div>
                  <dl>
                    <div><dt>Roast</dt><dd>Medium</dd></div>
                    <div><dt>Milk</dt><dd>Steamed</dd></div>
                  </dl>
                  <div className="hero-receipt-barcode" aria-hidden="true" />
                  <p className="hero-receipt-thanks">Thank you!</p>
                </article>
                <article className="hero-receipt" data-receipt="1" aria-hidden="true">
                  <p className="hero-receipt-kicker">Baked warm</p>
                  <div className="hero-receipt-art hero-receipt-art-pie" aria-hidden="true">
                    <span className="receipt-pie">
                      <b />
                    </span>
                  </div>
                  <h2>Key Lime Pie</h2>
                  <div className="hero-receipt-divider" aria-hidden="true">••••••••••••••••••••••••••••••</div>
                  <dl>
                    <div><dt>Filling</dt><dd>Lime</dd></div>
                    <div><dt>Top</dt><dd>Cream</dd></div>
                  </dl>
                  <div className="hero-receipt-barcode" aria-hidden="true" />
                  <p className="hero-receipt-thanks">See you soon!</p>
                </article>
                <article className="hero-receipt" data-receipt="2" aria-hidden="true">
                  <p className="hero-receipt-kicker">Cold & bold</p>
                  <div className="hero-receipt-art hero-receipt-art-bottle" aria-hidden="true">
                    <img
                      src="/images/products/cutouts/kold-brew-cutout.webp"
                      alt=""
                      width="374"
                      height="1000"
                      loading="lazy"
                      decoding="async"
                      draggable="false"
                    />
                  </div>
                  <h2>Kold Brew</h2>
                  <div className="hero-receipt-divider" aria-hidden="true">••••••••••••••••••••••••••••••</div>
                  <dl>
                    <div><dt>Serve</dt><dd>Cold</dd></div>
                    <div><dt>Size</dt><dd>500 ml</dd></div>
                  </dl>
                  <div className="hero-receipt-barcode" aria-hidden="true" />
                  <p className="hero-receipt-thanks">Stay refreshed!</p>
                </article>
              </div>
              <div className="hero-receipt-controls" role="group" aria-label="Choose featured selection">
                <button type="button" className="is-active" data-receipt-dot="0" aria-label="Show Caffè Latte" aria-pressed="true" />
                <button type="button" data-receipt-dot="1" aria-label="Show Key Lime Pie" aria-pressed="false" />
                <button type="button" data-receipt-dot="2" aria-label="Show Kold Brew" aria-pressed="false" />
              </div>
            </aside>
            <div className="hero-receipt-actions" aria-label="Choose a Krafted Brews product">
              <button
                type="button"
                className="hero-receipt-action is-active"
                data-receipt-action="0"
                data-category="Coffee & Cocoa"
                data-product="Caffè Latte"
              >
                <span>Caffè Latte</span>
              </button>
              <button
                type="button"
                className="hero-receipt-action"
                data-receipt-action="1"
                data-category="Pastries"
                data-product="Key Lime Pie (1 slice)"
              >
                <span>Key Lime Pie</span>
              </button>
              <button
                type="button"
                className="hero-receipt-action"
                data-receipt-action="2"
                data-category="Miscellaneous"
                data-product="Kold Brew (500 ml)"
              >
                <span>Kold Brew</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <dialog
        className="promo-dialog"
        id="promoDialog"
        aria-labelledby="promoDialogTitle"
      >
        <div className="promo-dialog-heading">
          <div>
            <p className="promo-eyebrow">A little surprise</p>
            <h2 id="promoDialogTitle">
              <span className="script">Match your bill.</span>
              <br />
              Get <span className="promo-highlight">50% off</span>.
            </h2>
          </div>
          <button
            className="menu-dialog-close"
            id="promoDialogClose"
            type="button"
            aria-label="Close promo"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <p className="promo-dialog-copy">
          One try per receipt. Match the timer to your bill and get{" "}
          <span className="promo-highlight">50% off</span> your order.
        </p>
        <ul
          className="promo-dialog-gallery"
          aria-label="Photos from the Match Your Bill promotion"
        >
          {promoImages.map((image) => (
            <li key={image.src}>
              <img
                src={image.src}
                alt={image.alt}
                width="768"
                height="960"
                loading="lazy"
                decoding="async"
              />
            </li>
          ))}
        </ul>
      </dialog>

      <section id="menu">
        <div
          className="menu-showcase"
          id="menuShowcase"
          data-slide="0"
          data-decoration="beans"
          role="region"
          aria-roledescription="carousel"
          aria-label="Featured Krafted Brews menu"
        >
          <span className="menu-showcase-badge">BEST SELLER</span>
          <div className="menu-showcase-wordmark" aria-hidden="true">
            <span id="menuSlideWordmark">Iced Spanish Latte</span>
          </div>
          <span className="menu-scatter menu-scatter-one" aria-hidden="true" />
          <span className="menu-scatter menu-scatter-two" aria-hidden="true" />
          <span className="menu-scatter menu-scatter-three" aria-hidden="true" />
          <span className="menu-scatter menu-scatter-four" aria-hidden="true" />
          <img
            id="menuSlideCutout"
            className="menu-showcase-cutout"
            alt=""
            decoding="async"
            hidden
          />
          <div className="menu-showcase-caption" aria-live="polite">
            <p id="menuSlideCategory">Coffee &amp; Cocoa</p>
            <h2 id="menuSlideProduct">Iced Spanish Latte</h2>
            <span id="menuSlideNotes">
              Espresso · milk · condensed milk
            </span>
            <a id="menuSlideLink" href="#menuList">
              Explore the menu <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div className="menu-showcase-controls" aria-label="Carousel controls">
            <button id="menuSlidePrev" type="button" aria-label="Previous featured brew">
              ←
            </button>
            <div
              className="menu-showcase-dots"
              id="menuSlideDots"
              role="group"
              aria-label="Choose a featured brew"
            />
            <button id="menuSlideNext" type="button" aria-label="Next featured brew">
              →
            </button>
            <button
              className="menu-showcase-pause"
              id="menuSlidePause"
              type="button"
              aria-pressed="false"
              aria-label="Pause carousel rotation"
            >
              Pause
            </button>
          </div>
        </div>
        <div className="wrap">
          <h2>
            <span className="script">Menu</span>
          </h2>
          <p className="lead">
            Everything is made to order. Tasting notes first, because that is
            how we choose too.
          </p>
          <div className="tabs" role="tablist" id="tabs" />
          <div className="menu" id="menuList" role="tabpanel" />
        </div>
        <dialog
          className="menu-product-dialog"
          id="menuProductDialog"
          aria-labelledby="menuDialogTitle"
        >
          <span className="menu-dialog-handle" aria-hidden="true" />
          <div className="menu-dialog-artwork">
            <button
              className="menu-dialog-close"
              id="menuDialogClose"
              type="button"
              aria-label="Close product details"
            >
              <span aria-hidden="true">×</span>
            </button>
            <div id="menuDialogArtwork">
              <button
                className="menu-dialog-view-image"
                id="menuDialogViewImage"
                type="button"
                aria-haspopup="dialog"
              >
                <span>View full image</span>
              </button>
            </div>
          </div>
          <div className="menu-dialog-info">
            <div className="top">
              <h2 id="menuDialogTitle" />
              <span className="price" id="menuDialogPrice" />
            </div>
            <div
              className="menu-dialog-options"
              id="menuDialogOptions"
              role="group"
              aria-label="Choose a serving option"
              hidden
            />
            <div className="menu-dialog-tags" id="menuDialogTags" />
            <p className="notes" id="menuDialogNotes" />
            <p className="ing" id="menuDialogIng" />
            <a className="menu-dialog-best-seller" id="menuDialogBestSeller" href="#menuShowcase">
              <span>Best Sellers</span>
              <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div
            className="menu-dialog-products"
            id="menuDialogProducts"
            role="group"
            aria-label="Browse products"
          />
        </dialog>
        <dialog
          className="menu-full-image-dialog"
          id="menuFullImageDialog"
          aria-label="Full product image"
        >
          <button
            className="menu-dialog-close menu-full-image-close"
            id="menuFullImageClose"
            type="button"
            aria-label="Close full image"
          >
            <span aria-hidden="true">×</span>
          </button>
          <img id="menuFullImage" alt="" decoding="async" />
        </dialog>
      </section>

      <section className="gallery" id="gallery" aria-labelledby="galleryHeading">
        <div className="wrap">
          <div className="gallery-heading">
            <p>Inside Krafted Brews</p>
            <h2 id="galleryHeading">
              <span className="script">A little taste</span> of our cafe.
            </h2>
            <span className="gallery-intro">
              From the cafe corners to the cups we craft, take a look around.
            </span>
          </div>
          <GalleryCarousel />
        </div>
      </section>

      <section
        className="home-story"
        id="home-story"
        aria-labelledby="homeStoryHeading"
      >
        <div className="wrap home-story-grid">
          <div className="home-story-heading">
            <p className="home-story-eyebrow">Our Story</p>
            <h2 id="homeStoryHeading">
              <span className="script">Every cup</span>
              <br />
              made with care.
            </h2>
          </div>
          <div className="home-story-copy">
            <p>
              There is nothing quite like enjoying that perfect cup of coffee.
              We operate Krafted Brews with the ultimate goal of always
              providing each customer with exactly that. With great-tasting
              coffee from around the world — from intense aromas to creamy
              textures — we are here to show you that our coffee can cure all
              your tension. One sip at a time.
            </p>
            <p>
              At Krafted Brews, we provide you with delightfully delicious
              coffee which is prepared specially for each and every customer.
            </p>
            <a className="btn ghost home-story-link" href="/our-story.html">
              Read our story <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>

      <section id="visit">
        <div className="wrap split">
          <div>
            <h2>Visit us</h2>
            <p className="lead" style={{ marginBottom: "8px" }}>
              A bright corner café with a long oak bar, plenty of plants and a
              roaster humming behind the glass.
            </p>
            <p style={{ margin: 0 }}>
              <b>C426+FFM</b>
              <br />
              Bambang, Nueva Vizcaya, Philippines
            </p>
            <table className="hours" id="hours" />
            <ul className="amen">
              <li>Free Wi-Fi</li>
              <li>Power at every table</li>
              <li>Quiet workspace</li>
              <li>Pet-friendly patio</li>
              <li>Beans to take home</li>
            </ul>
            <a
              className="btn mag"
              id="dir"
              target="_blank"
              rel="noopener noreferrer"
              href="https://maps.app.goo.gl/JNLtBioHa1uUWpMcA"
            >
              Get directions
            </a>
          </div>
          <div className="map" id="map">
            <iframe
              id="mapFrame"
              title="Map to Krafted Brews Kafe, Bambang, Nueva Vizcaya"
              src="https://www.google.com/maps?q=16.4010444%2C121.1110396&z=16&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <div className="mapctl">
              <button id="mp" aria-label="Zoom map in">
                +
              </button>
              <button id="mm" aria-label="Zoom map out">
                −
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <a className="logo" href="#hero" style={{ "--s": "30px" }}>
          <span className="w">
            <span className="script">krafted</span>
            <span className="slab">BREWS</span>
          </span>
          <small>Specialty Coffee House</small>
        </a>
        <nav className="footer-social" aria-label="Social media">
          <a
            href="https://www.instagram.com/kraftedbrews"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow Krafted Brews on Instagram"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" />
            </svg>
          </a>
          <a
            href="https://web.facebook.com/kraftedbrews"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow Krafted Brews on Facebook"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M14 8h3V4h-3c-3.3 0-5 2-5 5v3H6v4h3v5h4v-5h3l1-4h-4V9c0-.7.3-1 1-1Z" />
            </svg>
          </a>
        </nav>
        <p>© Krafted Conglomerate Corporation</p>
      </footer>

      <button id="chatTab" aria-expanded="false" aria-controls="chat">
        Let’s Chat!
      </button>
      <aside id="chat" aria-label="Café concierge">
        <div className="ch">
          <div>
            <b>Café concierge</b>
            <div style={{ fontSize: "13px", opacity: 0.8 }}>
              Ask about drinks, hours or where we are
            </div>
          </div>
          <button id="cx" aria-label="Close chat">
            ×
          </button>
        </div>
        <div id="log" />
        <div className="chips" id="chips" />
        <form id="cf" onSubmit={(event) => event.preventDefault()}>
          <input
            id="ci"
            placeholder="Type your question"
            aria-label="Message"
          />
          <button id="cs" type="button">
            Send
          </button>
        </form>
      </aside>
    </>
  );
}
