import { useState } from "react";
import Icon from "./Icon";
import styles from "../styles";
import Search from "./Search";

/* inject mobile styles once */
if (!document.head.querySelector("[data-navbar-mobile]")) {
  const tag = document.createElement("style");
  tag.setAttribute("data-navbar-mobile", "1");
  tag.innerHTML = `
    .navbar-links { display: flex; }
    .navbar-brand-text { display: inline; }
    .hamburger-btn { display: none; }

    @media (max-width: 640px) {
      .navbar-links { display: none !important; }
      .navbar-brand-text { display: none !important; }
      .hamburger-btn { display: flex !important; }
      .mobile-menu {
        position: absolute;
        top: 58px;
        left: 0;
        right: 0;
        background: white;
        border-bottom: 1px solid rgba(0,0,0,0.08);
        display: flex;
        flex-direction: column;
        padding: 8px 0;
        z-index: 100;
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      }
      .mobile-menu-item {
        padding: 14px 24px;
        font-size: 14px;
        color: #6B6B6B;
        cursor: pointer;
        border: none;
        background: none;
        text-align: left;
        font-family: inherit;
      }
      .mobile-menu-item:hover {
        background: #FAFAF7;
        color: #1A1A1A;
      }
    }
  `;
  document.head.appendChild(tag);
}

export default function Navbar({
  onHomeClick, onEventsClick, onCalendarClick, onAboutClick,
  onLoginClick, onHelpClick, userAvatar, onAvatarClick, onLogoutClick,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const showSignIn = !userAvatar && typeof onLoginClick === "function";
  const isLoggedIn = Boolean(userAvatar);
  const showLogout = isLoggedIn && typeof onLogoutClick === "function";

  function closeMenu() { setMenuOpen(false); }

  return (
    <header style={{ ...styles.navbar, position: "relative" }}>
      <div style={styles.brand} onClick={onHomeClick}>
        <span style={styles.brandLogo}>S</span>
        <span className="navbar-brand-text">Career Center Volunteer</span>
      </div>

      <nav style={styles.navLinks} className="navbar-links">
        <span style={{ ...styles.navLink, cursor: onEventsClick ? "pointer" : "default" }} onClick={onEventsClick}>Events</span>
        <span style={{ ...styles.navLink, cursor: onCalendarClick ? "pointer" : "default" }} onClick={onCalendarClick}>Calendar</span>
        <span style={{ ...styles.navLink, cursor: onAboutClick ? "pointer" : "default" }} onClick={onAboutClick}>About</span>
        <span style={{ ...styles.navLink, cursor: onHelpClick ? "pointer" : "default" }} onClick={onHelpClick}>Help</span>
      </nav>

      <div style={styles.navIcons}>
        {/* Hamburger button — mobile only */}
        <button
          className="hamburger-btn"
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: "none",
            alignItems: "center",
            justifyContent: "center",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "22px",
            color: "#1A1A1A",
            padding: "4px 8px",
          }}
          aria-label="Menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        <Search onEventsClick={onEventsClick} />

        {isLoggedIn && (
          <button style={styles.iconBtn} aria-label="Notifications" type="button">
            <Icon name="bell" />
          </button>
        )}

        {isLoggedIn && (
          <div
            style={{ ...styles.avatarSmall, cursor: "pointer" }}
            aria-label="Your profile" role="button" tabIndex={0}
            onClick={onAvatarClick}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onAvatarClick?.(); }}
          >
            {userAvatar}
          </div>
        )}

        {showLogout && (
          <button style={styles.navLogoutBtn} onClick={onLogoutClick} type="button">
            <Icon name="logout" size={14} /> Log out
          </button>
        )}

        {showSignIn && (
          <button style={styles.signInBtn} onClick={onLoginClick} type="button">
            Sign in
          </button>
        )}
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <button className="mobile-menu-item" onClick={() => { onEventsClick?.(); closeMenu(); }}>Events</button>
          <button className="mobile-menu-item" onClick={() => { onCalendarClick?.(); closeMenu(); }}>Calendar</button>
          <button className="mobile-menu-item" onClick={() => { onAboutClick?.(); closeMenu(); }}>About</button>
          <button className="mobile-menu-item" onClick={() => { onHelpClick?.(); closeMenu(); }}>Help</button>
        </div>
      )}
    </header>
  );
}