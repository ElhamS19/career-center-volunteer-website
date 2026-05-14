import Navbar from "../components/Navbar";
import styles from "../styles";

export default function LogoutSuccessPage({ onLoginClick, onHomeClick }) {
  return (
    <div style={styles.page}>
      {/* Home click is disabled here to ensure they go to login as requested */}
      <Navbar onLoginClick={onLoginClick} onHomeClick={onHomeClick} />
      <div style={styles.loginBody}>
        <div style={{ ...styles.loginContainer, textAlign: "center", padding: "50px 30px" }}>
          <div style={{ fontSize: "50px", marginBottom: "20px" }}>👋</div>
          <h2 style={{ color: "#043927", fontSize: "22px", marginBottom: "15px" }}>
            Logged Out Successfully
          </h2>
          <p style={{ color: "#666", marginBottom: "30px" }}>
            Thank you for your contributions today!
          </p>
          <button 
            onClick={onLoginClick} 
            style={{ ...styles.loginBtn, margin: "0 auto", width: "auto", padding: "12px 30px" }}
          >
            Return to Login Page
          </button>
        </div>
      </div>
    </div>
  );
}