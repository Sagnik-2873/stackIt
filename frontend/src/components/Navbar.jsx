import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function Navbar() {
  const { user, logout } = useUser();

  return (
    <div className="navbar bg-base-100 shadow px-4">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl text-primary font-bold">
          StackIt
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <Link to="/" className="btn btn-sm btn-ghost">Home</Link>
        <Link to="/ask" className="btn btn-sm btn-ghost">Ask</Link>

        {user ? (
          <>
            <div className="hidden sm:block text-sm">
              👤 {user.email}
            </div>
            <button
              onClick={logout}
              className="btn btn-sm btn-error"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-sm btn-primary">Login</Link>
            <Link to="/register" className="btn btn-sm btn-secondary">Register</Link>
          </>
        )}
      </div>
    </div>
  );
}

