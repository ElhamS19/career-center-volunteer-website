import Navbar from "../components/Navbar";
import EventCard from "../components/EventCard";
import Icon from "../components/Icon";
import styles from "../styles";

const events = [
  { month: "Apr", day: "22", title: "Employer on Campus", time: "10:00 am - 1:00 pm", location: "Library Quad" },
  { month: "Apr", day: "22", title: "Here to Career",     time: "2:00 pm - 3:30 pm",  location: "Career Center" },
  { month: "May", day: "06", title: "Employer on Campus", time: "10:00 am - 2:00 pm", location: "University Union" },
];

export default function Home({ onHomeClick, onLoginClick, onSignupClick, userAvatar, onAvatarClick }) {
  function scrollToEvents() {
    const el = document.getElementById("upcoming-events");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div style={styles.page}>
      <Navbar onHomeClick={onHomeClick} onLoginClick={onLoginClick} userAvatar={userAvatar} onAvatarClick={onAvatarClick} />

      <section style={styles.hero}>
        <span style={styles.pill}>Sacramento State</span>
        <h1 style={styles.heroTitle}>
          Find your next opportunity at the Career Center.
        </h1>
        <p style={styles.heroSub}>
          One place for students, recruiters, and volunteers to connect through events,
          workshops, and on-campus hiring.
        </p>
        <div style={styles.heroBtnRow}>
          <button style={styles.primaryBtn} type="button" onClick={scrollToEvents}>
            Browse events
          </button>
          <button style={styles.ghostBtn} type="button" onClick={onSignupClick}>
            Sign up to volunteer
          </button>
        </div>
      </section>

      <section id="upcoming-events" style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Upcoming events</h2>
          <span style={styles.sectionLink}>
            View all <Icon name="arrowRight" size={13} />
          </span>
        </div>

        <div style={styles.eventList}>
          {events.map((e, i) => (
            <EventCard key={i} {...e} onSignUp={onLoginClick} />
          ))}
        </div>
      </section>
    </div>
  );
}
