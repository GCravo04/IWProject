import { useState } from "react";
import { login } from "../api/auth";
import "../Css/Auth.css";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const navigate = useNavigate();

async function handleLogin(e) {
    e.preventDefault();

    try {
        const result = await login(email, password);

        console.log(result);

        localStorage.setItem("token", result.token);

        console.log(
            "Token guardado:",
            localStorage.getItem("token")
        );

        alert("Login efetuado!");

        // Ir para a Home depois do login
        navigate("/");
    } catch (err) {
        console.log(err);
        alert("Email ou password incorretos.");
    }
}

return (
    <div className="auth-container">
        <Link
            to="/"
            className="back-home-button"
        >
            ← Voltar à página inicial
        </Link>

        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Social</h1>
                    <p>
                        Entra na tua conta
                    </p>
                </div>

                <form
                    className="auth-form"
                    onSubmit={handleLogin}
                >
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="O teu email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="A tua password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="auth-button"
                    >
                        Entrar
                    </button>
                </form>

                <p className="auth-footer">
                    Ainda não tens conta?
                    <Link to="/register">
                        Regista-te
                    </Link>
                </p>
            </div>
        </div>
    </div>
);

}
