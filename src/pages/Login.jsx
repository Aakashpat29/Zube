import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/users/login", { email, password });

      const { accessToken, refreshToken, user } = res.data.data || res.data;

      // Save to localStorage (for header fallback)
      localStorage.setItem("token", accessToken);
      if (user) localStorage.setItem("user", JSON.stringify(user));

      alert("Login successful!");
      navigate("/");
    } catch (err) {
      console.error(err.response?.data);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <form onSubmit={handleLogin} className="p-6 flex flex-col gap-4">
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2"
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2"
      />

      <button className="bg-blue-500 text-white p-2 rounded">
        Login
      </button>
    </form>
  );
}

export default Login;