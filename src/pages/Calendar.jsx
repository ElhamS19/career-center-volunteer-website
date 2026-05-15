import { useState } from "react";
import Navbar from "../components/Navbar";
import styles from "../styles";
import { allEvents } from "../data/events";

/* inject mobile styles once */
if (!document.head.querySelector("[data-calendar-mobile]")) {
  const tag = document.createElement("style");
  tag.setAttribute("data-calendar-mobile", "1");
  tag.innerHTML = `
    @media (max-width: 640px) {
      .cal-cell {
        min-height: 40px !important;
        padding: 4px 2px !important;
        cursor: pointer;
      }
      .cal-cell-full-text { display: none !important; }
      .cal-dot {
        width: 6px !important;
        height: 6px !important;
        background-color: #043927;
        border-radius: 50%;
        margin: 2px auto 0;
      }
      .cal-toolbar {
        flex-direction: row !important;
        gap: 6px !important;
        flex-wrap: wrap !important;
      }
      .cal-header {
        flex-direction: column !important;
        gap: 10px !important;
      }
      .cal-modal-overlay {
        position: fixed !important;
        inset: 0 !important;
        background: rgba(0,0,0,0.5) !important;
        display: flex !important;
        align-items: flex-end !important;
        justify-content: center !important;
        z-index: 999 !important;
      }
      .cal-modal {
        background: white !important;
        border-radius: 16px 16px 0 0 !important;
        padding: 24px 20px !important;
        width: 100% !important;
        max-height: 50vh !important;
      }
    }
    @media (min-width: 641px) {
      .cal-dot { display: none !important; }
      .cal-modal-overlay { display: none !important; }
    }
  `;
  document.head.appendChild(tag);
}

const monthConfig = {
  Apr: { label: "April", length: 30, startOffset: 3 },
  May: { label: "May", length: 31, startOffset: 5 },
  Jun: { label: "June", length: 30, startOffset: 1 },
};

const monthKeys = Object.keys(monthConfig);
const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function Calendar({
  onHomeClick, onEventsClick, onCalendarClick, onLoginClick,
  onAboutClick, onHelpClick, userAvatar, onAvatarClick, onLogoutClick,
  isLoggedIn, registeredEventIds, onToggleEventRegistration,
}) {
  const [selectedMonth, setSelectedMonth] = useState("May");
  const [selectedEvent, setSelectedEvent] = useState(null);

  const eventMap = allEvents.reduce((acc, event) => {
    const key = `${event.month}-${event.day}`;
    acc[key] = event;
    return acc;
  }, {});

  const { length, startOffset } = monthConfig[selectedMonth];
  const days = Array.from({ length }, (_, i) => i + 1);

  const isRegistered = selectedEvent ? registeredEventIds.includes(selectedEvent.id) : false;

  return (
    <div style={styles.page}>
      <Navbar
        onHomeClick={onHomeClick} onEventsClick={onEventsClick}
        onCalendarClick={onCalendarClick} onLoginClick={onLoginClick}
        onAboutClick={onAboutClick} onHelpClick={onHelpClick}
        userAvatar={userAvatar} onAvatarClick={onAvatarClick}
        onLogoutClick={onLogoutClick}
      />

      <section style={styles.hero}>
        <span style={styles.pill}>Sacramento State</span>
        <h1 style={styles.heroTitle}>Event calendar</h1>
        <p style={styles.heroSub}>
          Browse upcoming events by date and sign up directly from the calendar.
        </p>
      </section>

      <section style={styles.section}>
        <div className="cal-header" style={{ ...styles.sectionHeader, alignItems: "flex-start" }}>
          <div>
            <h2 style={styles.sectionTitle}>Monthly calendar</h2>
            <p style={styles.calendarDescription}>
              Tap a day with an event to see the details and register.
            </p>
          </div>
          <div className="cal-toolbar" style={styles.calendarToolbar}>
            {monthKeys.map((month) => (
              <button
                key={month} type="button"
                style={selectedMonth === month
                  ? { ...styles.monthButton, ...styles.monthButtonActive }
                  : styles.monthButton}
                onClick={() => setSelectedMonth(month)}
              >
                {monthConfig[month].label}
              </button>
            ))}
          </div>
        </div>

        <div style={styles.calendarGrid}>
          {dayNames.map((name) => (
            <div key={name} style={styles.calendarCellHeader}>{name}</div>
          ))}

          {Array.from({ length: startOffset }).map((_, i) => (
            <div key={`empty-${i}`} style={styles.calendarCellEmpty} />
          ))}

          {days.map((day) => {
            const dateKey = `${selectedMonth}-${String(day).padStart(2, "0")}`;
            const event = eventMap[dateKey];
            const reg = event ? registeredEventIds.includes(event.id) : false;

            return (
              <div
                key={dateKey}
                className="cal-cell"
                style={styles.calendarCell}
                onClick={() => event && setSelectedEvent(event)}
              >
                <div style={styles.calendarCellDate}>{day}</div>

                {/* Desktop: show full event info */}
                {event && (
                  <div className="cal-cell-full-text" style={styles.calendarCellEvent}>
                    <p style={styles.calendarCellEventTitle}>{event.title}</p>
                    <p style={styles.calendarCellMeta}>{event.time}</p>
                    <p style={styles.calendarCellMeta}>{event.location}</p>
                    <button
                      style={reg ? { ...styles.primaryBtn, ...styles.primaryBtnDanger } : styles.primaryBtn}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        isLoggedIn ? onToggleEventRegistration(event.id) : onLoginClick();
                      }}
                    >
                      {reg ? "Unregister" : "Sign Up"}
                    </button>
                  </div>
                )}

                {/* Mobile: show dot indicator */}
                {event && <div className="cal-dot" />}

                {!event && <p style={styles.calendarCellEmptyText}>No events</p>}
              </div>
            );
          })}
        </div>
      </section>

      {/* Mobile popup modal */}
      {selectedEvent && (
        <div className="cal-modal-overlay" onClick={() => setSelectedEvent(null)}>
          <div className="cal-modal" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: "0 0 8px", fontSize: "18px", color: "#043927" }}>
              {selectedEvent.title}
            </h3>
            <p style={{ fontSize: "13px", color: "#6B6B6B", margin: "0 0 4px" }}>
              {selectedEvent.time}
            </p>
            <p style={{ fontSize: "13px", color: "#6B6B6B", margin: "0 0 20px" }}>
              {selectedEvent.location}
            </p>
            <button
              style={{ ...styles.primaryBtnFull, ...(isRegistered ? { backgroundColor: "#C2410C" } : {}) }}
              type="button"
              onClick={() => {
                isLoggedIn ? onToggleEventRegistration(selectedEvent.id) : onLoginClick();
                setSelectedEvent(null);
              }}
            >
              {isRegistered ? "Unregister" : "Sign Up"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}