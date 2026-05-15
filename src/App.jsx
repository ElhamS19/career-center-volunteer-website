import { useState } from "react";
import styles from "./styles";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUpPage from "./pages/SignUpPage";
import ProfilePage from "./pages/ProfilePage";
import SaveSuccessPage from "./pages/SaveSuccessPage";
import LogoutSuccessPage from "./pages/LogoutSuccessPage";
import Help from "./pages/Help";

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
    setCurrentPage("logoutSuccess");
  }

  return (
    <div style={styles.body}>
      {currentPage === "home" && (
        <Home
          onHomeClick={() => setCurrentPage("home")}
          onLoginClick={() => setCurrentPage("login")}
          onSignupClick={() => setCurrentPage("signup")}
          onHelpClick={() => setCurrentPage("help")}
          userAvatar={userAvatar}
          onAvatarClick={handleAvatarClick}
        />
      )}
      {currentPage === "login" && (
        <Login
          onHomeClick={() => setCurrentPage("home")}
          onSignUpClick={() => setCurrentPage("signup")}
          onHelpClick={() => setCurrentPage("help")}
          onLoginSuccess={handleLoginSuccess}
          userAvatar={userAvatar}
          onAvatarClick={handleAvatarClick}
        />
      )}
      {currentPage === "signup" && (
        <SignUpPage
          onHomeClick={() => setCurrentPage("home")}
          onLoginClick={() => setCurrentPage("login")}
          onHelpClick={() => setCurrentPage("help")}
          userAvatar={userAvatar}
          onAvatarClick={handleAvatarClick}
        />
      )}
      {currentPage === "profile" && (
        <ProfilePage
          key={user?.id || "profile"}
          user={user}
          onSave={handleProfileSave}
          onLogoutClick={handleLogout}
          onHomeClick={() => setCurrentPage("home")}
          onHelpClick={() => setCurrentPage("help")}
        />
      )}
      {currentPage === "saveSuccess" && (
        <SaveSuccessPage
          onHomeClick={() => setCurrentPage("home")}
          onHelpClick={() => setCurrentPage("help")}
          userAvatar={userAvatar}
          onAvatarClick={handleAvatarClick}
        />
      )}
      {currentPage === "logoutSuccess" && (
        <LogoutSuccessPage
          onLoginClick={() => setCurrentPage("login")}
          onHomeClick={() => setCurrentPage("home")}
          onHelpClick={() => setCurrentPage("help")}
          userAvatar={userAvatar}
          onAvatarClick={handleAvatarClick}
        />
      )}
      {currentPage === "help" && (
        <Help
          onHomeClick={() => setCurrentPage("home")}
          onLoginClick={() => setCurrentPage("login")}
          onHelpClick={() => setCurrentPage("help")}
          userAvatar={userAvatar}
          onAvatarClick={handleAvatarClick}
        />
      )}
    </div>
  );
}
