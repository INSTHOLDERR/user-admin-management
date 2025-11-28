import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminPrivateRoute = ({ children }) => {
  const { adminInfo } = useSelector((state) => state.admin);

  return adminInfo ? children : <Navigate to="/admin/login" />;
};

export default AdminPrivateRoute;
