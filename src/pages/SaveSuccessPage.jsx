import Navbar from "../components/Navbar";
import Icon from "../components/Icon";
import styles from "../styles";

export default function SaveSuccessPage({ onHomeClick, userAvatar, onAvatarClick }) {
  return (
    <div style={styles.page}>
      <Navbar onHomeClick={onHomeClick} userAvatar={userAvatar} onAvatarClick={onAvatarClick} />

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
