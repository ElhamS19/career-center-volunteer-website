import { useState } from "react";
import Navbar from "../components/Navbar";
import styles from "../styles";

export default function ProfilePage({ onSave, onLogoutClick, onHomeClick }) {
  // Initial state includes the fields you specified
  const [profile, setProfile] = useState({
    username: "JHarry916",
    fullName: "John Harry",
    password: "••••••••••••",
    phone: "(916) 123-4567"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div style={styles.page}>
      <Navbar onLoginClick={() => {}} onHomeClick={onHomeClick} />
      
      <div style={styles.loginBody}>
        <div style={{ ...styles.loginContainer, width: "450px" }}>
          <h2 style={{ color: "#043927", marginBottom: "25px", textAlign: "center" }}>
            User Profile
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {/* Username Field */}
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

            {/* Name Field */}
            <div>
              <label style={styles.label}>Full Name</label>
              <input
                name="fullName"
                type="text"
                value={profile.fullName}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            {/* Password Field */}
            <div>
              <label style={styles.label}>Password</label>
              <input
                name="password"
                type="password"
                value={profile.password}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            {/* Phone Number Field */}
            <div>
              <label style={styles.label}>Phone Number</label>
              <input
                name="phone"
                type="text"
                value={profile.phone}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "15px", marginTop: "30px" }}>
            <button 
              onClick={onSave} 
              style={{ ...styles.loginBtn, backgroundColor: "#043927" }}
            >
              Save Changes
            </button>
            <button 
              onClick={onLogoutClick} 
              style={{ ...styles.loginBtn, backgroundColor: "#a34e4e" }}
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}