import api from "./api";

export async function login(email, password) {

    const response = await api.post("/Auth/login", {
        email,
        password
    });

    return response.data;
}

export async function register(username, email, password) {

    const response = await api.post("/Auth/register", {
        username,
        email,
        password
    });

    return response.data;
}