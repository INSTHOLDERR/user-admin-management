import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../API/axios";
import axios from "axios";
import "./EditUser.css";
import { toast } from "react-toastify";
const EditUser = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [uploading, setUploading] = useState(false);

  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const adminInfo=JSON.parse(localStorage.getItem('adminInfo'));
        const token=adminInfo?.token;
        const { data } = await API.get(`/admin/users/${id}`,{
          headers:{
            Authorization:`Bearer ${token}`
          }
        });
        setUsername(data.username);
        setEmail(data.email);
        setProfilePic(data.profilePic);
      } catch (error) {
        console.error("Error fetching user", error);
      }
    };

    fetchUser();
  }, [id]);

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "userProfilePics");
    formData.append("cloud_name", "doyjmp5ie");

    setUploading(true);
    try {
      const { data } = await axios.post(
        "https://api.cloudinary.com/v1_1/doyjmp5ie/image/upload",
        formData
      );
      setProfilePic(data.secure_url);
    } catch (err) {
      alert("Image upload failed");
    }
    setUploading(false);
  };

  const handleSubmit = async (e) => {
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

      const adminInfo=JSON.parse(localStorage.getItem('adminInfo'));
      const token=adminInfo?.token;
      await API.put(`/admin/users/${id}`, {
        username,
        email,
        password: password || undefined, // optional password
        profilePic,
      },{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });

      alert("User updated successfully!");
      navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
      alert("Error updating user.");
    }
  };

  return (
    <div className="edit-user-container">
        
      <h2>Edit User</h2>
      <form onSubmit={handleSubmit} className="edit-user-form">
        <input
          type="text"
          placeholder="Name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="New Password (optional)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => uploadImage(e.target.files[0])}
        />

        {uploading && <p>Uploading image...</p>}

        {profilePic && (
          <img src={profilePic} alt="Preview" className="preview-img" />
        )}

        <button type="submit" className="submit-btn">
          Update User
        </button>
        <button
  type="button"
  className="return-btn"
  onClick={() => navigate('/admin/dashboard')}
>
  ← Return to Dashboard
</button>

      </form>
    </div>
  );
};

export default EditUser;
