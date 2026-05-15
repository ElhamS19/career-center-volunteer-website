import Navbar from "../components/Navbar";
import EventCard from "../components/EventCard";
import styles from "../styles";

const allEvents = [
  { month: "Apr", day: "22", title: "Employer on Campus", time: "10:00 am - 1:00 pm", location: "Library Quad" },
  { month: "Apr", day: "22", title: "Here to Career",     time: "2:00 pm - 3:30 pm",  location: "Career Center" },
  { month: "May", day: "06", title: "Employer on Campus", time: "10:00 am - 2:00 pm", location: "University Union" },
  { month: "May", day: "15", title: "Resume Workshop",    time: "11:00 am - 12:00 pm", location: "Career Center" },
  { month: "May", day: "20", title: "Networking Event",   time: "4:00 pm - 6:00 pm",  location: "Student Center" },
  { month: "Jun", day: "01", title: "Job Fair",           time: "9:00 am - 3:00 pm",  location: "Student Center" },
  { month: "Jun", day: "10", title: "Mock Interviews",    time: "1:00 pm - 4:00 pm",  location: "Career Center" },
  { month: "Jun", day: "15", title: "Alumni Panel",       time: "6:00 pm - 8:00 pm",  location: "Auditorium" },
];

export default function Events({
  onHomeClick,
  onLoginClick,
  onEventsClick,
  onCalendarClick,
  onHelpClick,
  userAvatar,
  onAvatarClick,
}) {
  return (
    <div style={styles.page}>
      <Navbar
        onHomeClick={onHomeClick}
        onEventsClick={onEventsClick}
        onCalendarClick={onCalendarClick}
        onLoginClick={onLoginClick}
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
          {allEvents.map((e, i) => (
            <EventCard key={i} {...e} onSignUp={onLoginClick} />
          ))}
        </div>
      </section>
    </div>
  );
}