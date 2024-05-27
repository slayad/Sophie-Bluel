import { getWorks, getCategories, addWork } from "./api.js";
import { displayGallery } from "./templates/gallery-works.js";
import { displayModalGallery } from "./templates/modal-works.js";
import { displayCategorieFilters } from "./templates/gallery-filters.js";
import { manageAdminMode } from "./templates/admin-mode.js";

// Gestion des miniatures et modals
document.addEventListener("DOMContentLoaded", function() {
    initializeEventHandlers();
    manageAdminMode();

    getWorks()
        .then(works => {
            displayGallery(works);  // Affiche les œuvres dans la galerie principale
            displayModalGallery(works); // Affiche les œuvres dans la modale
        })
        .catch(error => console.error('Erreur lors de la récupération des travaux :', error));

    getCategories()
        .then(categories => {
            displayCategorieFilters(categories);
        })
        .catch(error => console.error('Erreur lors de la récupération des catégories :', error));
});

// Ajouter les catégories à la liste déroulante
function selectCategoryForm() {
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

// Initialiser les gestionnaires d'événements
function initializeEventHandlers() {
    document.addEventListener("click", function(event) {
        const editLink = document.querySelector("#editLink");
        if (editLink && event.target.closest("#editLink")) {
            event.preventDefault();
            openEditGallery();
        }
    });

    const addPictureBtn = document.querySelector("#addPictureBtn");
    if (addPictureBtn) {
        addPictureBtn.addEventListener("click", function() {
            initializeAddPhotoForm();
        });
    }

    const editGalleryCloseButton = document.querySelector("#editGallery .fa-xmark");
    if (editGalleryCloseButton) {
        editGalleryCloseButton.addEventListener("click", function() {
            closeModal("#editGallery");
        });
    }

    const arrowLeft = document.querySelector("#addPicture .fa-arrow-left");
    if (arrowLeft) {
        arrowLeft.addEventListener("click", function() {
            document.querySelector(".modal").style.display = "flex"; // Assure que l'arrière-plan grisé est affiché
            document.querySelector("#editGallery").style.display = "flex";
            document.querySelector("#addPicture").style.display = "none";
        });
    }

    const closeButton = document.querySelector("#addPicture .fa-xmark");
    if (closeButton) {
        closeButton.addEventListener("click", function() {
            closeModal("#addPicture");
        });
    }

    const submitButton = document.querySelector("#valider");
    if (submitButton) {
        submitButton.addEventListener("click", function(event) {
            event.preventDefault();
            handleAddPictureFormSubmit();
        });
    }
}

function openEditGallery() {
    const modal = document.querySelector(".modal");
    const editGallery = document.querySelector("#editGallery");

    modal.style.display = "flex";  // Assure que l'arrière-plan grisé est affiché
    editGallery.style.display = "flex";  // Utilise `display: flex` pour maintenir la consistance
}

// Fonction pour initialiser le formulaire d'ajout de photo
function initializeAddPhotoForm() {
    const addPictureModal = document.querySelector("#addPicture");
    const editGalleryModal = document.querySelector("#editGallery");
    const labelPhoto = document.querySelector("#labelPhoto");
    const picturePreview = document.querySelector("#picturePreview");
    const submitButton = document.querySelector("#valider");
    const addPictureForm = document.querySelector("#addPictureForm");
    const photoInput = document.querySelector("#photo");

    document.querySelector(".modal").style.display = "flex"; // Assure que l'arrière-plan grisé est affiché
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

// Fonction pour gérer l'aperçu de l'image
function prepareImagePreview(photoInput) {
    photoInput.addEventListener('change', function(event) {
        event.preventDefault();

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

// Fonction pour gérer les événements du formulaire
function handleFormEvents(form, submitButton) {
    form.onchange = function() {
        changeSubmitBtnColor(submitButton);
    };

    document.querySelector(".modalHeader .fa-arrow-left").addEventListener("click", function() {
        document.querySelector(".modal").style.display = "flex"; // Assure que l'arrière-plan grisé est affiché
        document.querySelector("#editGallery").style.display = "flex";
        document.querySelector("#addPicture").style.display = "none";

        const addPictureBtn = document.querySelector("#addPictureBtn");
        addPictureBtn.style.display = 'block';
        addPictureBtn.style.margin = '20px auto';
    });

    document.querySelector("#addPicture .fa-xmark").addEventListener("click", function() {
        closeModal("#addPicture");
    });
}

// Fonction pour fermer un modal
function closeModal(modalId) {
    const modal = document.querySelector(modalId);
    if (modal) {
        modal.style.display = "none";
    }

    const anyModalOpen = document.querySelector(".modalWrapper[style*='display: flex']");
    if (!anyModalOpen) {
        document.querySelector(".modal").style.display = "none"; // Masque également l'arrière-plan grisé
    }
}

// Fonction pour changer la couleur du bouton de soumission
function changeSubmitBtnColor(submitButton) {
    const photoInput = document.querySelector("#photo");
    if (photoInput.files.length > 0) {
        submitButton.style.backgroundColor = "#306685";
    } else {
        submitButton.style.backgroundColor = "#A7A7A7";
    }
}

// Fonction pour gérer la soumission du formulaire d'ajout de photo
function handleAddPictureFormSubmit() {
    const photoInput = document.querySelector("#photo");
    const titleInput = document.querySelector("#title");
    const categorySelect = document.querySelector("#selectCategory");

    const photo = photoInput.files[0];
    const title = titleInput.value;
    const categoryId = categorySelect.value;
    const categoryName = categorySelect.options[categorySelect.selectedIndex].text;

    if (!photo || !title || !categoryId) {
        alert("Veuillez remplir tous les champs.");
        return;
    }

    const formData = new FormData();
    formData.append('image', photo, photo.name);
    formData.append('title', title);
    formData.append('category', categoryId);

    sendNewData(formData, categoryName);
}

// Fonction pour envoyer les données de la nouvelle photo au serveur
function sendNewData(formData,) {
    addWork(formData)
    .then(() => {
        getWorks() // Récupérer les travaux mis à jour depuis le serveur
            .then(updatedWorks => {
                displayGallery(updatedWorks); // Met à jour l'affichage de la galerie avec les nouvelles données
                displayModalGallery(updatedWorks); // Met à jour l'affichage de la modale avec les nouvelles données
                closeModal(".modal"); // Ferme la modale
            })
    })
}
