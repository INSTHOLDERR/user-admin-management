import { useEffect, useState } from "react";
import "./AdminDashboard.css"; 

import API from "../../API/axios";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { adminLogout } from "../../Slice/adminSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminDashboard = () => {
const [users,setUsers]=useState([]);
const [searchQuery,setSearchQuery]=useState("");
const dispatch=useDispatch()
const navigate=useNavigate()

useEffect(()=>{
 const fetchUsers=async()=>{
    try {
      const adminInfo=JSON.parse(localStorage.getItem("adminInfo"));
      const token=adminInfo?.token;
        const response=await API.get(`/admin/users?search=${searchQuery}`,{
          headers:{
            Authorization:`Bearer ${token}`
          }
        });
        setUsers(response.data);
    } catch (error) {
        console.log("error in fetching",error);
        
    }
   }
   fetchUsers();
})


const deleteUser=async(id)=>{
    try {
        const confirmdelete=window.confirm("Are you sure");
         const adminInfo=JSON.parse(localStorage.getItem("adminInfo"));
      const token=adminInfo?.token;
        if(!confirmdelete)return;
        await API.delete(`/admin/users/${id}`,{
          headers:{
            Authorization:`Bearer ${token}`
          }
        });
         fetchUsers();
        setUsers((prev)=>prev.filter((user)=>user._id !==id))
        
    } catch (error) {
        
    }
}



const handleLogout = () => {
  const confirm=window.confirm("are you sure");
  if(!confirm){
    return
  }
  dispatch(adminLogout());
  localStorage.removeItem("adminInfo");
  navigate("/admin/login");
};
  return (
    <div className="admin-container">
   
      <aside className="sidebar">
        <h2 className="logo">Admin Panel</h2>
        <nav className="nav-links">
          <a href="#">All Users</a>
          <a href="/admin/addUser">Add User</a>
         <a href="#" className="logout" onClick={handleLogout}>Logout</a>

        </nav>
      </aside>

   
      <main className="dashboard-main">
        <h1>Dashboard</h1>
        <div className="user-table-wrapper">
          <h2>All Users</h2>
          <input
         type="text"
         placeholder="Search by name"
         value={searchQuery}
         onChange={(e) => setSearchQuery(e.target.value)}
          style={{ marginBottom: '1rem', padding: '0.5rem' }}
          />

          <table className="user-table">
            <thead>
              <tr>
                <th>Profile</th>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
            {users && users.map((user,index)=>(
                    <tr key={user._id || index}>
                <td>
                <img
  src={user.profilePic ? user.profilePic : 'https://ui-avatars.com/api/?name=User&background=random'}
  alt="profile"
  className="profile-img"
/>
                </td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                <Link to={`/admin/users/edit/${user._id}`} className="edit-btn">Edit</Link>
                 <button className="delete-btn" onClick={()=>deleteUser(user._id)}>Delete</button>
                </td>
              </tr>
            ))}
              
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
