import { useState } from "react";
import { login } from "../api/auth";

export default function Login() {

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    async function handleLogin(e) {

        e.preventDefault();

       try {

    const result = await login(email, password);

    console.log(result);

    localStorage.setItem("token", result.token);

    console.log("Token guardado:", localStorage.getItem("token"));

    alert("Login efetuado!");

}
catch (err) {

    console.log(err);

    alert("Erro");
    }
    }

    return (

        <form onSubmit={handleLogin}>

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button>

                Login

            </button>

        </form>

    );

}