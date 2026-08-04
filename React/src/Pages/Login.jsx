import { useState } from "react";

function Login() {

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    function handleSubmit(e) {
        e.preventDefault();

        console.log(email);
        console.log(password);
    }

    return (

        <div className="login-page">

            <div className="login-card">

                <h1>Login</h1>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">

                        <label>Email</label>

                        <input
                            type="email"
                            placeholder="Introduz o teu email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                    </div>

                    <div className="form-group">

                        <label>Password</label>

                        <input
                            type="password"
                            placeholder="Introduz a tua password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                    </div>

                    <button type="submit">
                        Entrar
                    </button>

                </form>

            </div>

        </div>

    );

}

export default Login;