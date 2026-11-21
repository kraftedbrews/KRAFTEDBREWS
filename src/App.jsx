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
          <span className="w">
            <span className="script">krafted</span>
            <span className="slab">BREWS</span>
          </span>
        </a>
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
        </div>
        <div className="hero-copy" id="hc">
          <h1>
            <span className="script">Crafted slowly</span>. Poured with
            purpose.
          </h1>
          <p>
            Small-lot beans, roasted in the morning and brewed by hand. Pull up
            a chair and stay a while.
          </p>
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
              aria-label="Interactive 3D Krafted Brews iced coffee cup"
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
                  <div className="hero-receipt-art hero-receipt-art-cold" aria-hidden="true">
                    <span className="receipt-cold-cup">
                      <b />
                      <i />
                    </span>
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

      <section id="menu">
        <div
          className="menu-showcase"
          id="menuShowcase"
          data-slide="0"
          role="region"
          aria-roledescription="carousel"
          aria-label="Featured Krafted Brews menu"
        >
          <div className="menu-showcase-wordmark" aria-hidden="true">
            <span id="menuSlideWordmark">Caffè Latte</span>
          </div>
          <span className="menu-bean menu-bean-one" aria-hidden="true" />
          <span className="menu-bean menu-bean-two" aria-hidden="true" />
          <span className="menu-bean menu-bean-three" aria-hidden="true" />
          <span className="menu-bean menu-bean-four" aria-hidden="true" />
          <canvas
            id="menuCv"
            className="menu-showcase-cup"
            aria-label="Rotating 3D featured Krafted Brews product"
          />
          <div className="menu-showcase-caption" aria-live="polite">
            <p id="menuSlideCategory">Coffee &amp; Cocoa</p>
            <h2 id="menuSlideProduct">Caffè Latte</h2>
            <span id="menuSlideNotes">
              Hot or iced · espresso and steamed milk
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
              <li>Quiet workspace upstairs</li>
              <li>Pet-friendly patio</li>
              <li>Beans to take home</li>
            </ul>
            <a
              className="btn mag"
              id="dir"
              target="_blank"
              rel="noopener noreferrer"
              href="https://maps.app.goo.gl/5yyUrr1eUbEy13Cc9"
            >
              Get directions
            </a>
          </div>
          <div className="map" id="map">
            <iframe
              id="mapFrame"
              title="Map to C426+FFM, Bambang, Nueva Vizcaya"
              src="https://www.google.com/maps?q=C426%2BFFM%2C+Bambang%2C+Nueva+Vizcaya&z=16&output=embed"
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
