import { useState } from "react";
import Navbar from "../components/Navbar";
import styles from "../styles";

export default function ForgotPasswordPage({
  onNext,
  onBackClick,
  onHomeClick,
  onHelpClick,
  userAvatar,
  onAvatarClick,
}) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function handleEmailNext() {
    if (!isValidEmail(email)) {
      setErrors({ email: "Please enter a valid email address." });
      return;
    }

    setErrors({});
    setStep(2);
  }

  function handleCodeChange(value) {
    const numericValue = value.replace(/\D/g, "").slice(0, 6);
    setCode(numericValue);
    setErrors((prev) => ({ ...prev, code: "" }));
  }

  function handleCodeNext() {
    if (code.length < 6) {
      setErrors({ code: "Please enter a 6-digit code." });
      return;
    }

    setErrors({});
    onNext?.(email.trim());
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

          <div style={styles.authActionRow}>
            <button style={styles.ghostBtn} type="button" onClick={onBackClick}>
              Back to login
            </button>
            <button
              style={styles.primaryBtn}
              type="button"
              onClick={step === 1 ? handleEmailNext : handleCodeNext}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
