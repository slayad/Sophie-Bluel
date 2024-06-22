import { getWorks, getCategories, addWork, deleteWork } from "./api.js";
import { displayGallery } from "./templates/gallery-works.js";
import { displayModalGallery } from "./templates/modal-works.js";
import { manageAdminMode } from "./templates/admin-mode.js";
import { displayCategorieFilters } from "./templates/gallery-filters.js";

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.classList.add('notification', type);
    notification.textContent = message;

    document.body.appendChild(notification);

    // Supprime la notification après 3 secondes
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

export function startDeleteWork(workId, workElement) {
    deleteWork(workId).then(response => {
        if (response.ok) {
            workElement.remove(); // Supprime l'élément du DOM
            showNotification('Photo supprimée avec succès.', 'success');

            // Récupérer les travaux mis à jour et rafraîchir la galerie
            getWorks().then(updatedWorks => {
                displayGallery(updatedWorks);
                displayModalGallery(updatedWorks);
            }).catch(error => {
                console.error('Erreur lors de la récupération des travaux :', error);
            });
        } else {
            console.error("Erreur lors de la suppression du projet :", response.status);
            showNotification('Erreur lors de la suppression de la photo.', 'error');
        }
    }).catch(error => {
        console.error("Erreur lors de la suppression du projet :", error);
        showNotification('Erreur lors de la suppression de la photo.', 'error');
    });
}

document.addEventListener("DOMContentLoaded", function() {
    initializeEventHandlers();
    manageAdminMode();

    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            event.stopImmediatePropagation();
        });
    });

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

function initializeEventHandlers() {
    document.addEventListener("click", function(event) {
        const editLink = document.querySelector("#editLink");
        if (editLink && event.target.closest("#editLink")) {
            event.preventDefault();
            event.stopImmediatePropagation();
            openEditGallery();
            return false;
        }

        const addPictureBtn = document.querySelector("#addPictureBtn");
        if (addPictureBtn) {
            addPictureBtn.addEventListener("click", function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();
                initializeAddPhotoForm();
                return false;
            });
        }

        const editGalleryCloseButton = document.querySelector("#editGallery .fa-xmark");
        if (editGalleryCloseButton) {
            editGalleryCloseButton.addEventListener("click", function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();
                closeModal("#editGallery");
                return false;
            });
        }

        const arrowLeft = document.querySelector("#addPicture .fa-arrow-left");
        if (arrowLeft) {
            arrowLeft.addEventListener("click", function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();
                switchModalViews("#addPicture", "#editGallery");
                return false;
            });
        }

        const closeButton = document.querySelector("#addPicture .fa-xmark");
        if (closeButton) {
            closeButton.addEventListener("click", function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();
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
            handleAddPictureFormSubmit(event);
            return false;
        });
    }
}

function openEditGallery() {
    const modal = document.querySelector(".modal");
    const editGallery = document.querySelector("#editGallery");

    modal.style.display = "flex";
    editGallery.style.display = "flex";
}

function switchModalViews(fromModal, toModal) {
    document.querySelector(fromModal).style.display = "none";
    document.querySelector(toModal).style.display = "flex";
}

function closeModal(modalId) {
    document.querySelector(modalId).style.display = "none";
    const anyModalOpen = document.querySelector(".modalWrapper[style*='display: flex']");
    if (!anyModalOpen) {
        document.querySelector(".modal").style.display = "none";
    }
}

function initializeAddPhotoForm() {
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

    clearCategoryOptions();
    selectCategoryForm();
    prepareImagePreview(photoInput);

    handleFormEvents(addPictureForm);
}

function clearCategoryOptions() {
    const select = document.getElementById('selectCategory');
    select.innerHTML = '';  // Vider le menu déroulant des catégories
}

function prepareImagePreview(photoInput) {
    photoInput.addEventListener('change', function(event) {
        event.preventDefault();
        event.stopImmediatePropagation();

        const file = photoInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const previewImage = document.querySelector("#picturePreviewImg");
                previewImage.src = e.target.result;
                document.querySelector("#picturePreview").style.display = "flex";
                document.querySelector("#labelPhoto").style.display = "none";
                updateSubmitButtonState();
            };
            reader.readAsDataURL(file);
        }
    });
}

function handleFormEvents(form) {
    form.onchange = function() {
        updateSubmitButtonState();
    };

    const arrowLeft = document.querySelector("#addPicture .fa-arrow-left");
    arrowLeft.addEventListener("click", function(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        switchModalViews("#addPicture", "#editGallery");
        return false;
    });

    const closeButton = document.querySelector("#addPicture .fa-xmark");
    closeButton.addEventListener("click", function(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        closeModal("#addPicture");
        return false;
    });
}

function updateSubmitButtonState() {
    const photoInput = document.querySelector("#photo");
    const titleInput = document.querySelector("#title");
    const categorySelect = document.querySelector("#selectCategory");
    const submitButton = document.querySelector("#valider");

    if (photoInput.files.length > 0 && titleInput.value.trim() !== "" && categorySelect.value !== "") {
        submitButton.style.backgroundColor = "#306685";
    } else {
        submitButton.style.backgroundColor = "#A7A7A7";
    }
}

function handleAddPictureFormSubmit(event) {
    event.preventDefault();
    event.stopImmediatePropagation();

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
    addWork(formData)
    .then(() => {
        showNotification('Photo ajoutée avec succès.', 'success');
        return getWorks(); // Récupérer les travaux mis à jour depuis le serveur
    })
    .then(updatedWorks => {
        displayGallery(updatedWorks); // Met à jour l'affichage de la galerie avec les nouvelles données
        displayModalGallery(updatedWorks); // Met à jour l'affichage de la modale avec les nouvelles données
    })
    .catch(error => {
        console.error('Erreur lors de la récupération des travaux :', error);
        showNotification('Erreur lors de l\'ajout de la photo.', 'error');
    });
}

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



