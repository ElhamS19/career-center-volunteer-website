import { useState } from "react";
import Navbar from "../components/Navbar";
import styles from "../styles";

export default function ForgotPasswordPage({
  onNext,
  onBackClick,
  onHomeClick,
  onEventsClick,
  onCalendarClick,
  onAboutClick,
  onHelpClick,
  userAvatar,
  onAvatarClick,
}) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  async function handleEmailNext() {
    if (!isValidEmail(email)) {
      setErrors({ email: "Please enter a valid email address." });
      return;
    }

    setErrors({});
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("https://career-center-volunteer-website-production.up.railway.app/api/password/request-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ email: data.error || "Unable to send reset code. Please try again." });
        return;
      }

      setStep(2);
      setMessage(data.message || "A 6-digit code has been sent to your email.");
    } catch (error) {
      console.error("Request reset code failed:", error);
      setErrors({ email: "Unable to send reset code. Please try again later." });
    } finally {
      setLoading(false);
    }
  }

  function handleCodeChange(value) {
    const numericValue = value.replace(/\D/g, "").slice(0, 6);
    setCode(numericValue);
    setErrors((prev) => ({ ...prev, code: "" }));
  }

  async function handleCodeNext() {
    if (code.length < 6) {
      setErrors({ code: "Please enter a 6-digit code." });
      return;
    }

    setErrors({});
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("https://career-center-volunteer-website-production.up.railway.app/api/password/verify-reset-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), code }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ code: data.error || "Invalid or expired code." });
        return;
      }

      setMessage(data.message || "Code verified. You may reset your password.");
      onNext?.(email.trim());
    } catch (error) {
      console.error("Verify reset code failed:", error);
      setErrors({ code: "Unable to verify code. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(event) {
    if (event.key !== "Enter") {
      return;
    }

    if (step === 1) {
      handleEmailNext();
      return;
    }

    handleCodeNext();
  }

  return (
    <div style={styles.page}>
      <Navbar
        onHomeClick={onHomeClick}
        onEventsClick={onEventsClick}
        onCalendarClick={onCalendarClick}
        onAboutClick={onAboutClick}
        onHelpClick={onHelpClick}
        userAvatar={userAvatar}
        onAvatarClick={onAvatarClick}
      />

      <div style={styles.authBody}>
        <div style={styles.authContainer}>
          <div style={styles.authHeader}>
            <div style={styles.authLogo}>S</div>
            <h1 style={styles.authTitle}>Forgot password</h1>
            <p style={styles.authSubtitle}>
              Enter your email, then enter the 6-digit code to continue.
            </p>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              placeholder="hornet@csus.edu"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => ({ ...prev, email: "" }));
              }}
              onKeyDown={handleKeyDown}
              style={{ ...styles.input, ...(errors.email ? styles.inputError : {}) }}
            />
            {errors.email && <p style={styles.errorText}>{errors.email}</p>}
          </div>

          {step === 2 && (
            <div style={styles.formGroup}>
              <label style={styles.label}>Code</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Enter 6-digit code"
                value={code}
                onChange={(e) => handleCodeChange(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{ ...styles.input, ...(errors.code ? styles.inputError : {}) }}
              />
              {errors.code && <p style={styles.errorText}>{errors.code}</p>}
            </div>
          )}

          {message && <div style={styles.successBox}>{message}</div>}

          <div style={styles.authActionRow}>
            <button style={styles.ghostBtn} type="button" onClick={onBackClick}>
              Back to login
            </button>
            <button
              style={styles.primaryBtn}
              type="button"
              onClick={step === 1 ? handleEmailNext : handleCodeNext}
              disabled={loading}
            >
              {loading ? "Please wait..." : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
