import { useState } from "react";
import Navbar from "../components/Navbar";
import styles from "../styles";

function getStrength(pw) {
  if (!pw) return { score: 0, label: "", color: "transparent" };
  let score = 0;
  if (pw.length >= 8)          score++;
  if (/[A-Z]/.test(pw))        score++;
  if (/[0-9]/.test(pw))        score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  const map = [
    { label: "Too short", color: "#C2410C" },
    { label: "Weak",      color: "#C2410C" },
    { label: "Fair",      color: "#B45309" },
    { label: "Good",      color: "#6B5F00" },
    { label: "Strong",    color: "#0A6E48" },
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
    if (password.length < 8) {
      setPwError("Password must be at least 8 characters.");
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
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1000);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleSubmit();
  }

  return (
    <div style={styles.page}>
      <Navbar onHomeClick={onHomeClick} />

      <div style={styles.authBody}>
        <div style={styles.authContainer}>
          <div style={styles.authHeader}>
            <div style={styles.authLogo}>S</div>
            <h1 style={styles.authTitle}>Create an account</h1>
            <p style={styles.authSubtitle}>Join the Sac State Career Center</p>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Full name</label>
            <input
              type="text"
              placeholder="Jane Hornet"
              value={name}
              onChange={(e) => { setName(e.target.value); setNameError(""); }}
              onKeyDown={handleKeyDown}
              style={{ ...styles.input, ...(nameError ? styles.inputError : {}) }}
            />
            {nameError && <p style={styles.errorText}>{nameError}</p>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              placeholder="hornet@csus.edu"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
              onKeyDown={handleKeyDown}
              style={{ ...styles.input, ...(emailError ? styles.inputError : {}) }}
            />
            {emailError && <p style={styles.errorText}>{emailError}</p>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.passwordWrap}>
              <input
                type={showPw ? "text" : "password"}
                placeholder="Create a password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setPwError(""); }}
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

            {password.length > 0 && (
              <>
                <div style={styles.strengthTrack}>
                  <div
                    style={{
                      ...styles.strengthFill,
                      width: `${(strength.score / 4) * 100}%`,
                      backgroundColor: strength.color,
                    }}
                  />
                </div>
                <p style={{ ...styles.strengthLabel, color: strength.color }}>
                  {strength.label}
                </p>
              </>
            )}
            {pwError && <p style={styles.errorText}>{pwError}</p>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Confirm password</label>
            <div style={styles.passwordWrap}>
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Re-enter your password"
                value={confirm}
                onChange={(e) => { setConfirm(e.target.value); setConfirmError(""); }}
                onKeyDown={handleKeyDown}
                style={{
                  ...styles.input,
                  paddingRight: "56px",
                  ...(confirmError ? styles.inputError : {}),
                }}
              />
              <button
                style={styles.passwordToggle}
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? "Hide" : "Show"}
              </button>
            </div>
            {confirmError && <p style={styles.errorText}>{confirmError}</p>}
          </div>

          <button
            style={{ ...styles.primaryBtnFull, opacity: loading ? 0.7 : 1, marginTop: "8px" }}
            type="button"
            onClick={handleSubmit}
            disabled={loading || success}
          >
            {loading ? "Creating account..." : success ? "Account created" : "Create account"}
          </button>

          {success && (
            <div style={styles.successBox}>
              Account created. You can now sign in.
            </div>
          )}

          <p style={styles.authFooter}>
            Already have an account?{" "}
            <span style={styles.authLink} onClick={onLoginClick}>Sign in</span>
          </p>
        </div>
      </div>
    </div>
  );
}
