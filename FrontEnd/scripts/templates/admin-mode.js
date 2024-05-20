export function manageAdminMode() {
    const token = localStorage.getItem("token");
    if (token) {
        //bandeau noir
        const blackBanner = document.createElement("div");
        blackBanner.classList.add("black-banner");
        //texte:mode edition
        const editIcon = document.createElement('i');
        editIcon.classList.add('far', 'fa-pen-to-square');
        blackBanner.appendChild(editIcon);
        editIcon.style.marginRight = "10px";
        const bannerText = document.createElement("p");
        bannerText.textContent = "Mode édition";
        blackBanner.appendChild(bannerText);
        //Ajout bandeau noir au body
        document.body.appendChild(blackBanner);
        //modifie login en logout
        const loginLink = document.querySelector('nav ul li:nth-child(3) a');
        loginLink.textContent = "Logout";
        loginLink.addEventListener("click", function(event) {
            event.preventDefault();
            //supprime le token quand je clique sur logout
            localStorage.removeItem("token");
            //redirige vers la page d'authentification
            window.location.href = "login.html";
        });
        //masque les boutons filtre
        document.querySelector(".filter").style.display = "none";
        //ajout de "modifier"
        const portfolioHeader = document.querySelector('#portfolio h2');
        const editLink = document.createElement('a');
        editLink.href = '#';
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
            document.querySelector('.modal').style.display = 'block';
        });
        //gestionnaire d'evenement clique croix
        const closeButton = document.querySelector('.modalHeader .fa-xmark');
        closeButton.addEventListener("click", function() {
            document.querySelector('.modal').style.display = 'none';
        });
    }
}