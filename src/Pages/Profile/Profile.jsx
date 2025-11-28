
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../Components/navbar';
import './Profile.css';

const Profile = () => {
  const { userInfo } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const Edit = () => {
    navigate('/edit-profile');
  };

  

  return (
    <>
      <Navbar/>
      <div className="profile-page">
        <div className="profile-container">
          <h2 className="profile-title">User Profile</h2>
          
          <div className="profile-avatar">
            <img 
              className="profile-image"
              src={userInfo?.profilePic || 'https://ui-avatars.com/api/?name=User&background=random'} 
              alt="Profile" 
            />
          </div>

          <div className="profile-info">
            <p className="profile-detail">
              <strong className="profile-label">Name:</strong> 
              <span className="profile-value">{userInfo?.username}</span>
            </p>
            <p className="profile-detail">
              <strong className="profile-label">Email:</strong> 
              <span className="profile-value">{userInfo?.email}</span>
            </p>
          </div>

          <button className="edit-profile-button" onClick={Edit}>
            Edit Profile
          </button>
        </div>
      </div>
    </>
  );
};

export default Profile;