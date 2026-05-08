import styles from "../styles";

export default function Navbar({ onLoginClick, onHomeClick }) {
  return (
    <div style={styles.header}>
      <div style={styles.headerTitle} onClick={onHomeClick}>
        CAREER CENTER VOLUNTEER
      </div>
      <div style={styles.headerRight}>
        <div style={styles.searchIcon}>🔍</div>
        <div style={styles.nav}>
          <div>About Us</div>
          <div>Help/FAQ</div>
          <div>Calendar</div>
        </div>
        <div style={styles.bell}>🔔</div>
        <div style={styles.loginBox} onClick={onLoginClick}>
          Sign in/Login
        </div>
      </div>
    </div>
  );
}
