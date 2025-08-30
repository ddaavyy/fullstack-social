import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import BootstrapProfile from '../store/BootstrapProfile';

const PrivateRoute = ({ children }) => {
  const token = Cookies.get('access_token');
  if (!token) return <Navigate to="/login" replace />;

  return (
    <>
      <BootstrapProfile />
      {children}
    </>
  );
};

export default PrivateRoute;
