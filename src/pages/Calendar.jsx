import { useState } from "react";
import Navbar from "../components/Navbar";
import styles from "../styles";
import { allEvents } from "../data/events";

const monthConfig = {
  Apr: { label: "April", length: 30, startOffset: 3 },
  May: { label: "May", length: 31, startOffset: 5 },
  Jun: { label: "June", length: 30, startOffset: 1 },
};

const monthKeys = Object.keys(monthConfig);
const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function Calendar({
  onHomeClick,
  onEventsClick,
  onCalendarClick,
  onLoginClick,
  onAboutClick,
  onHelpClick,
  userAvatar,
  onAvatarClick,
  isLoggedIn,
  registeredEventIds,
  onToggleEventRegistration,
}) {
  const [selectedMonth, setSelectedMonth] = useState("May");

  const eventMap = allEvents.reduce((acc, event) => {
    const key = `${event.month}-${event.day}`;
    acc[key] = event;
    return acc;
  }, {});

  const { length, startOffset } = monthConfig[selectedMonth];
  const days = Array.from({ length }, (_, index) => index + 1);

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
        <h1 style={styles.heroTitle}>Event calendar</h1>
        <p style={styles.heroSub}>
          Browse upcoming events by date and sign up directly from the calendar.
        </p>
      </section>

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <div>
            <h2 style={styles.sectionTitle}>Monthly calendar</h2>
            <p style={styles.calendarDescription}>
              Tap a day with an event to see the details and register.
            </p>
          </div>
          <div style={styles.calendarToolbar}>
            {monthKeys.map((month) => (
              <button
                key={month}
                type="button"
                style={
                  selectedMonth === month
                    ? { ...styles.monthButton, ...styles.monthButtonActive }
                    : styles.monthButton
                }
                onClick={() => setSelectedMonth(month)}
              >
                {monthConfig[month].label}
              </button>
            ))}
          </div>
        </div>

        <div style={styles.calendarGrid}>
          {dayNames.map((name) => (
            <div key={name} style={styles.calendarCellHeader}>
              {name}
            </div>
          ))}

          {Array.from({ length: startOffset }).map((_, index) => (
            <div key={`empty-${index}`} style={styles.calendarCellEmpty} />
          ))}

          {days.map((day) => {
            const dateKey = `${selectedMonth}-${String(day).padStart(2, "0")}`;
            const event = eventMap[dateKey];
            const isRegistered = event ? registeredEventIds.includes(event.id) : false;

            return (
              <div key={dateKey} style={styles.calendarCell}>
                <div style={styles.calendarCellDate}>{day}</div>
                {event ? (
                  <div style={styles.calendarCellEvent}>
                    <p style={styles.calendarCellEventTitle}>{event.title}</p>
                    <p style={styles.calendarCellMeta}>{event.time}</p>
                    <p style={styles.calendarCellMeta}>{event.location}</p>
                    <button
                      style={isRegistered ? { ...styles.primaryBtn, ...styles.primaryBtnDanger } : styles.primaryBtn}
                      type="button"
                      onClick={() => (isLoggedIn ? onToggleEventRegistration(event.id) : onLoginClick())}
                    >
                      {isRegistered ? "Unregister" : "Sign Up"}
                    </button>
                  </div>
                ) : (
                  <p style={styles.calendarCellEmptyText}>No events</p>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
