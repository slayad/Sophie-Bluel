import { startDeleteWork } from '../index.js'; 

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
        trashCan.addEventListener("click", (event) => {
            event.preventDefault(); 
            event.stopPropagation(); 
            console.log("Trash can clicked");
            startDeleteWork(work.id, miniWork);
            return false;
        });
    });
}
