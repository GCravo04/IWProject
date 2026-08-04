import "../Css/Home.css";

function Home() {
    return (
        <div className="home">

            <aside className="left-sidebar">
                <h2>Social</h2>

                <ul>
                    <li>🏠 Home</li>
                    <li>👤 Perfil</li>
                    <li>⚙️ Definições</li>
                </ul>
            </aside>

            <main className="feed">

                <div className="create-post">

                    <textarea
                        placeholder="O que estás a pensar?"
                    ></textarea>

                    <button>
                        Publicar
                    </button>

                </div>

                <div className="post">

                    <div className="post-header">

                        <img
                            src="https://placehold.co/45"
                            alt=""
                        />

                        <div>

                            <h3>Teste</h3>

                            <span>há 3 minutos</span>

                        </div>

                    </div>

                    <p>
                        Este é o meu primeiro post feito em React 
                    </p>

                    <div className="post-actions">

                        <button>
                            
                        </button>

                        <button>
                           
                        </button>

                    </div>

                </div>

                <div className="post">

                </div>

            </main>

            <aside className="right-sidebar">

                <h3>Quem seguir</h3>

                <div className="suggestion">

                    <span>João</span>

                    <button>
                        Seguir
                    </button>

                </div>

                <div className="suggestion">

                    <span>Ana</span>

                    <button>
                        Seguir
                    </button>

                </div>

                <div className="suggestion">

                    <span>Pedro</span>

                    <button>
                        Seguir
                    </button>

                </div>

            </aside>

        </div>
    );
}

export default Home;