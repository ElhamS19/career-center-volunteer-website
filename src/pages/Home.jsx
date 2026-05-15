import Navbar from "../components/Navbar";
import EventCard from "../components/EventCard";
import Icon from "../components/Icon";
import styles from "../styles";
import { featuredEvents } from "../data/events";

export default function Home({ onHomeClick, onLoginClick, onSignupClick, onEventsClick, onCalendarClick, onAboutClick, onHelpClick, userAvatar, onAvatarClick, isLoggedIn, registeredEventIds, onToggleEventRegistration }) {
  function scrollToEvents() {
    const el = document.getElementById("upcoming-events");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div style={styles.page}>
      <Navbar onHomeClick={onHomeClick} onEventsClick={onEventsClick} onCalendarClick={onCalendarClick} onLoginClick={onLoginClick} onAboutClick={onAboutClick} onHelpClick={onHelpClick} userAvatar={userAvatar} onAvatarClick={onAvatarClick} />

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
          <span
            style={{ ...styles.sectionLink, cursor: "pointer" }}
            onClick={onEventsClick}
          >
            View all <Icon name="arrowRight" size={13} />
          </span>
        </div>

        <div style={styles.eventList}>
          {featuredEvents.map((event) => {
            const isRegistered = registeredEventIds.includes(event.id);

            return (
              <EventCard
                key={event.id}
                {...event}
                onSignUp={() => (isLoggedIn ? onToggleEventRegistration(event.id) : onLoginClick())}
                actionLabel={isRegistered ? "Unregister" : "Sign Up"}
                actionStyle={isRegistered ? styles.eventBtnDanger : undefined}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}
