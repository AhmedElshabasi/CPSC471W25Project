import { Navigate, useParams } from "react-router-dom"

const AdminPageProtected = ({children}) => {
  const token = localStorage.getItem("token")
  const adminNum = localStorage.getItem("admin")
  const params = useParams()

  if(!token || params.id !== adminNum){
    return <Navigate to="/admin/not-authorized" replace />;
  }

  return children

}

export default AdminPageProtected;