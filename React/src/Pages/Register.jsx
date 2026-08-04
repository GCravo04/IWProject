import { useState } from "react";

function Register() {

    const [username, setUsername] = useState("");

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    function handleSubmit(e) {

        e.preventDefault();

        console.log(username);

        console.log(email);

        console.log(password);

    }

    return (

        <div className="login-page">

            <div className="login-card">

                <h1>Criar Conta</h1>

                <form onSubmit={handleSubmit}>

                    <input
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

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

                        Registar

                    </button>

                </form>

            </div>

        </div>

    );

}

export default Register;