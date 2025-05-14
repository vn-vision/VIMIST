import { useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
    role:string;
    children: React.ReactNode;
}
const ProtectedRoute = ({role, children}: ProtectedRouteProps) =>{
    const navigate = useNavigate();
    if (!role || role !== "Admin") {
        navigate("/login");
    }
    return children;
}
export default ProtectedRoute;