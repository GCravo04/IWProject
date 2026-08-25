import { useEffect, useState } from "react";
import "../Css/Home.css";

import { getPosts, createPost, updatePost, deletePost } from "../API/post";
import { getProfile, getUsers } from "../API/users";

import { Link } from "react-router-dom";

function Home() {

    const [posts, setPosts] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);

    const [content, setContent] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [editingPostId, setEditingPostId] = useState(null);
    const [editingContent, setEditingContent] = useState("");
    const [allUsers, setAllUsers] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [showUserSearch, setShowUserSearch] = useState(false);
    const [usersLoading, setUsersLoading] = useState(false);


    // ========================================
    // CARREGAR POSTS + UTILIZADOR
    // ========================================

    useEffect(() => {

        async function loadData() {

            try {

                const [postsData, profileData] = await Promise.all([
                    getPosts(),
                    getProfile()
                ]);

                setPosts(postsData);

                setCurrentUserId(profileData.userId);

                console.log("User logged in:", profileData);
                console.log("Posts:", postsData);

            } catch (error) {

                console.error("Erro ao carregar dados:", error);

                setError(
                    "Não foi possível carregar os dados."
                );

            } finally {

                setLoading(false);

            }

        }

        loadData();

    }, []);


    // ========================================
    // CRIAR POST
    // ========================================

    async function handleCreatePost() {

        if (!content.trim()) {
            return;
        }

        try {

            const newPost = await createPost({
                content: content
            });

            setContent("");

            // Recarregar posts para garantir
            // que temos os dados vindos da API

            const postsData = await getPosts();

            setPosts(postsData);

        } catch (error) {

            console.error("Erro ao criar post:", error);

            setError(
                "Não foi possível criar o post."
            );

        }

    }


    // ========================================
    // EDITAR POST
    // ========================================

    function handleStartEdit(post) {

        setEditingPostId(post.postId);
        setEditingContent(post.content);

    }


    async function handleSaveEdit(postId) {

        if (!editingContent.trim()) {
            return;
        }

        try {

            await updatePost(postId, {
                content: editingContent
            });

            setEditingPostId(null);
            setEditingContent("");

            // Atualizar lista

            const postsData = await getPosts();

            setPosts(postsData);

        } catch (error) {

            console.error("Erro ao editar post:", error);

            setError(
                "Não foi possível editar o post."
            );

        }

    }


    // ========================================
    // APAGAR POST
    // ========================================

    async function handleDeletePost(postId) {

        const confirmDelete = window.confirm(
            "Tens a certeza que queres apagar este post?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            await deletePost(postId);

            // Remover imediatamente da lista

            setPosts(
                posts.filter(
                    post => post.postId !== postId
                )
            );

        } catch (error) {

            console.error("Erro ao apagar post:", error);

            setError(
                "Não foi possível apagar o post."
            );

        }

    }

    async function handleToggleUserSearch() {

        const open = !showUserSearch;

        setShowUserSearch(open);

        if (!open || allUsers.length > 0) {
            return;
        }

        try {

            setUsersLoading(true);

            const usersData = await getUsers();

            setAllUsers(usersData);

        } catch (error) {

            console.error("Erro ao carregar utilizadores:", error);

            setError(
                "Não foi possível carregar os utilizadores."
            );

        } finally {

            setUsersLoading(false);

        }

    }

    const filteredUsers = allUsers
        .filter((user) => user.userId !== currentUserId)
        .filter((user) =>
            user.username
                .toLowerCase()
                .includes(searchText.toLowerCase())
        );


    return (

        <div className="home">


            {/* ========================================
                LEFT SIDEBAR
            ======================================== */}

            <aside className="left-sidebar">

                <h2>Social</h2>

                <button
                    className="search-users-btn"
                    onClick={handleToggleUserSearch}
                >
                    {showUserSearch ? "Fechar pesquisa" : "Pesquisar utilizadores"}
                </button>

                {showUserSearch && (
                    <div className="user-search-panel">
                        <input
                            type="text"
                            placeholder="Procurar por username..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />

                        {usersLoading && (
                            <p className="user-search-status">
                                A carregar utilizadores...
                            </p>
                        )}

                        {!usersLoading && (
                            <ul className="user-search-results">
                                {filteredUsers.length === 0 ? (
                                    <li className="user-search-status">
                                        Sem resultados.
                                    </li>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <li key={user.userId}>
                                            <Link to={`/users/${user.userId}`}>
                                                {user.username}
                                            </Link>
                                        </li>
                                    ))
                                )}
                            </ul>
                        )}
                    </div>
                )}

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


            {/* ========================================
                FEED
            ======================================== */}

            <main className="feed">


                {/* CRIAR POST */}

                <div className="create-post">

                    <textarea
                        value={content}
                        onChange={(e) =>
                            setContent(e.target.value)
                        }
                        placeholder="O que estás a pensar?"
                    />

                    <button
                        onClick={handleCreatePost}
                    >
                        Publicar
                    </button>

                </div>


                {/* ERRO */}

                {error && (

                    <p className="error">
                        {error}
                    </p>

                )}


                {/* LOADING */}

                {loading && (

                    <p>
                        A carregar posts...
                    </p>

                )}


                {/* SEM POSTS */}

                {!loading &&
                    !error &&
                    posts.length === 0 && (

                        <p>
                            Ainda não existem posts.
                        </p>

                    )
                }


                {/* ========================================
                    POSTS
                ======================================== */}

                {posts.map((post) => (

                    <div
                        className="post"
                        key={post.postId}
                    >


                        {/* POST HEADER */}

                        <div className="post-header">

                            <img
                                src={
                                    post.imageUrl ||
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
                                    ).toLocaleString("pt-PT")}
                                </span>

                            </div>


                            {/* =================================
                                EDIT / DELETE
                            ================================= */}

                            {post.userId === currentUserId && (

                                <div className="post-owner-actions">

                                    <button
                                        onClick={() =>
                                            handleStartEdit(post)
                                        }
                                    >
                                        ✏️
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleDeletePost(
                                                post.postId
                                            )
                                        }
                                    >
                                        🗑️
                                    </button>

                                </div>

                            )}

                        </div>


                        {/* ========================================
                            EDITAR POST
                        ======================================== */}

                        {editingPostId === post.postId ? (

                            <div className="edit-post">

                                <textarea
                                    value={editingContent}
                                    onChange={(e) =>
                                        setEditingContent(
                                            e.target.value
                                        )
                                    }
                                />

                                <div>

                                    <button
                                        onClick={() =>
                                            handleSaveEdit(
                                                post.postId
                                            )
                                        }
                                    >
                                        Guardar
                                    </button>

                                    <button
                                        onClick={() => {

                                            setEditingPostId(null);
                                            setEditingContent("");

                                        }}
                                    >
                                        Cancelar
                                    </button>

                                </div>

                            </div>

                        ) : (

                            <p>
                                {post.content}
                            </p>

                        )}


                        {/* ========================================
                            IMAGEM
                        ======================================== */}

                        {post.imageUrl && (

                            <img
                                className="post-image"
                                src={post.imageUrl}
                                alt="Imagem do post"
                            />

                        )}


                        {/* ========================================
                            ACTIONS
                        ======================================== */}

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


            {/* ========================================
                RIGHT SIDEBAR
            ======================================== */}

            <aside className="right-sidebar">

                <h3>
                    Quem seguir
                </h3>


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