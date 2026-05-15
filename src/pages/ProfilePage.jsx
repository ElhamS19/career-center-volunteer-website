import { useState } from "react";
import Navbar from "../components/Navbar";
import Icon from "../components/Icon";
import { fetchJson } from "../lib/api";
import styles from "../styles";

function getInitials(fullName) {
  if (!fullName) return "?";
  const parts = fullName.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last  = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase() || "?";
}

export default function ProfilePage({
  user,
  onSave,
  onChangePasswordClick,
  onLogoutClick,
  onHomeClick,
  onEventsClick,
  onCalendarClick,
  onLoginClick,
  onAboutClick,
  onHelpClick,
}) {
  const firstName = user?.firstName || "";
  const lastName = user?.lastName || "";
  const defaultFullName = user?.fullName || `${firstName} ${lastName}`.trim();

  const [profile, setProfile] = useState({
    username: user?.username || `${firstName?.[0]?.toLowerCase() || ""}${lastName?.toLowerCase() || ""}`,
    fullName: defaultFullName,
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccess("");
  }

  async function handleSave() {
    setError("");
    setSuccess("");

    if (!profile.username.trim()) {
      setError("Username is required.");
      return;
    }
    if (!profile.fullName.trim()) {
      setError("Full name is required.");
      return;
    }
    if (!profile.email.trim()) {
      setError("Email is required.");
      return;
    }

    setLoading(true);

    try {
      const { response, data } = await fetchJson("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          username: profile.username.trim(),
          email: profile.email.trim(),
          fullName: profile.fullName.trim(),
          phone: profile.phone.trim(),
        }),
      });

      if (!response.ok) {
        setError(data.error || "Failed to save profile.");
        setLoading(false);
        return;
      }

      setSuccess("Profile saved successfully!");
      setLoading(false);
      setTimeout(() => onSave(data.user), 600);
    } catch (error) {
      setLoading(false);
      setError(error.message || "Could not connect to server. Make sure it is running.");
    }
  }

  const initials = getInitials(profile.fullName);

  return (
    <div style={styles.page}>
      <Navbar onHomeClick={onHomeClick} onEventsClick={onEventsClick} onCalendarClick={onCalendarClick} onLoginClick={onLoginClick} onAboutClick={onAboutClick} onHelpClick={onHelpClick} userAvatar={initials} onLogoutClick={onLogoutClick} />

      <div style={styles.profileBody}>
        <div style={styles.profileContainer}>
          <div style={styles.profileHeader}>
            <div style={styles.avatar}>{initials}</div>
            <div>
              <h1 style={styles.profileName}>{profile.fullName || "Your name"}</h1>
              <p style={styles.profileMeta}>
                @{profile.username} · Volunteer since 2026
              </p>
            </div>
          </div>

          <h2 style={styles.sectionLabel}>Account details</h2>
          {error && <p style={{ color: "#C2410C", marginBottom: "12px", fontSize: "14px" }}>{error}</p>}
          {success && <p style={{ color: "#0A6E48", marginBottom: "12px", fontSize: "14px" }}>{success}</p>}
          <div style={styles.formGrid}>
            <div>
              <label style={styles.label}>Username</label>
              <input
                name="username"
                type="text"
                value={profile.username}
                onChange={handleChange}
                style={styles.input}
                disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
              />
            </div>
          </div>

          <div style={{ marginTop: "8px" }}>
            <label style={styles.label}>Password</label>
            <div style={styles.passwordRow}>
              <span style={styles.passwordRowText}>Update your password</span>
              <span
                style={styles.authLink}
                role="button"
                tabIndex={0}
                onClick={onChangePasswordClick}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    onChangePasswordClick?.();
                  }
                }}
              >
                Change
              </span>
            </div>
          </div>

          <div style={styles.profileFooter}>
            <button
              style={styles.dangerGhostBtn}
              type="button"
              onClick={onLogoutClick}
              disabled={loading}
            >
              <Icon name="logout" size={14} /> Log out
            </button>
            <div style={styles.profileFooterRight}>
              <button style={styles.ghostBtn} type="button" onClick={onHomeClick} disabled={loading}>
                Cancel
              </button>
              <button style={styles.primaryBtn} type="button" onClick={handleSave} disabled={loading}>
                {loading ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
