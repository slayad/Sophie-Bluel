import { deleteWork, getWorks } from "../api.js";
import { displayGallery } from "./gallery-works.js";

// Fonction pour créer les travaux sur la page principale et les miniatures dans la modal
export function displayModalGallery(works) {
    const modalContent = document.querySelector(".modalContent");
    modalContent.innerHTML = ""; // Efface le contenu précédent de la modal
    works.forEach(work => {
        // Création des miniatures
        const miniWork = document.createElement("figure");
        miniWork.classList.add("miniWork"); // Ajout de la classe pour les miniatures

        const workContainer = document.createElement("div");
        workContainer.classList.add("workContainer"); // Ajout de la classe pour le conteneur de l'œuvre

        const workImage = document.createElement("img");
        const trashCan = document.createElement("i");

        // Définir les attributs et le contenu des éléments
        trashCan.id = work.id; // Utilise l'ID du travail comme ID pour l'icône de la corbeille
        trashCan.classList.add("fa-solid", "fa-trash-can");

        workImage.src = work.imageUrl; // Définir l'URL de l'image
        workImage.alt = work.title; // Définir l'attribut alt de l'image

        // Ajouter les éléments à la modal
        workContainer.appendChild(workImage);
        workContainer.appendChild(trashCan);
        miniWork.appendChild(workContainer);
        modalContent.appendChild(miniWork);

        // Gestionnaire d'événements pour l'icône de la corbeille
        trashCan.addEventListener("click", () => startDeleteWork(work.id));
    });
}

// Fonction de suppression de travail
function startDeleteWork(workId) {
    deleteWork(workId).then(response => {
        if (response.ok) {
            alert("Projet supprimé avec succès");
            getWorks().then(updatedWorks => {
                displayGallery(updatedWorks); // Mise à jour de la galerie
                displayModalGallery(updatedWorks); // Mise à jour du modal
            }).catch(error => {
                console.error("Erreur lors de la récupération des travaux :", error);
                alert("Une erreur s'est produite lors de la mise à jour des travaux.");
            });
        } else {
            alert("Erreur : " + response.status);
        }
    }).catch(error => {
        console.error("Erreur lors de la suppression du projet :", error);
        alert("Une erreur s'est produite lors de la suppression du projet.");
    });
}
