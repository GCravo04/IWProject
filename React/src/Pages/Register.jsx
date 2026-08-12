import { useState } from "react";
import { register } from "../api/auth";
import "../Css/Auth.css";
import { Link } from "react-router-dom";

export default function Register() {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleRegister(e) {

        e.preventDefault();

        try {

            const result = await register(
                username,
                email,
                password
            );

            console.log(result);

            alert("Registo efetuado!");

        } catch (err) {

            console.log(err);

            alert("Não foi possível criar a conta.");
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
                            Cria a tua conta
                        </p>

                    </div>

                    <form
                        className="auth-form"
                        onSubmit={handleRegister}
                    >

                        <div className="form-group">

                            <label>Username</label>

                            <input
                                type="text"
                                placeholder="O teu username"
                                value={username}
                                onChange={(e) =>
                                    setUsername(e.target.value)
                                }
                                required
                            />

                        </div>

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
                            Criar conta
                        </button>

                    </form>

                    <p className="auth-footer">

                        Já tens uma conta?

                        <a href="/login">
                            Inicia sessão
                        </a>

                    </p>

                </div>

            </div>
        </div>

    );
}

