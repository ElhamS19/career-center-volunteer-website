import Navbar from "../components/Navbar";
import styles from "../styles";

const faqs = [
  {
    question: "How do I sign up to volunteer?",
    answer:
      "Click Sign up on the home page, complete the volunteer account form, and submit. Once your account is created, browse events and register to volunteer.",
  },
  {
    question: "How do I save my profile information?",
    answer:
      "Open your profile page, update your details, and click Save changes. Your updates will be saved immediately.",
  },
  {
    question: "Where can I view upcoming events?",
    answer:
      "The home page lists upcoming events. Use Browse events or scroll to the upcoming events section to view the latest opportunities.",
  },
  {
    question: "What should I do if I forget my password?",
    answer:
      "Use the Forgot? link on the sign in page, or contact the Sac State Career Center by phone or email for assistance.",
  },
];

export default function Help({ onHomeClick, onLoginClick, onHelpClick, userAvatar, onAvatarClick }) {
  return (
    <div style={styles.page}>
      <Navbar
        onHomeClick={onHomeClick}
        onLoginClick={onLoginClick}
        onHelpClick={onHelpClick}
        userAvatar={userAvatar}
        onAvatarClick={onAvatarClick}
      />

      <div style={styles.helpBody}>
        <section style={styles.helpHero}>
          <span style={styles.pill}>Help & FAQ</span>
          <h1 style={styles.heroTitle}>Need help with the Career Center?</h1>
          <p style={styles.heroSub}>
            Find answers to common questions and access the Sac State Career Center contact information.
          </p>
        </section>

        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Frequently asked questions</h2>
            <span style={styles.sectionLink}>Quick answers for students and volunteers</span>
          </div>

          <div style={styles.faqList}>
            {faqs.map((item, index) => (
              <div key={index} style={styles.faqCard}>
                <h3 style={styles.faqQuestion}>{item.question}</h3>
                <p style={styles.faqAnswer}>{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Career Center contact</h2>
            <span style={styles.sectionLink}>Visit, call, or email for support</span>
          </div>

          <div style={styles.contactCard}>
            <div style={styles.contactRow}>
              <span style={styles.contactLabel}>Location</span>
              <span style={styles.contactValue}>Sacramento State Career Center</span>
            </div>
            <div style={styles.contactRow}>
              <span style={styles.contactLabel}>Address</span>
              <span style={styles.contactValue}>6000 J Street, University Union Suite 105, Sacramento, CA 95819</span>
            </div>
            <div style={styles.contactRow}>
              <span style={styles.contactLabel}>Phone</span>
              <span style={styles.contactValue}>(916) 278-6787</span>
            </div>
            <div style={styles.contactRow}>
              <span style={styles.contactLabel}>Email</span>
              <span style={styles.contactValue}>careercenter@csus.edu</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
