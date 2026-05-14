import { useState } from "react";
import styles from "./styles";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUpPage from "./pages/SignUpPage";
import ProfilePage from "./pages/ProfilePage";
import SaveSuccessPage from "./pages/SaveSuccessPage";
import LogoutSuccessPage from "./pages/LogoutSuccessPage";

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

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [userAvatar, setUserAvatar] = useState("");

  function handleLoginSuccess() {
    setUserAvatar("JH");
    setCurrentPage("profile");
  }

  function handleAvatarClick() {
    if (userAvatar) {
      setCurrentPage("profile");
    }
  }

  function handleLogout() {
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
          userAvatar={userAvatar}
          onAvatarClick={handleAvatarClick}
        />
      )}
      {currentPage === "login" && (
        <Login
          onHomeClick={() => setCurrentPage("home")}
          onSignUpClick={() => setCurrentPage("signup")}
          onLoginSuccess={handleLoginSuccess}
          userAvatar={userAvatar}
          onAvatarClick={handleAvatarClick}
        />
      )}
      {currentPage === "signup" && (
        <SignUpPage
          onHomeClick={() => setCurrentPage("home")}
          onLoginClick={() => setCurrentPage("login")}
          userAvatar={userAvatar}
          onAvatarClick={handleAvatarClick}
        />
      )}

      {currentPage === "profile" && (
        <ProfilePage 
          onSave={() => setCurrentPage("saveSuccess")} 
          onLogoutClick={handleLogout}
          onHomeClick={() => setCurrentPage("home")}
        />
      )}

      {currentPage === "saveSuccess" && (
        <SaveSuccessPage
          onHomeClick={() => setCurrentPage("home")}
          userAvatar={userAvatar}
          onAvatarClick={handleAvatarClick}
        />
      )}

      {currentPage === "logoutSuccess" && (
        <LogoutSuccessPage 
          onLoginClick={() => setCurrentPage("login")} 
          onHomeClick={() => setCurrentPage("home")}
          userAvatar={userAvatar}
          onAvatarClick={handleAvatarClick}
        />
      )}
    </div>
  );
}