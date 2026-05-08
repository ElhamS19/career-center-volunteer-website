import { useState } from "react";
import styles from "./styles.js";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUpPage from "./pages/SignUpPage";
import ProfilePage from "./pages/ProfilePage";
import SaveSuccessPage from "./pages/SaveSuccessPage";
import LogoutSuccessPage from "./pages/LogoutSuccessPage";

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");

  return (
    <div style={styles.body}>
      {/* Watermark background inherited from team styles */}
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

      {/* --- Your Pages Integrated Here --- */}
      {currentPage === "profile" && (
        <ProfilePage 
          onSave={() => setCurrentPage("saved")} 
          onLogoutClick={() => setCurrentPage("logout")} 
          onHomeClick={() => setCurrentPage("home")}
        />
      )}
      {currentPage === "saved" && (
        <SaveSuccessPage onHomeClick={() => setCurrentPage("home")} />
      )}
      {currentPage === "logout" && (
        <LogoutSuccessPage onLoginClick={() => setCurrentPage("login")} />
      )}
    </div>
  );
}