import Navbar from "../components/Navbar";
import EventCard from "../components/EventCard";
import styles from "../styles";
import { allEvents } from "../data/events";

export default function Events({
  onHomeClick,
  onLoginClick,
  onEventsClick,
  onCalendarClick,
  onAboutClick,
  onHelpClick,
  userAvatar,
  onAvatarClick,
  isLoggedIn,
  registeredEventIds,
  onToggleEventRegistration,
}) {
  return (
    <div style={styles.page}>
      <Navbar
        onHomeClick={onHomeClick}
        onEventsClick={onEventsClick}
        onCalendarClick={onCalendarClick}
        onLoginClick={onLoginClick}
        onAboutClick={onAboutClick}
        onHelpClick={onHelpClick}
        userAvatar={userAvatar}
        onAvatarClick={onAvatarClick}
      />

      <section style={styles.hero}>
        <span style={styles.pill}>Sacramento State</span>
        <h1 style={styles.heroTitle}>
          Upcoming Events
        </h1>
        <p style={styles.heroSub}>
          Discover all the career events, workshops, and opportunities happening on campus.
        </p>
      </section>

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>All Events</h2>
        </div>

        <div style={styles.eventList}>
          {allEvents.map((event) => {
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
