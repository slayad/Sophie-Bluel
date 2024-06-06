import { getWorks, getCategories, addWork, deleteWork } from "./api.js";
import { displayGallery } from "./templates/gallery-works.js";
import { displayModalGallery } from "./templates/modal-works.js";
import { manageAdminMode } from "./templates/admin-mode.js";
import { displayCategorieFilters } from "./templates/gallery-filters.js";

// Fonction pour supprimer un travail et mettre à jour la galerie sans recharger la page
export function startDeleteWork(workId, workElement) {
    deleteWork(workId).then(response => {
        if (response.ok) {
            workElement.remove(); // Supprime l'élément du DOM

            // Récupérer les travaux mis à jour et rafraîchir la galerie
            getWorks().then(updatedWorks => {
                displayGallery(updatedWorks);
                displayModalGallery(updatedWorks);
            }).catch(error => {
                console.error('Erreur lors de la récupération des travaux :', error);
            });
        } else {
            console.error("Erreur lors de la suppression du projet :", response.status);
        }
    }).catch(error => {
        console.error("Erreur lors de la suppression du projet :", error);
    });
}

// Gestion des miniatures et modals
document.addEventListener("DOMContentLoaded", function() {
    console.log("DOMContentLoaded");
    initializeEventHandlers();
    manageAdminMode();

    // Prévenir le comportement par défaut des formulaires
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            event.preventDefault(); // Empêche le rechargement de la page
            event.stopImmediatePropagation();
            console.log('Form submission prevented');
        });
    });

    // Récupération et affichage initial des œuvres et catégories
    getWorks()
        .then(works => {
            displayGallery(works);
            displayModalGallery(works);
        })
        .catch(error => console.error('Erreur lors de la récupération des travaux :', error));

    getCategories()
        .then(categories => {
            displayCategorieFilters(categories);
        })
        .catch(error => console.error('Erreur lors de la récupération des catégories :', error));
});

// Initialiser les gestionnaires d'événements
function initializeEventHandlers() {
    document.addEventListener("click", function(event) {

        // Gestion du clic pour éditer la galerie
        const editLink = document.querySelector("#editLink");
        if (editLink && event.target.closest("#editLink")) {
            event.preventDefault();
            event.stopImmediatePropagation();
            console.log("Edit link clicked");
            openEditGallery();
            return false;
        }

        // Boutons spécifiques pour l'ajout de photos et la gestion des modales
        const addPictureBtn = document.querySelector("#addPictureBtn");
        if (addPictureBtn) {
            addPictureBtn.addEventListener("click", function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();
                console.log("Add picture button clicked");
                initializeAddPhotoForm();
                return false;
            });
        }

        const editGalleryCloseButton = document.querySelector("#editGallery .fa-xmark");
        if (editGalleryCloseButton) {
            editGalleryCloseButton.addEventListener("click", function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();
                console.log("Edit gallery close button clicked");
                closeModal("#editGallery");
                return false;
            });
        }

        const arrowLeft = document.querySelector("#addPicture .fa-arrow-left");
        if (arrowLeft) {
            arrowLeft.addEventListener("click", function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();
                console.log("Arrow left clicked");
                switchModalViews("#editGallery", "#addPicture");
                return false;
            });
        }

        const closeButton = document.querySelector("#addPicture .fa-xmark");
        if (closeButton) {
            closeButton.addEventListener("click", function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();
                console.log("Add picture close button clicked");
                closeModal("#addPicture");
                return false;
            });
        }
    });

    const submitButton = document.querySelector("#valider");
    if (submitButton) {
        submitButton.addEventListener("click", function(event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            console.log("Submit button clicked");
            handleAddPictureFormSubmit(event);
            return false;
        });
    }
}

// Fonctions pour ouvrir la galerie d'édition, changer les vues de modales, et plus
function openEditGallery() {
    console.log("openEditGallery");
    const modal = document.querySelector(".modal");
    const editGallery = document.querySelector("#editGallery");

    modal.style.display = "flex";
    editGallery.style.display = "flex";
}

