import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "../Css/Home.css";

import { getPosts, createPost } from "../API/post";

function Home() {

    const [posts, setPosts] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [content, setContent] = useState("");
    const [publishing, setPublishing] = useState(false);


    // =========================
    // CARREGAR POSTS
    // =========================

    useEffect(() => {

        async function loadPosts() {

            try {

                const data = await getPosts();

                setPosts(data);

            } catch (error) {

                console.error(
                    "Erro ao carregar posts:",
                    error
                );

                setError(
                    "Não foi possível carregar os posts."
                );

            } finally {

                setLoading(false);

            }

        }

        loadPosts();

    }, []);


    // =========================
    // CRIAR POST
    // =========================

    async function handleCreatePost() {

        if (!content.trim()) {
            return;
        }

        try {

            setPublishing(true);
            setError("");

            const newPost = await createPost({
                content: content.trim()
            });

            setPosts((currentPosts) => [
                newPost,
                ...currentPosts
            ]);

            setContent("");

        } catch (error) {

            console.error(
                "Erro ao criar post:",
                error
            );

            setError(
                "Não foi possível publicar o post."
            );

        } finally {

            setPublishing(false);

        }

    }


    return (

        <div className="home">


            {/* =========================
                LEFT SIDEBAR
            ========================= */}

            <aside className="left-sidebar">

                <h2>Social</h2>

                <ul>

                    <li>
                        <Link to="/">
                            🏠 Home
                        </Link>
                    </li>

                    <li>
                        <Link to="/profile">
                            👤 Perfil
                        </Link>
                    </li>

                    <li>
                        <Link to="/settings">
                            ⚙️ Definições
                        </Link>
                    </li>

                </ul>

            </aside>


            {/* =========================
                FEED
            ========================= */}

            <main className="feed">


                {/* =========================
                    CREATE POST
                ========================= */}

                <div className="create-post">

                    <textarea
                        placeholder="O que estás a pensar?"
                        value={content}
                        onChange={(e) =>
                            setContent(e.target.value)
                        }
                    />

                    <button
                        onClick={handleCreatePost}
                        disabled={
                            publishing ||
                            !content.trim()
                        }
                    >
                        {publishing
                            ? "A publicar..."
                            : "Publicar"
                        }
                    </button>

                </div>


                {/* =========================
                    ERROR
                ========================= */}

                {error && (

                    <p className="error">
                        {error}
                    </p>

                )}


                {/* =========================
                    LOADING
                ========================= */}

                {loading && (

                    <p>
                        A carregar posts...
                    </p>

                )}


                {/* =========================
                    NO POSTS
                ========================= */}

                {!loading &&
                    !error &&
                    posts.length === 0 && (

                        <p>
                            Ainda não existem posts.
                        </p>

                    )
                }


                {/* =========================
                    POSTS
                ========================= */}

                {posts.map((post) => (

                    <div
                        className="post"
                        key={post.postId}
                    >


                        {/* POST HEADER */}

                        <div className="post-header">

                            <img
                                src={
                                    post.profileImageUrl ||
                                    "https://placehold.co/45"
                                }
                                alt=""
                            />

                            <div>

                                <h3>
                                    {post.username}
                                </h3>

                                <span>
                                    {new Date(
                                        post.createdAt
                                    ).toLocaleString(
                                        "pt-PT"
                                    )}
                                </span>

                            </div>

                        </div>


                        {/* POST CONTENT */}

                        <p>
                            {post.content}
                        </p>


                        {/* POST IMAGE */}

                        {post.imageUrl && (

                            <img
                                className="post-image"
                                src={post.imageUrl}
                                alt="Imagem do post"
                            />

                        )}


                        {/* POST ACTIONS */}

                        <div className="post-actions">

                            <button>
                                ❤️ {post.likes}
                            </button>

                            <button>
                                💬 {post.comments}
                            </button>

                        </div>

                    </div>

                ))}


            </main>


            {/* =========================
                RIGHT SIDEBAR
            ========================= */}

            <aside className="right-sidebar">

                <h3>Quem seguir</h3>

                <div className="suggestion">

                    <span>
                        João
                    </span>

                    <button>
                        Seguir
                    </button>

                </div>

                <div className="suggestion">

                    <span>
                        Ana
                    </span>

                    <button>
                        Seguir
                    </button>

                </div>

                <div className="suggestion">

                    <span>
                        Pedro
                    </span>

                    <button>
                        Seguir
                    </button>

                </div>

            </aside>


        </div>

    );

}

export default Home;