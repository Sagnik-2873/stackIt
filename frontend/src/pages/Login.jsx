import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useUser();

  const handleLogin = () => {
    login(email); // Set user
    alert("Logged in");
    navigate("/");
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-base-100 shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

      <input
        type="email"
        placeholder="Email"
        className="input input-bordered w-full mb-4"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="input input-bordered w-full mb-4"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="btn btn-primary w-full" onClick={handleLogin}>
        Login
      </button>

      <p className="mt-4 text-sm text-center">
        Don't have an account?{" "}
        <a href="/register" className="text-primary hover:underline">
          Register
        </a>
      </p>
    </div>
  );
}
