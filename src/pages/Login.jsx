import { useState } from "react";
import Navbar from "../components/Navbar";
import styles from "../styles";
 
export default function Login({ onHomeClick, onSignUpClick, onLoginSuccess, userAvatar, onAvatarClick }) {
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [remember, setRemember]     = useState(true);
  const [showPw, setShowPw]         = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [pwError, setPwError]       = useState(false);
  const [serverError, setServerError] = useState("");
  const [loading, setLoading]       = useState(false);
  const [success, setSuccess]       = useState(false);
 
  function isValidEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  }
 
  async function handleLogin() {
    let valid = true;
    setServerError("");
 
    if (!isValidEmail(email)) { setEmailError(true); valid = false; }
    if (password.length < 6)  { setPwError(true);    valid = false; }
    if (!valid) return;
 
    setLoading(true);
 
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
 
      const data = await response.json();
 
      if (!response.ok) {
        setServerError(data.error);
        setLoading(false);
        return;
      }
 
      setLoading(false);
      setSuccess(true);
 
      if (typeof onLoginSuccess === "function") {
        setTimeout(() => onLoginSuccess(data.user), 400);
      }
 
    } catch (err) {
      setLoading(false);
      setServerError("Could not connect to server. Make sure it is running.");
    }
  }
 
  function handleKeyDown(e) {
    if (e.key === "Enter") handleLogin();
  }
 
  return (
    <div style={styles.page}>
      <Navbar onHomeClick={onHomeClick} userAvatar={userAvatar} onAvatarClick={onAvatarClick} />
 
      <div style={styles.authBody}>
        <div style={styles.authContainer}>
          <div style={styles.authHeader}>
            <div style={styles.authLogo}>S</div>
            <h1 style={styles.authTitle}>Welcome back</h1>
            <p style={styles.authSubtitle}>Sign in with your Sac State account</p>
          </div>
 
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              placeholder="hornet@csus.edu"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setEmailError(false); }}
              onKeyDown={handleKeyDown}
              style={{ ...styles.input, ...(emailError ? styles.inputError : {}) }}
            />
            {emailError && <p style={styles.errorText}>Please enter a valid email address.</p>}
          </div>
 
          <div style={styles.formGroup}>
            <div style={styles.labelRow}>
              <label style={styles.label}>Password</label>
              <span style={styles.forgotLink}>Forgot?</span>
            </div>
            <div style={styles.passwordWrap}>
              <input
                type={showPw ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setPwError(false); }}
                onKeyDown={handleKeyDown}
                style={{
                  ...styles.input,
                  paddingRight: "56px",
                  ...(pwError ? styles.inputError : {}),
                }}
              />
              <button
                style={styles.passwordToggle}
                type="button"
                onClick={() => setShowPw(!showPw)}
              >
                {showPw ? "Hide" : "Show"}
              </button>
            </div>
            {pwError && <p style={styles.errorText}>Password needs to be at least 6 characters.</p>}
          </div>
 
          <label style={styles.rememberRow}>
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              style={{ width: "15px", height: "15px", accentColor: "#043927", cursor: "pointer" }}
            />
            Keep me signed in
          </label>
 
          <button
            style={{ ...styles.primaryBtnFull, opacity: loading ? 0.7 : 1 }}
            type="button"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
 
          {serverError && <p style={styles.errorText}>{serverError}</p>}
          {success && <div style={styles.successBox}>Signed in successfully.</div>}
 
          <p style={styles.authFooter}>
            New here? <span style={styles.authLink} onClick={onSignUpClick}>Create an account</span>
          </p>
        </div>
      </div>
    </div>
  );
}