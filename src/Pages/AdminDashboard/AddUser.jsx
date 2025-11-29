import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../API/axios";
import axios from "axios";
import "./AddUser.css"; // styling
import { toast } from "react-toastify";

const AddUser = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [uploading, setUploading] = useState(false);

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
      toast.error("Image upload failed");
      console.log(err);
      
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
      const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
      const token = adminInfo?.token;
      if(!token){
        toast.error("admin not authenticated");
        return
      } 

      await API.post("/admin/users", {
        username,
        email,
        password,
        profilePic,
      },{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });

      toast.success("User added successfully!");
      navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Error adding user.");
    }
  };

  return (
    <div className="add-user-container">
      <h2>Add New User</h2>
      <form onSubmit={handleSubmit} className="add-user-form">
        <input
          type="text"
          placeholder="Name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          
        />

        <input
          type="password"
          placeholder="Password"
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
          Add User
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

export default AddUser;
