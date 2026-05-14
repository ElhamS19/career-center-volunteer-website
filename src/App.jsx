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

  return (
    <div style={styles.body}>
      {/* Watermark background */}
      <div style={styles.watermark}></div>

      {currentPage === "home" && (
        <Home onLoginClick={() => setCurrentPage("login")} />
      )}
      {currentPage === "login" && (
        <Login
          onHomeClick={() => setCurrentPage("home")}
          onSignUpClick={() => setCurrentPage("signup")}
          // Assuming successful login takes them to their profile
          onLoginSuccess={() => setCurrentPage("profile")} 
        />
      )}
      {currentPage === "signup" && (
        <SignUpPage
          onHomeClick={() => setCurrentPage("home")}
          onLoginClick={() => setCurrentPage("login")}
        />
      )}

      {currentPage === "profile" && (
  <ProfilePage 
    onSave={() => setCurrentPage("saveSuccess")} 
    onLogoutClick={() => setCurrentPage("logoutSuccess")}
    onHomeClick={() => setCurrentPage("home")}
  />
)}

{currentPage === "saveSuccess" && (
  <SaveSuccessPage onHomeClick={() => setCurrentPage("home")} />
)}

{currentPage === "logoutSuccess" && (
  <LogoutSuccessPage 
    onLoginClick={() => setCurrentPage("login")} 
    onHomeClick={() => setCurrentPage("home")}
  />
)}
    </div>
  );
}