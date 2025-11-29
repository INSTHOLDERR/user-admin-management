import React, { useState } from 'react';
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../Slice/userSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = () => {
    setShowConfirm(true);
  };

  const confirmLogout = () => {
    dispatch(logout());
    localStorage.removeItem('userInfo');
    navigate('/');
  };

  const cancelLogout = () => {
    setShowConfirm(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-logo">
            <Link to="/home">UserManagement</Link>
          </div>

          <ul className="navbar-menu">
            <li className="navbar-item"><Link to="/home" className="navbar-link">Home</Link></li>
            <li className="navbar-item"><Link to="/profile" className="navbar-link">Profile</Link></li>
            <li className="navbar-item">
              <button onClick={handleLogout} className="navbar-logout-btn">
                Logout
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* 🔥 Custom Confirm Modal */}
      {showConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <h3>Are you sure?</h3>
            <p>You will be logged out of your account.</p>

            <div className="confirm-buttons">
              <button className="btn-cancel" onClick={cancelLogout}>Cancel</button>
              <button className="btn-logout" onClick={confirmLogout}>Logout</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
