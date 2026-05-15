import { useState } from "react";
import Navbar from "../components/Navbar";
import styles from "../styles";

// Password strength checker
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

// Sign Up page
export default function SignUpPage({ onHomeClick, onEventsClick, onCalendarClick, onLoginClick, onAboutClick, onHelpClick, userAvatar, onAvatarClick }) {
  const [firstName,   setFirstName]   = useState("");
  const [lastName,    setLastName]    = useState("");
  const [email,       setEmail]       = useState("");
  const [password,    setPassword]    = useState("");
  const [confirm,     setConfirm]     = useState("");
  const [showPw,      setShowPw]      = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError,  setLastNameError]  = useState("");
  const [emailError,     setEmailError]     = useState("");
  const [pwError,        setPwError]        = useState("");
  const [confirmError,   setConfirmError]   = useState("");
  const [serverError,    setServerError]    = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const strength = getStrength(password);

  function isValidEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  }

  // Handle form submission
  async function handleSubmit() {
    let valid = true;
    setServerError("");

    if (!firstName.trim()) {
      setFirstNameError("First name is required.");
      valid = false;
    }
    if (!lastName.trim()) {
      setLastNameError("Last name is required.");
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

    try {
      const response = await fetch("https://career-center-volunteer-website-production.up.railway.app/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          full_name: `${firstName.trim()} ${lastName.trim()}`,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setServerError(data.error);
        setLoading(false);
        return;
      }

      setLoading(false);
      setSuccess(true);

    } catch {
      setLoading(false);
      setServerError("Could not connect to server. Make sure it is running.");
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleSubmit();
  }

  return (
    <div style={styles.page}>
      <Navbar onHomeClick={onHomeClick} onEventsClick={onEventsClick} onCalendarClick={onCalendarClick} onAboutClick={onAboutClick} onHelpClick={onHelpClick} userAvatar={userAvatar} onAvatarClick={onAvatarClick} />

      <div style={styles.authBody}>
        <div style={styles.authContainer}>
          <div style={styles.authHeader}>
            <div style={styles.authLogo}>S</div>
            <h1 style={styles.authTitle}>Create an account</h1>
            <p style={styles.authSubtitle}>Join the Sac State Career Center</p>
          </div>

          {/* First Name + Last Name side by side */}
          <div style={{ display: "flex", gap: "12px" }}>
            <div style={{ ...styles.formGroup, flex: 1 }}>
              <label style={styles.label}>First name</label>
              <input
                type="text"
                placeholder="Jane"
                value={firstName}
                onChange={(e) => { setFirstName(e.target.value); setFirstNameError(""); }}
                onKeyDown={handleKeyDown}
                style={{ ...styles.input, ...(firstNameError ? styles.inputError : {}) }}
              />
              {firstNameError && <p style={styles.errorText}>{firstNameError}</p>}
            </div>

            <div style={{ ...styles.formGroup, flex: 1 }}>
              <label style={styles.label}>Last name</label>
              <input
                type="text"
                placeholder="Hornet"
                value={lastName}
                onChange={(e) => { setLastName(e.target.value); setLastNameError(""); }}
                onKeyDown={handleKeyDown}
                style={{ ...styles.input, ...(lastNameError ? styles.inputError : {}) }}
              />
              {lastNameError && <p style={styles.errorText}>{lastNameError}</p>}
            </div>
          </div>

          {/* Email */}
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

          {/* Password */}
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

          {/* Confirm Password */}
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

          {serverError && <p style={styles.errorText}>{serverError}</p>}

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
