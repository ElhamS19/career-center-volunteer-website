import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import './LogoutSuccessPage.css';

const LogoutSuccessPage = () => {
  const navigate = useNavigate();

  const handleReturnToLogin = () => {

    navigate('/');
  };

  return (
    <div className="logout-page-container">
      <Header />
      <main className="logout-main-content">
        <div className="logout-message-box">
          <h2>Logged out successfully!</h2>
          <button
            onClick={handleReturnToLogin}
            className="return-login-btn"
          >
            Return to login page
          </button>
        </div>
      </main>
    </div>
  );
};

export default LogoutSuccessPage;