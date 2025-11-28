import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../Slice/userSlice';
import { useNavigate } from 'react-router-dom';

import { toast } from 'react-toastify';

import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../API/axios';
import './Register.css';
import 'react-toastify/dist/ReactToastify.css';


const Register = () => {

  const [username, setName] = useState('');
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


  const Register = async (e) => {
    e.preventDefault();


      if (username.trim().length < 3) {
    toast.error('Name must be at least 3 characters');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    toast.error('Invalid email format');
    return;
  }

  if (password.trim().length < 4) {
    toast.error('Password must be at least 4 characters');
    return;
  }

    try {
        
      const { data } = await API.post('/users/register', {
        username,
        email,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
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

  return (

    <div className="register-page">
      <div className="register-container">
        <h2 className="register-title">Register</h2>
        <form className="register-form" onSubmit={Register}>
          <input 
            className="register-input"
            type="text" 
            placeholder="Name"
            value={username}
            onChange={(e) => setName(e.target.value)} 
            
          />
          <input 
            className="register-input"
            type="email" 
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            
          />
          <input 
            className="register-input"
            type="password" 
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            
          />
          <button className="register-button" type="submit">Register</button>
        <Link to="/">
  <p>Already have an account? Login</p>
</Link>
        </form>
      </div>
    </div>
  );
};

export default Register;