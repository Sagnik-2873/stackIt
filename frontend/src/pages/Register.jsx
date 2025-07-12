import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useUser();

  const handleRegister = () => {
    if (!username || !email || !password) {
      alert("Please fill all fields.");
      return;
    }

    // Simulate user registration logic
    console.log("Registered user:", { username, email, password });
    login(email); // Mock login after registration
    alert("Registered and logged in!");
    navigate("/");
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-base-100 shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

      <input
        type="text"
        placeholder="Username"
        className="input input-bordered w-full mb-4"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
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

      <button className="btn btn-success w-full" onClick={handleRegister}>
        Register
      </button>

      <p className="mt-4 text-sm text-center">
        Already have an account?{" "}
        <a href="/login" className="text-primary hover:underline">
          Login
        </a>
      </p>
    </div>
  );
}
