import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProfile } from "../API/users";

function NavBar() {

    const token = localStorage.getItem("token");
    const [profileImageUrl, setProfileImageUrl] = useState("");

    useEffect(() => {

        async function loadProfileImage() {

            if (!token) {
                setProfileImageUrl("");
                return;
            }

            try {

                const profile = await getProfile();
                setProfileImageUrl(profile.profileImageUrl || "");

            } catch (error) {

                console.error("Erro ao carregar perfil na navbar:", error);

            }

        }

        loadProfileImage();

    }, [token]);

    return (

        <nav className="navbar">

            <Link to="/" className="logo">
                Social
            </Link>

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
                                src={
                                    profileImageUrl ||
                                    "https://placehold.co/80"
                                }
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