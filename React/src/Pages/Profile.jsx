import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../API/users";
import "../Css/Profile.css";

function Profile() {

    const [user, setUser] = useState(null);

    const [editing, setEditing] = useState(false);

    const [form, setForm] = useState({
        username: "",
        bio: "",
        profileImageUrl: ""
    });

    useEffect(() => {

        loadProfile();

    }, []);

    async function loadProfile() {

        try {

            const data = await getProfile();

            setUser(data);

            setForm({
                username: data.username,
                bio: data.bio || "",
                profileImageUrl: data.profileImageUrl || ""
            });

        }
        catch (err) {

            console.error(err);

        }

    }

    async function saveProfile() {

        try {

            await updateProfile(form);

            setEditing(false);

            loadProfile();

        }
        catch (err) {

            console.error(err);

        }

    }

    if (!user)
        return <h2>A carregar...</h2>;

    return (

        <div className="profile">

            <img
                className="profile-picture"
                src={
                    form.profileImageUrl ||
                    "https://placehold.co/150"
                }
                alt=""
            />

            {
                editing ?

                    <>
                        <input
                            value={form.username}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    username: e.target.value
                                })
                            }
                        />

                        <textarea
                            value={form.bio}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    bio: e.target.value
                                })
                            }
                        />

                        <input
                            placeholder="Imagem URL"
                            value={form.profileImageUrl}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    profileImageUrl: e.target.value
                                })
                            }
                        />

                        <button onClick={saveProfile}>
                            Guardar
                        </button>

                    </>

                    :

                    <>

                        <h1>{user.username}</h1>

                        <p>{user.email}</p>

                        <p>{user.bio}</p>

                        <div className="stats">

                            <div>

                                <h2>{user.posts}</h2>

                                <span>Posts</span>

                            </div>

                            <div>

                                <h2>{user.followers}</h2>

                                <span>Followers</span>

                            </div>

                            <div>

                                <h2>{user.following}</h2>

                                <span>Following</span>

                            </div>

                        </div>

                        <button
                            onClick={() => setEditing(true)}
                        >
                            Editar Perfil
                        </button>

                    </>

            }

        </div>

    );

}

export default Profile;