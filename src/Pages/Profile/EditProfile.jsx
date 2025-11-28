import  { useState } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { loginSuccess } from '../../Slice/userSlice';
import { useNavigate } from 'react-router-dom';
import API from '../../API/axios';
import Navbar from '../../Components/navbar';
import './EditProfile.css';

const EditProfile = () => {
  const { userInfo } = useSelector((state) => state.user);
  const [username, setUsername] = useState(userInfo.username);
  const [profilePic, setProfilePic] = useState(userInfo.profilePic || '');
  const [uploading, setUploading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const uploadImage = async (file) => {

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'userProfilePics');
    formData.append('cloud_name', 'doyjmp5ie');

    setUploading(true);
    try {
      const { data } = await axios.post(
        'https://api.cloudinary.com/v1_1/doyjmp5ie/image/upload',
        formData
      );

      setProfilePic(data.secure_url);
    } catch (err) {
      alert('Image upload failed');
    }
    setUploading(false);
  };

  const Update = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await API.put(
        '/users/profile',
        { username, profilePic },
        config
      );

      dispatch(loginSuccess(data));
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/profile');
    } catch (err) {
      alert('Update failed');
      console.error(err);
    }
  };

  return (
    <>
      <Navbar/>
      <div className="edit-profile-page">
        <div className="edit-profile-container">
          <h2 className="edit-profile-title">Edit Profile</h2>
          
          <form className="edit-profile-form" onSubmit={Update}>
            <div className="input-group">
              <input
                className="edit-profile-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your Name"
                required
              />
            </div>

            <div className="input-group">
              <input
                className="edit-profile-input disabled"
                type="email"
                value={userInfo.email}
                disabled
              />
            </div>

            <div className="file-upload-section">
              <label className="file-upload-label">
                <input
                  className="file-upload-input"
                  type="file"
                  accept="image/*"
                  onChange={(e) => uploadImage(e.target.files[0])}
                />
                <span className="file-upload-text">Choose Profile Picture</span>
              </label>
            </div>

            {uploading && <p className="upload-status">Uploading image...</p>}
            
            {profilePic && (
              <div className="image-preview">
                <img className="preview-image" src={profilePic} alt="Preview" />
              </div>
            )}

            <button className="save-changes-button" type="submit">
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditProfile;