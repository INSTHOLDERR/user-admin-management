import { useState } from "react"
import API from "../../API/axios";
import { useNavigate } from "react-router-dom";
import { adminLoginSuccess } from "../../Slice/adminSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
const AdminLogin = () => {

    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const navigate=useNavigate();
    const dispatch=useDispatch()

    const Login=async (e) => {
    e.preventDefault();
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
      const { data } = await API.post('/admin/login', { email, password });
      dispatch(adminLoginSuccess(data));
     localStorage.setItem('adminInfo', JSON.stringify(data));
    navigate('/admin/dashboard', { replace: true });

    } catch (err) {
      console.error(err);
    }
  };
  return (
    
      <div className="login-page">
      <div className="login-container">
        <h2 className="login-title">Admin Login</h2>
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
          
        </form>
      </div>
    </div>
    
  )
}

export default AdminLogin
