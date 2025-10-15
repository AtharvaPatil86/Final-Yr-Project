import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (data.success) {
    
      localStorage.setItem("username", data.username);
      navigate("/"); 
    } else {
      alert(data.message || "Login failed");
    }
  };

  return (
    <div className="bg-zinc-900 w-full h-screen text-white flex overflow-x-hidden">
      <div className="ml-125 mt-50 text-black bg-white h-50 w-80 p-4 rounded-lg">
        <h3 className="text-xl font-semibold mb-4 text-center">Login</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="w-60 h-10 block ml-2 mt-3 px-2 border rounded"
            placeholder="Username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            className="w-60 h-10 block mt-3 ml-2 px-2 border rounded"
            placeholder="Password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="submit"
            value="Login"
            className="bg-green-500 hover:bg-green-600 mt-4 w-24 ml-2 py-2 rounded text-white cursor-pointer"
          />
        </form>
      </div>
    </div>
  );
}

export default Login;
