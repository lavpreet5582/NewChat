import { useState } from "react";

const LoginForm = ({ onLogin }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        const response = await fetch("http://localhost:8000/accounts/api/token/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });
        if (!response.ok) {
            console.error("Login failed!");
            return;
        }

        const data = await response.json();
        console.log("Token:", data.access);
        localStorage.setItem("token", data.access);
        onLogin(data.access);
    };

    return (
        <div>
            <h2>
                Login
            </h2>
            <form onSubmit={handleLogin}>
                <div>
                    <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div>
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    )
}


export default LoginForm;