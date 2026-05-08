import Navbar from "../components/Navbar";
import styles from "../styles";

export default function SaveSuccessPage({ onHomeClick }) {
  return (
    <div style={styles.page}>
      <Navbar onLoginClick={() => {}} onHomeClick={onHomeClick} />
      <div style={styles.loginBody}>
        <div style={{ ...styles.loginContainer, textAlign: "center", padding: "60px 40px" }}>
          <h2 style={{ color: "#043927", fontSize: "24px", marginBottom: "30px" }}>
            Your changes have been saved successfully!
          </h2>
          <button 
            onClick={onHomeClick} 
            style={{ ...styles.loginBox, margin: "0 auto", padding: "10px 25px" }}
          >
            Return to home page
          </button>
        </div>
      </div>
    </div>
  );
}