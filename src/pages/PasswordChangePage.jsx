import { useState } from "react";
import Navbar from "../components/Navbar";
import styles from "../styles";

const emptyForm = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function PasswordChangePage({
  mode = "account",
  resetEmail,
  onSubmit,
  onBackClick,
  onHomeClick,
  onEventsClick,
  onLoginClick,
  onHelpClick,
  userAvatar,
  onAvatarClick,
}) {
  const isAccountMode = mode === "account";
  const [form, setForm] = useState(emptyForm);
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const pageTitle = isAccountMode ? "Change password" : "Set a new password";
  const pageSubtitle = isAccountMode
    ? "Confirm your current password, then choose a new one."
    : "Choose and confirm your new password.";
  const submitLabel = isAccountMode ? "Update password" : "Save new password";
  const backLabel = isAccountMode ? "Back to account" : "Back";

  function handleFieldChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setServerError("");
  }

  function togglePassword(field) {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  }

  function validateForm() {
    const nextErrors = {};

    if (isAccountMode && !form.currentPassword) {
      nextErrors.currentPassword = "Enter your current password.";
    }

    if (form.newPassword.length < 6) {
      nextErrors.newPassword = "Your new password must be at least 6 characters.";
    }

    if (form.confirmPassword !== form.newPassword) {
      nextErrors.confirmPassword = "The new passwords do not match.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validateForm()) {
      return;
    }

    if (typeof onSubmit !== "function") {
      setServerError("This password flow is not connected yet.");
      return;
    }

    setLoading(true);
    setServerError("");

    try {
      const result = await onSubmit({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      setSuccessMessage(result.message || "Password updated successfully.");
      setForm(emptyForm);
    } catch (error) {
      setServerError(error.message || "Unable to update password.");
    } finally {
      setLoading(false);
    }
  }

  function renderPasswordField(field, label, placeholder) {
    return (
      <div style={styles.formGroup}>
        <label style={styles.label}>{label}</label>
        <div style={styles.passwordWrap}>
          <input
            type={showPassword[field] ? "text" : "password"}
            placeholder={placeholder}
            value={form[field]}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            style={{
              ...styles.input,
              paddingRight: "56px",
              ...(errors[field] ? styles.inputError : {}),
            }}
            disabled={loading}
          />
          <button
            style={styles.passwordToggle}
            type="button"
            onClick={() => togglePassword(field)}
            disabled={loading}
          >
            {showPassword[field] ? "Hide" : "Show"}
          </button>
        </div>
        {errors[field] && <p style={styles.errorText}>{errors[field]}</p>}
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <Navbar
        onHomeClick={onHomeClick}
        onEventsClick={onEventsClick}
        onLoginClick={onLoginClick}
        onHelpClick={onHelpClick}
        userAvatar={userAvatar}
        onAvatarClick={onAvatarClick}
      />

      <div style={styles.authBody}>
        <div style={styles.authContainer}>
          <div style={styles.authHeader}>
            <div style={styles.authLogo}>S</div>
            <h1 style={styles.authTitle}>{pageTitle}</h1>
            <p style={styles.authSubtitle}>{pageSubtitle}</p>
          </div>

          {!isAccountMode && resetEmail && (
            <div style={styles.successBox}>
              Resetting password for {resetEmail}
            </div>
          )}

          {successMessage ? (
            <>
              <div style={styles.successBox}>{successMessage}</div>
              <div style={styles.authActionRow}>
                <button style={styles.primaryBtn} type="button" onClick={onBackClick}>
                  {backLabel}
                </button>
                <button style={styles.ghostBtn} type="button" onClick={onHomeClick}>
                  Return home
                </button>
              </div>
            </>
          ) : (
            <>
              {isAccountMode &&
                renderPasswordField("currentPassword", "Current password", "Enter your current password")}
              {renderPasswordField("newPassword", "New password", "Choose a new password")}
              {renderPasswordField("confirmPassword", "Confirm new password", "Re-enter your new password")}

              {serverError && <p style={styles.errorText}>{serverError}</p>}

              <div style={styles.authActionRow}>
                <button style={styles.ghostBtn} type="button" onClick={onBackClick} disabled={loading}>
                  {backLabel}
                </button>
                <button style={styles.primaryBtn} type="button" onClick={handleSubmit} disabled={loading}>
                  {loading ? "Saving..." : submitLabel}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
