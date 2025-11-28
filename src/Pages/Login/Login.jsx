import  { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../Slice/userSlice';
import { useNavigate } from 'react-router-dom';
import API from '../../API/axios';
import './Login.css';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.user);

useEffect(() => {
  if (userInfo) {
    navigate('/home');
  }
}, [userInfo, navigate]);


  const Login = async (e) => {
    e.preventDefault();

     if (!email.trim() || !password.trim()) {
      toast.error("Please fill in all fields");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email format");
      return false;
    }
    try {
      const { data } = await API.post('/users/login', {
        email,
        password,
      });
      dispatch(loginSuccess(data));
      localStorage.setItem('userInfo', JSON.stringify(data));
       toast.success("Login successful!");
      navigate('/home');

    } catch (err) {
       const message = err.response?.data?.message || "Login failed";
      toast.error(message);
    }
};


  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="login-title">Login</h2>
        <form className="login-form" onSubmit={Login}>
          <input 
            className="login-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            
          />
          <input 
            className="login-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            
          />
          <button className="login-button" type="submit">Login</button>
          <Link to="/register">
  <p>Create an account? Register</p>
</Link>
        </form>
      </div>
    </div>
  );
};

export default Login;