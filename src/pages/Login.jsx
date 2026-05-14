import { useState } from "react";
import Navbar from "../components/Navbar";
import styles from "../styles";

export default function Login({ onHomeClick, onSignUpClick }) {
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [remember, setRemember]     = useState(false);
  const [showPw, setShowPw]         = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [pwError, setPwError]       = useState(false);
  const [loading, setLoading]       = useState(false);
  const [success, setSuccess]       = useState(false);

  function isValidEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  }

  function handleLogin() {
    let valid = true;

    if (!isValidEmail(email)) { setEmailError(true); valid = false; }
    if (password.length < 6)  { setPwError(true);    valid = false; }
    if (!valid) return;

    setLoading(true);
    // TODO: replace with real 
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      // TODO: navigate to dashboard
    }, 1500);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleLogin();
  }

  return (
    <div style={styles.page}>
      <Navbar onLoginClick={() => {}} onHomeClick={onHomeClick} />

      <div style={styles.loginBody}>
        <div style={styles.loginContainer}>

          {/* Logo */}
          <div style={styles.logoSection}>
            <div style={styles.sacLogo}>
              <span style={styles.sacLogoSpan}>S</span>
            </div>
            <h1 style={styles.logoH1}>Welcome Back!</h1>
            <p style={styles.logoP}>Sign in to your Sac State account</p>
          </div>

          {/* Email */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>
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

          {/* Password */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.passwordWrapper}>
              <input
                type={showPw ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setPwError(false); }}
                onKeyDown={handleKeyDown}
                style={{ ...styles.input, paddingRight: "44px", ...(pwError ? styles.inputError : {}) }}
              />
              <button
                style={styles.togglePassword}
                type="button"
                onClick={() => setShowPw(!showPw)}
              >
                {showPw ? "Hide" : "Show"}
              </button>
            </div>
            {pwError && <p style={styles.errorText}>Password needs to be at least 6 characters.</p>}
          </div>

          {/* Options row */}
          <div style={styles.formOptions}>
            <label style={styles.rememberMe}>
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                style={{ width: "15px", height: "15px", accentColor: "#043927", cursor: "pointer" }}
              />
              Remember me
            </label>
            <span style={styles.forgotLink}>Forgot Password?</span>
          </div>

          {/* Login button */}
          <button
            style={{ ...styles.loginBtn, opacity: loading ? 0.7 : 1 }}
            type="button"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>

          {/* Success message */}
          {success && <div style={styles.successMsg}>✅ Logged in successfully!</div>}

          {/* Divider */}
          <div style={styles.divider}>
            <div style={styles.dividerLine}></div>
            <span>or</span>
            <div style={styles.dividerLine}></div>
          </div>

          {/* Sign up */}
          <p style={styles.signupText}>
            Don't have an account?{" "}
            <span style={styles.signupLink} onClick={onSignUpClick}>Sign Up</span>
          </p>

          {/* Back to home */}
          <p style={styles.backLink}>
            ← <span style={styles.backLinkA} onClick={onHomeClick}>Back to Home</span>
          </p>

        </div>
      </div>
    </div>
  );
}
