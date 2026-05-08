import Navbar from "../components/Navbar";
import styles from "../styles";

export default function LogoutSuccessPage({ onLoginClick }) {
  return (
    <div style={styles.page}>
      <Navbar onLoginClick={onLoginClick} onHomeClick={() => {}} />
      <div style={styles.loginBody}>
        <div style={{ ...styles.loginContainer, textAlign: "center", padding: "60px 40px" }}>
          <h2 style={{ color: "#043927", fontSize: "24px", marginBottom: "30px" }}>
            Logged out successfully!
          </h2>
          <button 
            onClick={onLoginClick} 
            style={{ ...styles.loginBox, margin: "0 auto", padding: "10px 25px" }}
          >
            Return to login page
          </button>
        </div>
      </div>
    </div>
  );
}