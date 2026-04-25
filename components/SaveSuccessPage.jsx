import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import './SaveSuccessPage.css';

const SaveSuccessPage = () => {
  const navigate = useNavigate();

  const handleReturnHome = () => {

    navigate('/');
  };

  return (
    <div className="success-page-container">
      <Header />
      <main className="success-main-content">
        <div className="success-message-box">
          <h2>Your changes have been saved successfully!</h2>
          <button
            onClick={handleReturnHome}
            className="return-home-btn"
          >
            Return to home page
          </button>
        </div>
      </main>
    </div>
  );
};

export default SaveSuccessPage;