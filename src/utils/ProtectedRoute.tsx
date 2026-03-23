import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";

export default function ProtectedRoute(){

    const { isAuthenticated } = useAuthStore()

    return isAuthenticated ? <Outlet /> : <Navigate to="/kaban-board/login" replace />
}