import styles from "../styles";

export default function EventCard({ date, title, time }) {
  return (
    <div style={styles.box}>
      <div style={styles.boxContent}>
        <div style={styles.date}>{date}</div>
        <div style={styles.eventTitle}>{title}</div>
        <div style={styles.eventTime}>{time}</div>
      </div>
    </div>
  );
}
