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
  const [showConfirm, setShowConfirm] = useState(false); // 🔥 new confirm modal

  const dispatch=useDispatch()
  const navigate=useNavigate();

  const fetchUsers = async () => {
    try {
      const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
      const token = adminInfo?.token;
      const response = await API.get(`/admin/users?search=${searchQuery}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (error) {
      console.log("error in fetching", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchQuery]);


  // 🔥 Logout modal triggers
  const handleLogout = () => setShowConfirm(true);
  const cancelLogout = () => setShowConfirm(false);

  const confirmLogout = () => {
    dispatch(adminLogout());
    localStorage.removeItem("adminInfo");
    navigate("/admin/login");
  };


  const deleteUser = async (id) => {
    const confirmDelete = window.confirm("Are you sure?");
    if (!confirmDelete) return;

    const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
    const token = adminInfo?.token;

    await API.delete(`/admin/users/${id}`, { 
      headers: { Authorization: `Bearer ${token}` }
    });

    fetchUsers();
    setUsers(prev => prev.filter(u => u._id !== id));
  };


  return (
    <div className="admin-container">

      {/* 🔥 Beautiful Admin Navbar (Sidebar) */}
      <aside className="admin-navbar">
        <h2 className="admin-logo">⚙️ Admin Panel</h2>

        <nav className="admin-nav-links">
          <Link to="#" className="admin-nav-item active">📊 All Users</Link>
          <Link to="/admin/addUser" className="admin-nav-item">➕ Add User</Link>
          <button className="admin-nav-item logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </nav>
      </aside>


      {/* ------- MAIN CONTENT ------- */}
      <main className="dashboard-main">
        <h1>Dashboard</h1>

        {/* Search + Table */}
        <div className="user-table-wrapper">
          <h2>All Users</h2>

          <input
            type="text"
            placeholder="Search by name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
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
              {users.map((user) => (
                <tr key={user._id}>
                  <td>
                    <img
                      src={
                        user.profilePic 
                          ? user.profilePic 
                          : "https://ui-avatars.com/api/?name=User&background=random"
                      }
                      className="profile-img"
                    />
                  </td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <Link to={`/admin/users/edit/${user._id}`} className="edit-btn">Edit</Link>
                    <button className="delete-btn" onClick={() => deleteUser(user._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </main>

      {/* 🔥 Confirm Logout Modal */}
      {showConfirm && (
        <div className="overlay">
          <div className="confirm-modal">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to log out?</p>

            <div className="modal-actions">
              <button className="cancel-btn" onClick={cancelLogout}>Cancel</button>
              <button className="logout-confirm-btn" onClick={confirmLogout}>Logout</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
