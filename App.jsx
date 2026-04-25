import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProfilePage from './components/ProfilePage';
import SaveSuccessPage from './components/SaveSuccessPage';
import LogoutSuccessPage from './components/LogoutSuccessPage';
import './App.css';

function App() {
  return (

    <Router>
      <div className="App">
        {}
        <Routes>
          {}
          {/* The main profile page is shown on the default path '/' */}
          <Route path="/" element={<ProfilePage />} />

          {/* When the path changes to '/saved-successfully', the corresponding page is shown */}
          <Route path="/saved-successfully" element={<SaveSuccessPage />} />

          {/* When the path changes to '/logged-out-successfully', the logout success page is shown */}
          <Route path="/logged-out-successfully" element={<LogoutSuccessPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;