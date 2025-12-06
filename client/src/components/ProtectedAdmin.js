import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedAdmin = ({ children }) => {
  const user = useSelector((state) => state.users.user);

 
  if (!user) return <Navigate to="/login" />;

  
  if (user.email !== "admin@gmail.com") return <Navigate to="/home" />;

 
  return children;
};

export default ProtectedAdmin;
