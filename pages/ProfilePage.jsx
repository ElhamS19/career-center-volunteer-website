import { useState } from "react";
import Navbar from "../components/Navbar";
import styles from "../styles";

export default function ProfilePage({ onSave, onLogoutClick, onHomeClick }) {
  const [profile, setProfile] = useState({
    fullName: "John Harry",
    email: "johnharry@gmail.com",
    password: "••••••••••••",
    phone: "(916) 1234 5678"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div style={styles.page}>
      <Navbar onLoginClick={() => {}} onHomeClick={onHomeClick} />
      <div style={styles.loginBody}>
        <div style={{ ...styles.loginContainer, width: "500px" }}>
          
          {/* Header Section with editable name */}
          <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "30px" }}>
            <div style={styles.sacLogo}>
              <span style={styles.sacLogoSpan}>{profile.fullName.charAt(0)}</span>
            </div>
            <input 
              name="fullName"
              value={profile.fullName} 
              onChange={handleChange}
              style={{ border: "none", fontSize: "24px", fontWeight: "bold", outline: "none", width: "100%" }}
            />
          </div>

          {/* Form Fields */}
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {Object.keys(profile).map((key) => (
              <div key={key} style={{ display: "flex", alignItems: "center" }}>
                <label style={{ ...styles.label, width: "110px", marginBottom: 0 }}>
                  {key === "fullName" ? "Full Name" : key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
                <input
                  name={key}
                  type={key === "password" ? "password" : "text"}
                  value={profile[key]}
                  onChange={handleChange}
                  style={{ ...styles.input, backgroundColor: "#f0f0f0" }}
                />
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "20px", marginTop: "30px" }}>
            <button onClick={onSave} style={{ ...styles.loginBtn, backgroundColor: "#4b6a63" }}>
              Save changes
            </button>
            <button onClick={onLogoutClick} style={{ ...styles.loginBtn, backgroundColor: "#a34e4e" }}>
              Log out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}