import { useState } from "react";
import styles from "./styles";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUpPage from "./pages/SignUpPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ProfilePage from "./pages/ProfilePage";
import PasswordChangePage from "./pages/PasswordChangePage";
import SaveSuccessPage from "./pages/SaveSuccessPage";
import LogoutSuccessPage from "./pages/LogoutSuccessPage";
import Help from "./pages/Help";
import Events from "./pages/Events";
import Calendar from "./pages/Calendar";
import About from "./pages/About";

/* key frame for fade in animation */
const styleTag = document.createElement("style");
styleTag.innerHTML = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  * { box-sizing: border-box; }
`;
document.head.appendChild(styleTag);

function getInitials(fullName) {
  if (!fullName) return "?";
  const parts = fullName.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last  = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase() || "?";
}

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [userAvatar, setUserAvatar] = useState("");
  const [user, setUser] = useState(null);
  const [registeredEventIds, setRegisteredEventIds] = useState([]);
  const [passwordPageMode, setPasswordPageMode] = useState("account");
  const [resetEmail, setResetEmail] = useState("");
  const isLoggedIn = Boolean(user);

  function handleLoginSuccess(userData) {
    const fullName = userData?.fullName || `${userData?.firstName || ""} ${userData?.lastName || ""}`.trim();
    setUser(userData);
    setUserAvatar(getInitials(fullName));
    setCurrentPage("profile");
  }

  function handleProfileSave(updatedUser) {
    const fullName = updatedUser?.fullName || `${updatedUser?.firstName || ""} ${updatedUser?.lastName || ""}`.trim();
    setUser((prev) => ({ ...prev, ...updatedUser }));
    setUserAvatar(getInitials(fullName));
    setCurrentPage("saveSuccess");
  }

  function handleAvatarClick() {
    if (userAvatar) {
      setCurrentPage("profile");
    }
  }

  function handleLogout() {
    setUser(null);
    setUserAvatar("");
    setRegisteredEventIds([]);
    setCurrentPage("logoutSuccess");
  }

  function handleToggleEventRegistration(eventId) {
    setRegisteredEventIds((prev) =>
      prev.includes(eventId)
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId]
    );
  }

  function handleOpenChangePassword(mode = "account") {
    setPasswordPageMode(mode);
    setCurrentPage("passwordChange");
  }

  function handleForgotPasswordNext(email) {
    setResetEmail(email);
    handleOpenChangePassword("reset");
  }

  async function handlePasswordSubmit({ currentPassword, newPassword }) {
    if (!user?.id) {
      throw new Error("You need to be signed in to change your password.");
    }

    const response = await fetch("http://https://career-center-volunteer-website-production.up.railway.app/api/password/change", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        currentPassword,
        newPassword,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to update password.");
    }

    return data;
  }

  async function handleResetPasswordSubmit({ newPassword }) {
    if (!resetEmail) {
      throw new Error("Missing reset email.");
    }

    const response = await fetch("http://https://career-center-volunteer-website-production.up.railway.app/api/password/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: resetEmail,
        newPassword,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to reset password.");
    }

    return data;
  }

  return (
    <div style={styles.body}>
      {currentPage === "home" && (
        <Home
          onHomeClick={() => setCurrentPage("home")}
          onLoginClick={() => setCurrentPage("login")}
          onSignupClick={() => setCurrentPage("signup")}
          onEventsClick={() => setCurrentPage("events")}
          onCalendarClick={() => setCurrentPage("calendar")}
          onHelpClick={() => setCurrentPage("help")}
          onAboutClick={() => setCurrentPage("about")}
          userAvatar={userAvatar}
          onAvatarClick={handleAvatarClick}
          onLogoutClick={handleLogout}
          isLoggedIn={isLoggedIn}
          registeredEventIds={registeredEventIds}
          onToggleEventRegistration={handleToggleEventRegistration}
        />
      )}
      {currentPage === "events" && (
        <Events
          onHomeClick={() => setCurrentPage("home")}
          onLoginClick={() => setCurrentPage("login")}
          onEventsClick={() => setCurrentPage("events")}
          onCalendarClick={() => setCurrentPage("calendar")}
          onHelpClick={() => setCurrentPage("help")}
          onAboutClick={() => setCurrentPage("about")}
          userAvatar={userAvatar}
          onAvatarClick={handleAvatarClick}
          onLogoutClick={handleLogout}
          isLoggedIn={isLoggedIn}
          registeredEventIds={registeredEventIds}
          onToggleEventRegistration={handleToggleEventRegistration}
        />
      )}
      {currentPage === "calendar" && (
        <Calendar
          onHomeClick={() => setCurrentPage("home")}
          onLoginClick={() => setCurrentPage("login")}
          onEventsClick={() => setCurrentPage("events")}
          onCalendarClick={() => setCurrentPage("calendar")}
          onHelpClick={() => setCurrentPage("help")}
          onAboutClick={() => setCurrentPage("about")}
          userAvatar={userAvatar}
          onAvatarClick={handleAvatarClick}
          onLogoutClick={handleLogout}
          isLoggedIn={isLoggedIn}
          registeredEventIds={registeredEventIds}
          onToggleEventRegistration={handleToggleEventRegistration}
        />
      )}
      {currentPage === "login" && (
        <Login
          onHomeClick={() => setCurrentPage("home")}
          onEventsClick={() => setCurrentPage("events")}
          onCalendarClick={() => setCurrentPage("calendar")}
          onSignUpClick={() => setCurrentPage("signup")}
          onForgotPasswordClick={() => setCurrentPage("forgotPassword")}
          onHelpClick={() => setCurrentPage("help")}
          onAboutClick={() => setCurrentPage("about")}
          onLoginSuccess={handleLoginSuccess}
          userAvatar={userAvatar}
          onAvatarClick={handleAvatarClick}
          onLogoutClick={handleLogout}
        />
      )}
      {currentPage === "forgotPassword" && (
        <ForgotPasswordPage
          onNext={handleForgotPasswordNext}
          onBackClick={() => setCurrentPage("login")}
          onHomeClick={() => setCurrentPage("home")}
          onEventsClick={() => setCurrentPage("events")}
          onCalendarClick={() => setCurrentPage("calendar")}
          onHelpClick={() => setCurrentPage("help")}
          onAboutClick={() => setCurrentPage("about")}
          userAvatar={userAvatar}
          onAvatarClick={handleAvatarClick}
          onLogoutClick={handleLogout}
        />
      )}
      {currentPage === "signup" && (
        <SignUpPage
          onHomeClick={() => setCurrentPage("home")}
          onEventsClick={() => setCurrentPage("events")}
          onCalendarClick={() => setCurrentPage("calendar")}
          onLoginClick={() => setCurrentPage("login")}
          onHelpClick={() => setCurrentPage("help")}
          onAboutClick={() => setCurrentPage("about")}
          userAvatar={userAvatar}
          onAvatarClick={handleAvatarClick}
          onLogoutClick={handleLogout}
        />
      )}
      {currentPage === "profile" && (
        <ProfilePage
          key={user?.id || "profile"}
          user={user}
          onSave={handleProfileSave}
          onChangePasswordClick={() => handleOpenChangePassword("account")}
          onLogoutClick={handleLogout}
          onHomeClick={() => setCurrentPage("home")}
          onEventsClick={() => setCurrentPage("events")}
          onCalendarClick={() => setCurrentPage("calendar")}
          onLoginClick={() => setCurrentPage("login")}
          onHelpClick={() => setCurrentPage("help")}
          onAboutClick={() => setCurrentPage("about")}
        />
      )}
      {currentPage === "passwordChange" && (
        <PasswordChangePage
          mode={passwordPageMode}
          user={user}
          resetEmail={resetEmail}
          onSubmit={passwordPageMode === "account" ? handlePasswordSubmit : handleResetPasswordSubmit}
          onBackClick={() => setCurrentPage(passwordPageMode === "account" ? "profile" : "forgotPassword")}
          onHomeClick={() => setCurrentPage("home")}
          onEventsClick={() => setCurrentPage("events")}
          onCalendarClick={() => setCurrentPage("calendar")}
          onLoginClick={() => setCurrentPage("login")}
          onHelpClick={() => setCurrentPage("help")}
          onAboutClick={() => setCurrentPage("about")}
          userAvatar={userAvatar}
          onAvatarClick={handleAvatarClick}
          onLogoutClick={handleLogout}
        />
      )}
      {currentPage === "saveSuccess" && (
        <SaveSuccessPage
          onHomeClick={() => setCurrentPage("home")}
          onEventsClick={() => setCurrentPage("events")}
          onCalendarClick={() => setCurrentPage("calendar")}
          onLoginClick={() => setCurrentPage("login")}
          onHelpClick={() => setCurrentPage("help")}
          onAboutClick={() => setCurrentPage("about")}
          userAvatar={userAvatar}
          onAvatarClick={handleAvatarClick}
          onLogoutClick={handleLogout}
        />
      )}
      {currentPage === "logoutSuccess" && (
        <LogoutSuccessPage
          onLoginClick={() => setCurrentPage("login")}
          onHomeClick={() => setCurrentPage("home")}
          onEventsClick={() => setCurrentPage("events")}
          onCalendarClick={() => setCurrentPage("calendar")}
          onHelpClick={() => setCurrentPage("help")}
          onAboutClick={() => setCurrentPage("about")}
          userAvatar={userAvatar}
          onAvatarClick={handleAvatarClick}
          onLogoutClick={handleLogout}
        />
      )}
      {currentPage === "help" && (
        <Help
          onHomeClick={() => setCurrentPage("home")}
          onEventsClick={() => setCurrentPage("events")}
          onCalendarClick={() => setCurrentPage("calendar")}
          onLoginClick={() => setCurrentPage("login")}
          onHelpClick={() => setCurrentPage("help")}
          onAboutClick={() => setCurrentPage("about")}
          userAvatar={userAvatar}
          onAvatarClick={handleAvatarClick}
          onLogoutClick={handleLogout}
        />
      )}
      {currentPage === "about" && (
        <About
          onHomeClick={() => setCurrentPage("home")}
          onEventsClick={() => setCurrentPage("events")}
          onCalendarClick={() => setCurrentPage("calendar")}
          onAboutClick={() => setCurrentPage("about")}
          onHelpClick={() => setCurrentPage("help")}
          onLoginClick={() => setCurrentPage("login")}
          userAvatar={userAvatar}
          onAvatarClick={handleAvatarClick}
          onLogoutClick={handleLogout}
        />
      )}
    </div>
  );
}
