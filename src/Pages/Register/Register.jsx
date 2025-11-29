import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from '../../Slice/userSlice';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../../API/axios';

import './Register.css';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const [username, setName] = useState('');
  const [email, setEmail] = useState('');
  const [emailExists, setEmailExists] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // 👁️ New states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    if (userInfo) {
      navigate('/home');
    }
  }, [userInfo, navigate]);

  const checkEmailExists = async (emailValue) => {
    try {
      const { data } = await API.post("/users/check-email", { email: emailValue });
      setEmailExists(data.exists);
    } catch {
      setEmailExists(false);
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    if (value.includes("@")) {
      checkEmailExists(value);
    }
  };

  const RegisterUser = async (e) => {
    e.preventDefault();

    if (username.trim().length < 4) {
      toast.error("Username must be at least 4 characters");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email format");
      return;
    }

    if (emailExists) {
      toast.error("Email already exists. Try another.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const { data } = await API.post('/users/register', {
        username,
        email,
        password,
      });

      localStorage.setItem('userInfo', JSON.stringify(data));
      dispatch(loginSuccess(data));
      toast.success(data.message);
      navigate('/home');

    } catch (err) {
      const errorMessage =
        err.response?.data?.message || 'Registration failed.';
      toast.error(errorMessage);
    }
  };

  const passwordMatch = confirmPassword.length > 0 ? password === confirmPassword : null;

  return (
    <div className="register-page">
      <div className="register-container">
        <h2 className="register-title">Register</h2>

        <form className="register-form" onSubmit={RegisterUser}>

          <input
            className="register-input"
            type="text"
            placeholder="Username (min 4 letters)"
            value={username}
            onChange={(e) => setName(e.target.value)}
          />

          {/* Email */}
          <div className="input-wrapper">
            <input
              className="register-input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
            />

            {email.length > 3 && (
              <span className={`tick ${emailExists ? "red" : "green"}`}>
                {emailExists ? "✖" : "✔"}
              </span>
            )}
          </div>

          {/* Password */}
          <div className="input-wrapper">
            <input
              className="register-input"
              type={showPassword ? "text" : "password"}
              placeholder="Password (min 6 letters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* 👁️ toggle icon */}
            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          {/* Confirm Password */}
          <div className="input-wrapper">
            <input
              className="register-input"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {/* ✔ or ✖ */}
            {confirmPassword.length > 0 && (
              <span className={`tick ${passwordMatch ? "green" : "red"}`}>
                {passwordMatch ? "✔" : "✖"}
              </span>
            )}

            {/* 👁️ icon */}
            <span
              className="eye-icon"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <button className="register-button" type="submit">
            Register
          </button>

          <Link to="/"><p>Already have an account? Login</p></Link>

        </form>
      </div>
    </div>
  );
};

export default Register;
