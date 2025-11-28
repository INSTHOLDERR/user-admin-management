import React from 'react';
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../Slice/userSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const Logout = () => {
    let confirm=window.confirm("sure about logout");
    if(!confirm)return;
    dispatch(logout());
    localStorage.removeItem('userInfo');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/home">UserManagement</Link>
        </div>
        <ul className="navbar-menu">
          <li className="navbar-item"><Link to="/home" className="navbar-link">Home</Link></li>
          <li className="navbar-item"><Link to="/profile" className="navbar-link">Profile</Link></li>
          <li className="navbar-item"><button onClick={Logout} className="navbar-logout-btn">Logout</button></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
