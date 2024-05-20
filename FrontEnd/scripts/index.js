import { getWorks, getCategories } from "./api.js";
import { displayGallery } from "./templates/gallery-works.js";
import { displayModalGallery } from "./templates/modal-works.js";
import { displayCategorieFilters } from "./templates/gallery-filters.js";
import { manageAdminMode } from "./templates/admin-mode.js";

// Gestion des miniatures et modal
document.addEventListener("DOMContentLoaded", function() {
    initializeEventHandlers();
    manageAdminMode();

    getWorks()
        .then(works => {
            displayGallery(works);  // Affiche les œuvres dans la galerie principale
            displayModalGallery(works);
        })
        .catch(error => console.error('Erreur:', error));

    getCategories()
        .then(categories => {
            displayCategorieFilters(categories)
        });
});



//*******ajouter photos*******

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
        .catch(error => console.error('Erreur lors du chargement des catégories:', error));
}

function initializeEventHandlers() {
    // Gestionnaire d'événements pour ouvrir la modal de la galerie (première modal)
    const editLink = document.querySelector(".fa-pen-to-square"); 
    if (editLink) {
        editLink.addEventListener("click", function() {
            openEditGallery();
        });
    }

    // Gestionnaire d'événements pour ouvrir le modal d'ajout de photo
    const addPictureBtn = document.querySelector("#addPictureBtn");
    if (addPictureBtn) {
        addPictureBtn.addEventListener("click", function() {
            initializeAddPhotoForm();
        });
    }

    // Gestionnaires d'événements pour fermer les modals
    const editGalleryCloseButton = document.querySelector("#editGallery .fa-xmark");
    if (editGalleryCloseButton) {
        editGalleryCloseButton.addEventListener("click", function() {
            closeModal("#editGallery");
        });
    }

    const arrowLeft = document.querySelector("#addPicture .fa-arrow-left");
    if (arrowLeft) {
        arrowLeft.addEventListener("click", function() {
            document.querySelector("#editGallery").style.display = "block";
            document.querySelector("#addPicture").style.display = "none";
        });
    }

    const closeButton = document.querySelector("#addPicture .fa-xmark");
    if (closeButton) {
        closeButton.addEventListener("click", function() {
            closeModal("#addPicture");
        });
    }
}

function openEditGallery() {
    const modal = document.querySelector(".modal");
    const editGallery = document.querySelector("#editGallery");

    modal.style.display = "flex";  // Affiche l'arrière-plan grisé
    editGallery.style.display = "block";  // Affiche le modal de la galerie
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

    // Affiche le modal pour ajouter une photo et masque l'autre modal
    addPictureModal.style.display = "flex";
    editGalleryModal.style.display = "none";

    // Gestion de l'affichage des éléments du formulaire
    labelPhoto.style.display = "flex";
    picturePreview.style.display = "none";
    submitButton.style.backgroundColor = "#A7A7A7";  // Couleur par défaut (grise)

    // Réinitialise le formulaire à chaque ouverture
    addPictureForm.reset();

    selectCategoryForm();// ajoute les catégories a la liste déroulante
    prepareImagePreview(photoInput); //affiche aperçu de l'image

    // Gère les événements du formulaire
    handleFormEvents(addPictureForm, submitButton);
}

// Fonction pour gérer l'aperçu de l'image
function prepareImagePreview(photoInput) {
    photoInput.addEventListener('change', function(event) {
        event.preventDefault(); // Empêche le comportement par défaut

        const file = photoInput.files[0];  // Récupère le premier fichier sélectionné
        if (file) {
            const reader = new FileReader();  // Crée un lecteur de fichier
            reader.onload = function(e) {
                const previewImage = document.querySelector("#picturePreviewImg");
                previewImage.src = e.target.result;  // Définit la source de l'image de prévisualisation
                document.querySelector("#picturePreview").style.display = "flex";  // Affiche l'élément de prévisualisation
                document.querySelector("#labelPhoto").style.display = "none";  // Cache l'élément labelPhoto
            };
            reader.readAsDataURL(file);  // Lit le fichier en tant qu'URL de données
        }
    });
}

// Fonction pour gérer les événements du formulaire
function handleFormEvents(form, submitButton) {
    form.onchange = function() {
        changeSubmitBtnColor(submitButton);
    };

    // Gestionnaire pour fermer le modal d'ajout de photo et revenir à la galerie
    document.querySelector(".modalHeader .fa-arrow-left").addEventListener("click", function() {
        document.querySelector("#editGallery").style.display = "block";  // Affiche le modal de la galerie
        document.querySelector("#addPicture").style.display = "none";  // Cache le modal d'ajout de photo

        // Réinitialise les styles du bouton "Ajouter une photo" pour s'assurer qu'il est centré
        const addPictureBtn = document.querySelector("#addPictureBtn");
        addPictureBtn.style.display = 'block';
        addPictureBtn.style.margin = '20px auto';  // Centre le bouton horizontalement
    });

    // Gestionnaire pour fermer le modal via la croix
    document.querySelector("#addPicture .fa-xmark").addEventListener("click", function() {
        closeModal("#addPicture");
    });
}

// Fonction pour fermer un modal
function closeModal(modalId) {
    // document.querySelector(modalId).style.display = "none";
    document.querySelector(".modal").style.display = "none";
}

// Fonction pour changer la couleur du bouton de soumission
function changeSubmitBtnColor(submitButton) {
    const photoInput = document.querySelector("#photo");
    if (photoInput.files.length > 0) {  // Vérifie si un fichier a été sélectionné
        submitButton.style.backgroundColor = "#306685";  // Couleur active lorsque la photo est sélectionnée
    } else {
        submitButton.style.backgroundColor = "#A7A7A7";  // Couleur par défaut (grise)
    }
}

// Attache l'événement pour ouvrir le formulaire d'ajout
document.querySelector("#addPictureBtn").addEventListener("click", initializeAddPhotoForm);
