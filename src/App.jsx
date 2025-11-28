import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './Pages/Login/Login';
import Home from './Pages/Home/Home';
import Register from './Pages/Register/Register';
import PrivateRoute from './Components/PrivateRoute';
import  Profile from './Pages/Profile/Profile'
import EditProfile from './Pages/Profile/EditProfile';

//admin
import AdminPrivateRoute from './Components/AdminPrivateRoute';
import AdminLogin from './Pages/AdminDashboard/AdminLogin';
import AdminDashboard from './Pages/AdminDashboard/AdminDashboard';
import AddUser from './Pages/AdminDashboard/AddUser';
import EditUser from './Pages/AdminDashboard/EditUser';
import { useSelector } from 'react-redux';


//toast
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

<ToastContainer position="top-right" autoClose={3000} />

function App() {

  const {adminInfo}=useSelector((state)=>state.admin);
 

  return (
    <>
     <ToastContainer 
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Routes>
        
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register/>}/>
        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>}/>
         <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute> }/>
          <Route path="/edit-profile" element={<PrivateRoute><EditProfile /></PrivateRoute>} />



          <Route path='/admin/login' element={adminInfo?<Navigate to={'/admin/dashboard'}/>:<AdminLogin/>}/>


          <Route path='/admin/dashboard' element={<AdminPrivateRoute><AdminDashboard/></AdminPrivateRoute>}/>
          <Route path="/admin/addUser" element={<AdminPrivateRoute><AddUser /></AdminPrivateRoute>} />
          <Route path="/admin/users/edit/:id" element={<AdminPrivateRoute><EditUser /></AdminPrivateRoute>} />

      </Routes>
    </>
  );
}

export default App;
