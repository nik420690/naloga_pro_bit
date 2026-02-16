import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import { useAuth } from "./context/AuthContext";

function ProtectedAdmin({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!user?.is_admin) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route
          path="admin"
          element={
            <ProtectedAdmin>
              <Admin />
            </ProtectedAdmin>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
