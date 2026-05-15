import Navbar from "../components/Navbar";
import Icon from "../components/Icon";
import styles from "../styles";

export default function SaveSuccessPage({ onHomeClick, onEventsClick, onCalendarClick, onLoginClick, onAboutClick, onHelpClick, userAvatar, onAvatarClick, onLogoutClick }) {
  return (
    <div style={styles.page}>
      <Navbar onHomeClick={onHomeClick} onEventsClick={onEventsClick} onCalendarClick={onCalendarClick} onLoginClick={onLoginClick} onAboutClick={onAboutClick} onHelpClick={onHelpClick} userAvatar={userAvatar} onAvatarClick={onAvatarClick} onLogoutClick={onLogoutClick} />

      <div style={styles.confirmContainer}>
        <div style={styles.confirmIcon}>
          <Icon name="check" size={26} strokeWidth={2.4} />
        </div>
        <h2 style={styles.confirmTitle}>Changes saved</h2>
        <p style={styles.confirmText}>
          Your profile information has been updated.
        </p>
        <div style={styles.confirmBtnRow}>
          <button style={styles.primaryBtn} type="button" onClick={onHomeClick}>
            Return home
          </button>
        </div>
      </div>
    </div>
  );
}
