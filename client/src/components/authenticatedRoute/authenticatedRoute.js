import {Navigate, Outlet} from "react-router-dom";

export function AuthenticatedRoute({ user }) {
   return user ? <Outlet /> : <Navigate to = "/login" />;

}