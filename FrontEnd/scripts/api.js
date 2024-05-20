const API_URL = "http://localhost:5678/api";

export async function getWorks() {
    return fetch(`${API_URL}/works`).then(response => response.json())
}

export async function getCategories() {
    return fetch(`${API_URL}/categories`).then(response => response.json())
}

export async function deleteWork(workId) {
    const token = localStorage.getItem("token");
    return fetch(`${API_URL}/works/${workId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
}

export async function addWork(work) {
    const token = localStorage.getItem("token");
    return fetch(`${API_URL}/works`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(work)
    });
}