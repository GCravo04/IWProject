import api from "./api";

export async function getProfile() {
    const response = await api.get("/Users/profile");
    return response.data;
}

export async function updateProfile(data) {
    const response = await api.put("/Users/profile", data);
    return response.data;
}