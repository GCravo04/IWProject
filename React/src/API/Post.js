import api from "./api";

export async function getPosts() {

    const response = await api.get("/Post");

    return response.data;
}

export async function getPost(id) {

    const response = await api.get(`/Post/${id}`);

    return response.data;
}

export async function createPost(post) {

    const response = await api.post("/Post", post);

    return response.data;
}

export async function updatePost(id, post) {

    await api.put(`/Post/${id}`, post);
}

export async function deletePost(id) {

    await api.delete(`/Post/${id}`);
}