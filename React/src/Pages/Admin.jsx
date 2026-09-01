import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createPost, deletePost, getPosts, updatePost } from "../API/post";
import "../Css/Home.css";

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

function Admin() {
    const [isAuthenticated, setIsAuthenticated] = useState(
        () => localStorage.getItem("adminToken") === "true"
    );
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [posts, setPosts] = useState([]);
    const [form, setForm] = useState({ content: "" });
    const [editingId, setEditingId] = useState(null);

    async function loadPosts() {
        try {
            const data = await getPosts();
            setPosts(data);
        } catch (error) {
            console.error("Erro ao carregar posts do backoffice:", error);
        }
    }

    useEffect(() => {
        if (isAuthenticated) {
            loadPosts();
        }
    }, [isAuthenticated]);

    async function handleLogin(e) {
        e.preventDefault();

        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            localStorage.setItem("adminToken", "true");
            setIsAuthenticated(true);
            return;
        }

        alert("Credenciais inválidas.");
    }

    function handleLogout() {
        localStorage.removeItem("adminToken");
        setIsAuthenticated(false);
        setUsername("");
        setPassword("");
        setEditingId(null);
        setForm({ content: "" });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const content = form.content.trim();

        if (!content) {
            return;
        }

        try {
            if (editingId) {
                await updatePost(editingId, { content });
            } else {
                await createPost({ content });
            }

            setForm({ content: "" });
            setEditingId(null);
            await loadPosts();
        } catch (error) {
            console.error("Erro ao guardar post:", error);
            alert("Não foi possível guardar o post.");
        }
    }

    async function handleDelete(id) {
        const confirmDelete = window.confirm(
            "Tens a certeza que queres eliminar este post?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            await deletePost(id);
            await loadPosts();
        } catch (error) {
            console.error("Erro ao apagar post:", error);
            alert("Não foi possível apagar o post.");
        }
    }

    function handleEdit(post) {
        setEditingId(post.postId);
        setForm({ content: post.content });
    }

    if (!isAuthenticated) {
        return (
            <div className="admin-login-page">
                <div className="admin-login-card">
                    <h2>Backoffice</h2>
                    <p>Entrar com username e password</p>

                    <form onSubmit={handleLogin} className="admin-login-form">
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username"
                            required
                        />

                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                        />

                        <button type="submit">Entrar</button>
                    </form>

                    <Link to="/" className="admin-back-link">
                        Voltar para a Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1>Backoffice</h1>
                <button onClick={handleLogout} className="admin-logout-btn">
                    Logout
                </button>
            </div>

            <form onSubmit={handleSubmit} className="admin-form">
                <h3>{editingId ? "Editar post" : "Criar post"}</h3>

                <textarea
                    value={form.content}
                    onChange={(e) =>
                        setForm({ ...form, content: e.target.value })
                    }
                    placeholder="Escreve o conteúdo do post..."
                    rows={6}
                    required
                />

                <div className="admin-form-actions">
                    <button type="submit">
                        {editingId ? "Guardar alterações" : "Criar post"}
                    </button>

                    {editingId && (
                        <button
                            type="button"
                            className="secondary-btn"
                            onClick={() => {
                                setEditingId(null);
                                setForm({ content: "" });
                            }}
                        >
                            Cancelar
                        </button>
                    )}
                </div>
            </form>

            <div className="admin-list">
                <h3>Posts existentes</h3>

                {posts.length === 0 ? (
                    <p>Nenhum post encontrado.</p>
                ) : (
                    <ul>
                        {posts.map((post) => (
                            <li key={post.postId} className="admin-post-item">
                                <div>
                                    <strong>{post.username}</strong>
                                    <p>{post.content}</p>
                                </div>

                                <div className="admin-post-actions">
                                    <button onClick={() => handleEdit(post)}>
                                        Editar
                                    </button>

                                    <button
                                        className="danger-btn"
                                        onClick={() => handleDelete(post.postId)}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default Admin;
