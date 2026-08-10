import api from "./api";

export async function getPosts() {

    const response = await api.get("/Posts");

    return response.data;
}

export async function getPost(id) {

    const response = await api.get(`/Posts/${id}`);

    return response.data;
}

export async function createPost(post) {

    const response = await api.post("/Posts", post);

    return response.data;
}

export async function updatePost(id, post) {

    await api.put(`/Posts/${id}`, post);
}

export async function deletePost(id) {

    await api.delete(`/Posts/${id}`);
}