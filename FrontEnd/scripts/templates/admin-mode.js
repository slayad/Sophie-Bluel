export function manageAdminMode() {
    const token = localStorage.getItem("token");
    if (token) {
        // Bandeau noir
        const blackBanner = document.createElement("div");
        blackBanner.classList.add("black-banner");

        // Texte: mode édition
        const editIcon = document.createElement('i');
        editIcon.classList.add('far', 'fa-pen-to-square');
        blackBanner.appendChild(editIcon);
        editIcon.style.marginRight = "10px";

        const bannerText = document.createElement("p");
        bannerText.textContent = "Mode édition";
        blackBanner.appendChild(bannerText);

        // Ajout bandeau noir au body
        document.body.appendChild(blackBanner);

        // Modifie login en logout
        const loginLink = document.querySelector('nav ul li:nth-child(3) a');
        if (loginLink) {
            loginLink.textContent = "Logout";
            loginLink.addEventListener("click", function(event) {
                event.preventDefault();
                // Supprime le token quand je clique sur logout
                localStorage.removeItem("token");
                // Redirige vers la page d'authentification
                window.location.href = "login.html";
            });
        }

        // Masque les boutons filtre
        const filterButtons = document.querySelector(".filter");
        if (filterButtons) {
            filterButtons.style.display = "none";
        }

        // Ajout de "Modifier"
        const portfolioHeader = document.querySelector('#portfolio h2');
        if (portfolioHeader) {
            const editLink = document.createElement('a');
            editLink.href = '#';
            editLink.id = 'editLink'; // Ajout de l'ID editLink
            editLink.style.fontSize = '14px';
            editLink.style.marginLeft = '20px';

            const icon = document.createElement('i');
            icon.classList.add('fa-regular', 'fa-pen-to-square');
            editLink.appendChild(icon);
            editLink.appendChild(document.createTextNode(' Modifier'));
            portfolioHeader.appendChild(editLink);

            // ********MODAL****** //
            editLink.addEventListener("click", function(event) {
                event.preventDefault();
                document.querySelector('.modal').style.display = 'flex';
                document.querySelector('#editGallery').style.display = 'flex'; // Assure que `editGallery` est bien affiché
            });
        }

        // Gestionnaire d'événement clique croix
        const closeButton = document.querySelector('.modalHeader .fa-xmark');
        if (closeButton) {
            closeButton.addEventListener("click", function() {
                document.querySelector('.modal').style.display = 'none';
                document.querySelector('#editGallery').style.display = 'none'; // Cache `editGallery`
            });
        }
    }
}
