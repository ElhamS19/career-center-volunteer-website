import Navbar from "../components/Navbar";
import EventCard from "../components/EventCard";
import styles from "../styles";

const events = [
  { date: "April 22", title: "Employer on Campus", time: "10:00 am - 1:00 pm" },
  { date: "April 22", title: "Here to Career",     time: "2:00 pm - 3:30 pm"  },
  { date: "May 6",    title: "Employer on Campus", time: "10:00 am - 2:00 pm" },
];

export default function Home({ onLoginClick }) {
  return (
    <div style={styles.page}>
      <Navbar onLoginClick={onLoginClick} onHomeClick={() => {}} />

      <div style={styles.main}>
        {/* LEFT — upcoming events */}
        <div style={styles.leftBoxes}>
          <div style={styles.box}>
            <div style={styles.boxTitle}>Upcoming Events</div>
          </div>
          {events.map((event, i) => (
            <EventCard key={i} {...event} />
          ))}
        </div>

        {/* TOP CENTER text */}
        <div style={styles.topText}>
          <div style={styles.welcome}>Welcome to CSUS CAREER CENTER</div>
          <div style={styles.subtext}>One Platform. Students. Recruiters. Opportunities</div>
        </div>

        {/* CENTER title */}
        <div style={styles.content}>
          <div style={styles.centerContainer}>
            <div style={styles.smallTitle}>Sacramento State</div>
            <div style={styles.bigTitle}>Career</div>
            <div style={styles.bigTitle}>Center</div>
          </div>
        </div>

        {/* RIGHT images */}
        <div style={styles.rightImage}>
          <img
            src="https://www.csus.edu/college/business-administration/graduate/_internal/_images/49618278783_86d918dc72_b.jpg"
            alt="Career Center"
            style={styles.img}
          />
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTsHRceEpd4ivvAeOIH-Nr9ghe4q0zLPJ3kA&s"
            alt="Students"
            style={styles.img}
          />
        </div>
      </div>
    </div>
  );
}
