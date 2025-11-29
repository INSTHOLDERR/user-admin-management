
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../Slice/userSlice';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../../Components/navbar'
import './Home.css';
import { toast } from 'react-toastify';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo,random } = useSelector((state) => state.user);

  const Logout = () => {
    dispatch(logout());
    localStorage.removeItem('userInfo');
    toast.success('Logged out successfully!');
    navigate('/');
  };

  return (
    <>
      <Navbar/>
      <h1>{random}</h1>
      <div className="home-page">
        <div className="home-container">
          <div className="welcome-section">
            <h1 className="welcome-title">Welcome, {userInfo?.name}!</h1>
            <p className="user-email">Email: {userInfo?.email}</p>
          </div>

          <div className="action-buttons">
            <Link to="/profile" className="profile-link">
              <button className="profile-button">Go to Profile</button>
            </Link>

            <button className="logout-button" onClick={Logout}>Logout</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;