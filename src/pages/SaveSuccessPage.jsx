import Navbar from "../components/Navbar";
import styles from "../styles";

export default function SaveSuccessPage({ onHomeClick }) {
  return (
    <div style={styles.page}>
      <Navbar onLoginClick={() => {}} onHomeClick={onHomeClick} />
      <div style={styles.loginBody}>
        <div style={{ ...styles.loginContainer, textAlign: "center", padding: "50px 30px" }}>
          <div style={{ fontSize: "50px", marginBottom: "20px" }}>✅</div>
          <h2 style={{ color: "#043927", fontSize: "22px", marginBottom: "15px" }}>
            Changes Saved Successfully!
          </h2>
          <p style={{ color: "#666", marginBottom: "30px" }}>
            Your profile information has been updated.
          </p>
          <button 
            onClick={onHomeClick} 
            style={{ ...styles.loginBtn, margin: "0 auto", width: "auto", padding: "12px 30px" }}
          >
            Return to Home Page
          </button>
        </div>
      </div>
    </div>
  );
}