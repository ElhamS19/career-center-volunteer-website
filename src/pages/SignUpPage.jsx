import { useState } from "react";
import Navbar from "../components/Navbar";
import styles from "../styles";
 
/* password strength helper */
function getStrength(pw) {
  if (!pw) return { score: 0, label: "", color: "transparent" };
  let score = 0;
  if (pw.length >= 8)               score++;
  if (/[A-Z]/.test(pw))             score++;
  if (/[0-9]/.test(pw))             score++;
  if (/[^A-Za-z0-9]/.test(pw))      score++;
 
  const map = [
    { label: "Too short",  color: "#e53e3e" },
    { label: "Weak",       color: "#e53e3e" },
    { label: "Fair",       color: "#dd6b20" },
    { label: "Good",       color: "#C4B000" },
    { label: "Strong",     color: "#043927" },
  ];
  return { score, ...map[score] };
}
 
export default function SignUpPage({ onHomeClick, onLoginClick }) {
  const [name,        setName]        = useState("");
  const [email,       setEmail]       = useState("");
  const [password,    setPassword]    = useState("");
  const [confirm,     setConfirm]     = useState("");
  const [showPw,      setShowPw]      = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
 
  const [nameError,    setNameError]    = useState("");
  const [emailError,   setEmailError]   = useState("");
  const [pwError,      setPwError]      = useState("");
  const [confirmError, setConfirmError] = useState("");
 
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
 
  const strength = getStrength(password);
 
  function isValidEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  }
 
  function handleSubmit() {
    let valid = true;
 
    if (!name.trim()) {
      setNameError("Full name is required.");
      valid = false;
    }
    if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address.");
      valid = false;
    }
    if (password.length < 6) {
      setPwError("Password must be at least 6 characters.");
      valid = false;
    }
    if (!confirm) {
      setConfirmError("Please confirm your password.");
      valid = false;
    } else if (confirm !== password) {
      setConfirmError("Passwords do not match.");
      valid = false;
    }
 
    if (!valid) return;
 
    setLoading(true);
   // database logic would go here, not setup yet.
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  }
 
  function handleKeyDown(e) {
    if (e.key === "Enter") handleSubmit();
  }
 
  return (
    <div style={styles.page}>
      <Navbar onLoginClick={onLoginClick} onHomeClick={onHomeClick} />
 
      <div style={styles.signupBody}>
        <div style={styles.signupContainer}>
 
          {/* Logo */}
          <div style={styles.logoSection}>
            <div style={styles.sacLogo}>
              <span style={styles.sacLogoSpan}>S</span>
            </div>
            <h1 style={styles.logoH1}>Create an Account</h1>
            <p style={styles.logoP}>Join the Sac State Career Center</p>
          </div>
 
          {/* Full Name */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              placeholder="Jane Hornet"
              value={name}
              onChange={e => { setName(e.target.value); setNameError(""); }}
              onKeyDown={handleKeyDown}
              style={{ ...styles.input, ...(nameError ? styles.inputError : {}) }}
            />
            {nameError && <p style={styles.errorText}>{nameError}</p>}
          </div>
 
          {/* Email */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              placeholder="hornet@csus.edu"
              value={email}
              onChange={e => { setEmail(e.target.value); setEmailError(""); }}
              onKeyDown={handleKeyDown}
              style={{ ...styles.input, ...(emailError ? styles.inputError : {}) }}
            />
            {emailError && <p style={styles.errorText}>{emailError}</p>}
          </div>
 
          {/* Password */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.passwordWrapper}>
              <input
                type={showPw ? "text" : "password"}
                placeholder="Create a password"
                value={password}
                onChange={e => { setPassword(e.target.value); setPwError(""); }}
                onKeyDown={handleKeyDown}
                style={{
                  ...styles.input,
                  paddingRight: "48px",
                  ...(pwError ? styles.inputError : {}),
                }}
              />
              <button
                style={styles.togglePassword}
                type="button"
                onClick={() => setShowPw(!showPw)}
              >
                {showPw ? "Hide" : "Show"}
              </button>
            </div>
 
            {/* Strength bar */}
            {password.length > 0 && (
              <>
                <div
                  style={{
                    ...styles.strengthBar,
                    width: `${(strength.score / 4) * 100}%`,
                    backgroundColor: strength.color,
                  }}
                />
                <p style={{ ...styles.strengthLabel, color: strength.color }}>
                  {strength.label}
                </p>
              </>
            )}
            {pwError && <p style={styles.errorText}>{pwError}</p>}
          </div>
 
          {/* Confirm Password */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Confirm Password</label>
            <div style={styles.passwordWrapper}>
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Re-enter your password"
                value={confirm}
                onChange={e => { setConfirm(e.target.value); setConfirmError(""); }}
                onKeyDown={handleKeyDown}
                style={{
                  ...styles.input,
                  paddingRight: "48px",
                  ...(confirmError ? styles.inputError : {}),
                }}
              />
              <button
                style={styles.togglePassword}
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? "Hide" : "Show"}
              </button>
            </div>
            {confirmError && <p style={styles.errorText}>{confirmError}</p>}
          </div>
 
          {/* Submit */}
          <button
            style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}
            type="button"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
 
          {success && (
            <div style={styles.successMsg}>
              ✅ Account created! You can now log in.
            </div>
          )}
 
          {/* Divider */}
          <div style={styles.divider}>
            <div style={styles.dividerLine} />
            <span>or</span>
            <div style={styles.dividerLine} />
          </div>
 
          {/* Back to login */}
          <p style={styles.loginText}>
            Already have an account?{" "}
            <span style={styles.loginLink} onClick={onLoginClick}>Log In</span>
          </p>
 
          <p style={styles.backLink}>
            ← <span style={styles.backLinkA} onClick={onHomeClick}>Back to Home</span>
          </p>
 
        </div>
      </div>
    </div>
  );
}