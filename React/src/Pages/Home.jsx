import { useEffect, useState } from "react";

import "../Css/Home.css";

import {

    getPosts,

    createPost,

    updatePost,

    deletePost,

    toggleLike,

    getComments,

    createComment

} from "../API/post";

import { getProfile, getUsers } from "../API/users";

import { Link } from "react-router-dom";

const POSTS_PER_PAGE = 5;

function Home() {

    const [posts, setPosts] = useState([]);

    const [currentUserId, setCurrentUserId] = useState(null);

    const [content, setContent] = useState("");

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [editingPostId, setEditingPostId] = useState(null);

    const [editingContent, setEditingContent] = useState("");

    const [commentsByPost, setCommentsByPost] = useState({});

    const [commentsOpen, setCommentsOpen] = useState({});

    const [commentInputs, setCommentInputs] = useState({});

    const [commentsLoading, setCommentsLoading] = useState({});

    const [currentPage, setCurrentPage] = useState(1);

    const [showUserSearch, setShowUserSearch] = useState(false);

    const [allUsers, setAllUsers] = useState([]);

    const [searchText, setSearchText] = useState("");

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

    useEffect(() => {

        setCurrentPage(1);

    }, [posts.length]);



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

    async function handleToggleLike(postId) {

        try {

            const result = await toggleLike(postId);

            setPosts((prevPosts) =>

                prevPosts.map((post) =>

                    post.postId === postId

                        ? { ...post, likes: result.likes }

                        : post

                )

            );

        } catch (error) {

            console.error("Erro ao fazer like:", error);

            setError(

                "Não foi possível atualizar o like."

            );

        }

    }

    const filteredUsers = allUsers

        .filter((user) => user.userId !== currentUserId)

        .filter((user) =>

            user.username

                .toLowerCase()

                .includes(searchText.toLowerCase())

        );

    async function handleToggleComments(postId) {

        const willOpen = !commentsOpen[postId];

        setCommentsOpen((prev) => ({

            ...prev,

            [postId]: willOpen

        }));

        if (!willOpen || commentsByPost[postId]) {

            return;

        }

        try {

            setCommentsLoading((prev) => ({

                ...prev,

                [postId]: true

            }));

            const comments = await getComments(postId);

            setCommentsByPost((prev) => ({

                ...prev,

                [postId]: comments

            }));

        } catch (error) {

            console.error("Erro ao carregar comentários:", error);

            setError(

                "Não foi possível carregar os comentários."

            );

        } finally {

            setCommentsLoading((prev) => ({

                ...prev,

                [postId]: false

            }));

        }

    }

    async function handleCreateComment(postId) {

        const content = (commentInputs[postId] || "").trim();

        if (!content) {

            return;

        }

        try {

            const createdComment = await createComment(postId, content);

            setCommentsByPost((prev) => ({

                ...prev,

                [postId]: [...(prev[postId] || []), createdComment]

            }));

            setCommentInputs((prev) => ({

                ...prev,

                [postId]: ""

            }));

            setPosts((prevPosts) =>

                prevPosts.map((post) =>

                    post.postId === postId

                        ? { ...post, comments: post.comments + 1 }

                        : post

                )

            );

        } catch (error) {

            console.error("Erro ao criar comentário:", error);

            setError(

                "Não foi possível criar o comentário."

            );

        }

    }

    const totalPages = Math.max(

        1,

        Math.ceil(posts.length / POSTS_PER_PAGE)

    );

    const paginatedPosts = posts.slice(

        (currentPage - 1) * POSTS_PER_PAGE,

        currentPage * POSTS_PER_PAGE

    );



    return (

        <div className="home">



            {/* ========================================*

                LEFT SIDEBAR*

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

                        <Link to="/admin">

                            ⚙️ Backoffice

                        </Link>

                    </li>

                </ul>

            </aside>



            {/* ========================================*

                FEED*

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



                {/* ========================================*

                    POSTS*

                ======================================== */}

                {paginatedPosts.map((post) => (

                    <div

                        className="post"

                        key={post.postId}

                    >



                        {/* POST HEADER */}

                        <div className="post-header">

                            <img

                                src={

                                    post.userProfileImageUrl ||

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



                            {/* =================================*

                                EDIT / DELETE*

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



                        {/* ========================================*

                            EDITAR POST*

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



                        {/* ========================================*

                            IMAGEM*

                        ======================================== */}

                        {post.imageUrl && (

                            <img

                                className="post-image"

                                src={post.imageUrl}

                                alt="Imagem do post"

                            />

                        )}



                        {/* ========================================*

                            ACTIONS*

                        ======================================== */}

                        <div className="post-actions">

                            <button

                                onClick={() =>

                                    handleToggleLike(post.postId)

                                }

                            >

                                ❤️ {post.likes}

                            </button>

                            <button

                                onClick={() =>

                                    handleToggleComments(post.postId)

                                }

                            >

                                💬 {post.comments}

                            </button>

                        </div>

                        {commentsOpen[post.postId] && (

                            <div className="comments-section">

                                <div className="create-comment">

                                    <input

                                        type="text"

                                        placeholder="Escreve um comentário..."

                                        value={commentInputs[post.postId] || ""}

                                        onChange={(e) =>

                                            setCommentInputs((prev) => ({

                                                ...prev,

                                                [post.postId]: e.target.value

                                            }))

                                        }

                                    />

                                    <button

                                        onClick={() =>

                                            handleCreateComment(post.postId)

                                        }

                                    >

                                        Comentar

                                    </button>

                                </div>

                                {commentsLoading[post.postId] && (

                                    <p className="comments-status">

                                        A carregar comentários...

                                    </p>

                                )}

                                {!commentsLoading[post.postId] &&

                                    (commentsByPost[post.postId]?.length > 0 ? (

                                        <ul className="comments-list">

                                            {commentsByPost[post.postId].map((comment) => (

                                                <li

                                                    key={comment.commentId}

                                                    className="comment-item"

                                                >

                                                    <strong>{comment.username}</strong>

                                                    <span>{comment.content}</span>

                                                </li>

                                            ))}

                                        </ul>

                                    ) : (

                                        <p className="comments-status">

                                            Ainda não há comentários.

                                        </p>

                                    ))}

                            </div>

                        )}

                    </div>

                ))}

                {!loading && !error && posts.length > 0 && (

                    <div className="pagination">

                        <button

                            onClick={() =>

                                setCurrentPage((prev) => Math.max(1, prev - 1))

                            }

                            disabled={currentPage === 1}

                        >

                            Anterior

                        </button>

                        <span>

                            Página {currentPage} de {totalPages}

                        </span>

                        <button

                            onClick={() =>

                                setCurrentPage((prev) =>

                                    Math.min(totalPages, prev + 1)

                                )

                            }

                            disabled={currentPage === totalPages}

                        >

                            Seguinte

                        </button>

                    </div>

                )}

            </main>
          

        </div>

    );

}

export default Home;