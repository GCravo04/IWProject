import api from "./api";

export async function getUsers() {
    const response = await api.get("/Users");
    return response.data;
}

export async function getUser(id) {
    const response = await api.get(`/Users/${id}`);
    return response.data;
}

export async function getProfile() {
    const response = await api.get("/Users/profile");
    return response.data;
}

export async function updateProfile(data) {
    const response = await api.put("/Users/profile", data);
    return response.data;
}