function switchModalViews(fromModal, toModal) {
    console.log("switchModalViews");
    document.querySelector(fromModal).style.display = "none";
    document.querySelector(toModal).style.display = "flex";
}

function closeModal(modalId) {
    console.log("closeModal");
    document.querySelector(modalId).style.display = "none";
    const anyModalOpen = document.querySelector(".modalWrapper[style*='display: flex']");
    if (!anyModalOpen) {
        document.querySelector(".modal").style.display = "none";
    }
}

function initializeAddPhotoForm() {
    console.log("initializeAddPhotoForm");
    const addPictureModal = document.querySelector("#addPicture");
    const editGalleryModal = document.querySelector("#editGallery");
    const labelPhoto = document.querySelector("#labelPhoto");
    const picturePreview = document.querySelector("#picturePreview");
    const submitButton = document.querySelector("#valider");
    const addPictureForm = document.querySelector("#addPictureForm");
    const photoInput = document.querySelector("#photo");

    document.querySelector(".modal").style.display = "flex";
    addPictureModal.style.display = "flex";
    editGalleryModal.style.display = "none";

    labelPhoto.style.display = "flex";
    picturePreview.style.display = "none";
    submitButton.style.backgroundColor = "#A7A7A7";

    addPictureForm.reset();

    selectCategoryForm();
    prepareImagePreview(photoInput);

    handleFormEvents(addPictureForm, submitButton);
}

function prepareImagePreview(photoInput) {
    photoInput.addEventListener('change', function(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        console.log("Photo input changed");

        const file = photoInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const previewImage = document.querySelector("#picturePreviewImg");
                previewImage.src = e.target.result;
                document.querySelector("#picturePreview").style.display = "flex";
                document.querySelector("#labelPhoto").style.display = "none";
            };
            reader.readAsDataURL(file);
        }
    });
}

function handleFormEvents(form, submitButton) {
    form.onchange = function() {
        console.log("Form changed");
        changeSubmitBtnColor(submitButton);
    };

    document.querySelector(".modalHeader .fa-arrow-left").addEventListener("click", function(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        console.log("Arrow left in form clicked");
        switchModalViews("#addPicture", "#editGallery");
        return false;
    });

    document.querySelector("#addPicture .fa-xmark").addEventListener("click", function(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        console.log("Close button in form clicked");
        closeModal("#addPicture");
        return false;
    });
}

function changeSubmitBtnColor(submitButton) {
    const photoInput = document.querySelector("#photo");
    if (photoInput.files.length > 0) {
        submitButton.style.backgroundColor = "#306685";
    } else {
        submitButton.style.backgroundColor = "#A7A7A7";
    }
}

function handleAddPictureFormSubmit(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    console.log("handleAddPictureFormSubmit");

    const photoInput = document.querySelector("#photo");
    const titleInput = document.querySelector("#title");
    const categorySelect = document.querySelector("#selectCategory");

    const photo = photoInput.files[0];
    const title = titleInput.value;
    const categoryId = categorySelect.value;

    if (!photo || !title || !categoryId) {
        alert("Veuillez remplir tous les champs.");
        return false;
    }

    const formData = new FormData();
    formData.append('image', photo, photo.name);
    formData.append('title', title);
    formData.append('category', categoryId);

    sendNewData(formData);
    return false;
}

function sendNewData(formData) {
    console.log("sendNewData - Début");
    addWork(formData)
    .then(() => {
        return getWorks(); // Récupérer les travaux mis à jour depuis le serveur
    })
    .then(updatedWorks => {
        displayGallery(updatedWorks); // Met à jour l'affichage de la galerie avec les nouvelles données
        displayModalGallery(updatedWorks); // Met à jour l'affichage de la modale avec les nouvelles données
    })
    .catch(error => console.error('Erreur lors de la récupération des travaux :', error));
    console.log("sendNewData - Fin");
}

function selectCategoryForm() {
    console.log("selectCategoryForm");
    const select = document.getElementById('selectCategory');
    getCategories()
        .then(categories => {
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                select.appendChild(option);
            });
        })
        .catch(error => console.error('Erreur lors de la récupération des catégories :', error));
}

