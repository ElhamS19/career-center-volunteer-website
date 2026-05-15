import Navbar from "../components/Navbar";
import styles from "../styles";
import campusImage from "../assets/Introduction-Sac-State-58b5cc603df78cdcd8bdfdc1.jpg";

export default function About({
  onHomeClick,
  onEventsClick,
  onCalendarClick,
  onAboutClick,
  onHelpClick,
  onLoginClick,
  userAvatar,
  onAvatarClick,
}) {
  return (
    <div style={styles.page}>
      <Navbar
        onHomeClick={onHomeClick}
        onEventsClick={onEventsClick}
        onCalendarClick={onCalendarClick}
        onAboutClick={onAboutClick}
        onHelpClick={onHelpClick}
        onLoginClick={onLoginClick}
        userAvatar={userAvatar}
        onAvatarClick={onAvatarClick}
      />

      <main style={styles.aboutBody}>
        <section style={styles.aboutContainer}>
          <div style={styles.aboutImageCard}>
            <img
              src={campusImage}
              alt="Sacramento State campus"
              style={styles.aboutImage}
            />
          </div>
          <div style={styles.aboutContent}>
            <div>
              <span style={styles.pill}>About Us</span>
              <h1 style={styles.aboutTitle}>We are committed to helping students connect.</h1>
              <p style={styles.aboutDescription}>
                We are a proud team, consisting of 5 individuals from California State University Sacramento who want potential volunteers to easily navigate and sign up every event so that they will not miss!
              </p>
            </div>

            <div style={styles.aboutMeta}>
              <p style={styles.aboutContactHeader}>From,</p>
              <p style={{ ...styles.aboutText, marginBottom: "24px" }}>Team 5 Guys</p>

              <div style={styles.aboutContactRow}>
                <span style={styles.aboutContactLabel}>Email:</span>
                <span style={styles.aboutContactValue}>careercenter@csus.edu</span>
              </div>

              <div style={styles.aboutContactRow}>
                <span style={styles.aboutContactLabel}>Phone:</span>
                <span style={styles.aboutContactValue}>xxx - xxx - xxxx</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
