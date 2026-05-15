import Icon from "./Icon";
import styles from "../styles";

export default function EventCard({
  month,
  day,
  title,
  time,
  location,
  onSignUp,
  actionLabel = "Sign Up",
  actionStyle,
}) {
  return (
    <div style={styles.eventCard}>
      <div style={styles.eventDate}>
        <div style={styles.eventMonth}>{month}</div>
        <div style={styles.eventDay}>{day}</div>
      </div>

      <div style={styles.eventBody}>
        <p style={styles.eventTitle}>{title}</p>
        <p style={styles.eventMeta}>
          <span style={styles.eventMetaItem}>
            <Icon name="clock" size={13} /> {time}
          </span>
          {location && (
            <span style={styles.eventMetaItem}>
              <Icon name="mapPin" size={13} /> {location}
            </span>
          )}
        </p>
      </div>

      <button style={{ ...styles.eventBtn, ...actionStyle }} onClick={onSignUp} type="button">
        {actionLabel}
      </button>
    </div>
  );
}
