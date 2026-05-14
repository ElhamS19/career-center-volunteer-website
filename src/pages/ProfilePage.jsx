import { useState } from "react";
import Navbar from "../components/Navbar";
import Icon from "../components/Icon";
import styles from "../styles";

function getInitials(fullName) {
  if (!fullName) return "?";
  const parts = fullName.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last  = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase() || "?";
}

export default function ProfilePage({ onSave, onLogoutClick, onHomeClick }) {
  const [profile, setProfile] = useState({
    username: "JHarry916",
    fullName: "John Harry",
    email:    "johnharry@csus.edu",
    phone:    "(916) 123-4567",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  }

  const initials = getInitials(profile.fullName);

  return (
    <div style={styles.page}>
      <Navbar onHomeClick={onHomeClick} userAvatar={initials} />

      <div style={styles.profileBody}>
        <div style={styles.profileContainer}>
          <div style={styles.profileHeader}>
            <div style={styles.avatar}>{initials}</div>
            <div>
              <h1 style={styles.profileName}>{profile.fullName || "Your name"}</h1>
              <p style={styles.profileMeta}>
                @{profile.username} · Volunteer since 2024
              </p>
            </div>
          </div>

          <h2 style={styles.sectionLabel}>Account details</h2>
          <div style={styles.formGrid}>
            <div>
              <label style={styles.label}>Username</label>
              <input
                name="username"
                type="text"
                value={profile.username}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div>
              <label style={styles.label}>Full name</label>
              <input
                name="fullName"
                type="text"
                value={profile.fullName}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div>
              <label style={styles.label}>Email</label>
              <input
                name="email"
                type="email"
                value={profile.email}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div>
              <label style={styles.label}>Phone</label>
              <input
                name="phone"
                type="text"
                value={profile.phone}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>

          <div style={{ marginTop: "8px" }}>
            <label style={styles.label}>Password</label>
            <div style={styles.passwordRow}>
              <span style={styles.passwordRowText}>Last changed 3 months ago</span>
              <span style={styles.authLink} role="button">Change</span>
            </div>
          </div>

          <div style={styles.profileFooter}>
            <button
              style={styles.dangerGhostBtn}
              type="button"
              onClick={onLogoutClick}
            >
              <Icon name="logout" size={14} /> Log out
            </button>
            <div style={styles.profileFooterRight}>
              <button style={styles.ghostBtn} type="button" onClick={onHomeClick}>
                Cancel
              </button>
              <button style={styles.primaryBtn} type="button" onClick={onSave}>
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
