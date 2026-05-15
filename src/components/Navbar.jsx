import Icon from "./Icon";
import styles from "../styles";
import Search from "./Search.jsx";

export default function Navbar({
  onHomeClick,
  onLoginClick,
  userAvatar,
  onAvatarClick,
}) {
  const showSignIn = !userAvatar && typeof onLoginClick === "function";
  const isLoggedIn = Boolean(userAvatar);
  
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
        <Search />

        {isLoggedIn && (
          <button style={styles.iconBtn} aria-label="Notifications" type="button">
            <Icon name="bell" />
          </button>
        )}

        {isLoggedIn && (
          <div
            style={{ ...styles.avatarSmall, cursor: "pointer" }}
            aria-label="Your profile"
            role="button"
            tabIndex={0}
            onClick={onAvatarClick}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                onAvatarClick?.();
              }
            }}
          >
            {userAvatar}
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
