import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUser } from "../API/users";
import "../Css/Profile.css";

function UserProfile() {

    const { id } = useParams();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        async function loadUser() {

            try {

                const data = await getUser(id);
                setUser(data);

            } catch (err) {

                console.error(err);
                setError("Não foi possível carregar o perfil.");

            } finally {

                setLoading(false);

            }

        }

        loadUser();

    }, [id]);

    if (loading) {
        return <h2>A carregar...</h2>;
    }

    if (error) {
        return <h2>{error}</h2>;
    }

    if (!user) {
        return <h2>Utilizador não encontrado.</h2>;
    }

    return (
        <div className="profile">
            <img
                className="profile-picture"
                src={user.profileImageUrl || "https://placehold.co/150"}
                alt=""
            />

            <h1>{user.username}</h1>

            <p>{user.bio || "Sem bio."}</p>
        </div>
    );

}

export default UserProfile;
