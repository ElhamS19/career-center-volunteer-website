import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import './ProfilePage.css';

const ProfilePage = () => {
 
  const [profile, setProfile] = useState({
    fullName: 'John Harry',
    email: 'johnharry@gmail.com',
    password: '**************',
    phone: '(916) 1234 5678',
  });

  const navigate = useNavigate();


  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSaveChanges = () => {
 
    console.log('Saving changes:', profile);
    navigate('/saved-successfully');
  };

  const handleLogOut = () => {

    console.log('Logging out...');
    navigate('/logged-out-successfully');
  };

  return (
    <div className="profile-page-container">
      <Header />
      <main className="profile-main-content">
        <div className="profile-card">
          <div className="profile-info-header">
            <div className="profile-avatar-large">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            {/* The name here is also an editable input field */}
            <input
              type="text"
              name="fullName"
              value={profile.fullName}
              onChange={handleInputChange}
              className="editable-name-input"
            />
          </div>

          <form className="profile-form">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={profile.fullName}
                onChange={handleInputChange}
                className="editable-input"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleInputChange}
                className="editable-input"
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={profile.password}
                onChange={handleInputChange}
                className="editable-input"
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="text"
                name="phone"
                value={profile.phone}
                onChange={handleInputChange}
                className="editable-input"
              />
            </div>
          </form>

          <div className="profile-actions-buttons">
            <button
              onClick={handleSaveChanges}
              className="save-changes-btn"
            >
              Save changes
            </button>
            <button
              onClick={handleLogOut}
              className="log-out-btn"
            >
              Log out
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;