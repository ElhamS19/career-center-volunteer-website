import Navbar from "../components/Navbar";
import Icon from "../components/Icon";
import styles from "../styles";

export default function LogoutSuccessPage({ onLoginClick, onHomeClick, onEventsClick, onCalendarClick, onHelpClick, userAvatar, onAvatarClick }) {
  return (
    <div style={styles.page}>
      <Navbar onHomeClick={onHomeClick} onEventsClick={onEventsClick} onCalendarClick={onCalendarClick} onLoginClick={onLoginClick} onHelpClick={onHelpClick} userAvatar={userAvatar} onAvatarClick={onAvatarClick} />

      <div style={styles.confirmContainer}>
        <div
          style={{
            ...styles.confirmIcon,
            backgroundColor: "#F4F3EE",
            color: "#6B6B6B",
          }}
        >
          <Icon name="logout" size={24} strokeWidth={2} />
        </div>
        <h2 style={styles.confirmTitle}>Signed out</h2>
        <p style={styles.confirmText}>
          Thanks for your contribution today. See you next time.
        </p>
        <div style={styles.confirmBtnRow}>
          <button style={styles.primaryBtn} type="button" onClick={onLoginClick}>
            Sign in again
          </button>
          <button style={styles.ghostBtn} type="button" onClick={onHomeClick}>
            Return home
          </button>
        </div>
      </div>
    </div>
  );
}
