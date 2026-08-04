import { useEffect, useState } from "react";
import { getPosts } from "../api/posts";

function Home() {

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        async function loadPosts() {

            try {

                const response = await getPosts();

                console.log(response.data);

                setPosts(response.data);

            }
            catch (err) {

                console.error(err);

            }
            finally {

                setLoading(false);

            }
        }

        loadPosts();

    }, []);

    if (loading)
        return <h2>A carregar...</h2>;

    return (
        <div style={{ padding: "30px" }}>

            <h1>Posts da API</h1>

            <hr />

            {posts.length === 0 ? (
                <p>Não existem posts.</p>
            ) : (
                posts.map(post => (
                    <div
                        key={post.postId}
                        style={{
                            border: "1px solid #ccc",
                            padding: "15px",
                            marginBottom: "15px",
                            borderRadius: "10px"
                        }}
                    >
                        <h3>{post.user?.userName}</h3>

                        <p>{post.content}</p>

                        <small>
                            {new Date(post.createdAt).toLocaleString()}
                        </small>
                    </div>
                ))
            )}

        </div>
    );
}

export default Home;