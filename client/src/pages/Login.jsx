import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authApi } from "../api/client";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { user, token } = await authApi.login(email, password);
      login(user, token);
      navigate(user.is_admin ? "/admin" : "/");
    } catch (e) {
      setError(e.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Sign in</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4"
      >
        {error && (
          <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">
            {error}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-amber-500 text-slate-900 font-medium py-2.5 hover:bg-amber-400 disabled:opacity-50 transition"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-slate-600">
        Don't have an account?{" "}
        <Link to="/register" className="text-amber-600 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
