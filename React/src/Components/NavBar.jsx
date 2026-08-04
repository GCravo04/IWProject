import { Link } from "react-router-dom";
import "../Css/Navbar.css";

function NavBar() {

    const token = localStorage.getItem("token");

    return (

        <nav className="navbar">

            <Link to="/" className="logo">
                Social
            </Link>

            <div className="nav-links">

                <Link to="/">Home</Link>

                {token && (
                    <Link to="/profile">
                        Perfil
                    </Link>
                )}

            </div>

            <div className="nav-right">

                {!token ? (
                    <>
                        <Link
                            className="login-btn"
                            to="/login"
                        >
                            Login
                        </Link>

                        <Link
                            className="register-btn"
                            to="/register"
                        >
                            Registar
                        </Link>
                    </>
                ) : (
                    <>
                        <Link
                            to="/profile"
                            className="profile-link"
                        >
                            <img
                                src="https://placehold.co/80"
                                alt=""
                            />

                            <span>Perfil</span>
                        </Link>

                        <button
                            className="logout-btn"
                            onClick={() => {

                                localStorage.removeItem("token");
                                window.location.href = "/login";

                            }}
                        >
                            Logout
                        </button>
                    </>
                )}

            </div>

        </nav>

    );
}

export default NavBar;