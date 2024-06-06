const API_URL = "http://localhost:5678/api";

export async function getWorks() {
    return fetch(`${API_URL}/works`).then(response => response.json());
}

export async function getCategories() {
    return fetch(`${API_URL}/categories`).then(response => response.json());
}

export async function deleteWork(workId) {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${API_URL}/works/${workId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        console.log("deleteWork response", response);
        return response;
    } catch (error) {
        console.error("Erreur lors de la suppression du travail :", error);
        throw error;
    }
}


export async function addWork(formData) {
    const token = localStorage.getItem("token");
    return fetch(`${API_URL}/works`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            
        },
        body: formData
    }).then(response => response.json());
}
