import Icon from "./Icon";
import styles from "../styles";

export default function Navbar({
  onHomeClick,
  onLoginClick,
  avatarInitials,
}) {
  const showSignIn = !avatarInitials && typeof onLoginClick === "function";
  const isLoggedIn = Boolean(avatarInitials);

  return (
    <header style={styles.navbar}>
      <div style={styles.brand} onClick={onHomeClick}>
        <span style={styles.brandLogo}>S</span>
        <span>Career Center Volunteer</span>
      </div>

      <nav style={styles.navLinks}>
        <span style={styles.navLink}>Events</span>
        <span style={styles.navLink}>Calendar</span>
        <span style={styles.navLink}>About</span>
        <span style={styles.navLink}>Help</span>
      </nav>

      <div style={styles.navIcons}>
        <button style={styles.iconBtn} aria-label="Search" type="button">
          <Icon name="search" />
        </button>

        {isLoggedIn && (
          <button style={styles.iconBtn} aria-label="Notifications" type="button">
            <Icon name="bell" />
          </button>
        )}

        {isLoggedIn && (
          <div style={styles.avatarSmall} aria-label="Your profile">
            {avatarInitials}
          </div>
        )}

        {showSignIn && (
          <button style={styles.signInBtn} onClick={onLoginClick} type="button">
            Sign in
          </button>
        )}
      </div>
    </header>
  );
}
