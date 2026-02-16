import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-slate-900 text-white shadow">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 flex flex-wrap items-center justify-between gap-2">
          <Link to="/" className="text-xl font-bold tracking-tight">
            Car Manager
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              to="/"
              className="text-slate-300 hover:text-white transition"
            >
              Cars
            </Link>
            {user?.is_admin && (
              <Link
                to="/admin"
                className="text-slate-300 hover:text-white transition"
              >
                Admin
              </Link>
            )}
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-400 hidden sm:inline">
                  {user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="rounded bg-slate-700 px-3 py-1.5 text-sm hover:bg-slate-600 transition"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded bg-slate-700 px-3 py-1.5 text-sm hover:bg-slate-600 transition"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="rounded bg-amber-500 px-3 py-1.5 text-sm text-slate-900 hover:bg-amber-400 transition"
                >
                  Sign up
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}
