//recuperation des travaux depuis le backend


//works
fetch("http://localhost:5678/api/works")
    .then (response=> {
        return response.json();
        })
        .then((works) => {
            createDocumentWorks(works);
        })
        function createDocumentWorks(works) {
            const fragment = document.createDocumentFragment();
            const gallery = document.getElementsByClassName('gallery')[0];
        
            gallery.innerHTML = ''; 
            works.forEach((work) => {
                const figure = document.createElement('figure');
                figure.setAttribute("category-id" , work.categoryId)
                const div = document.createElement('div');
                const img = document.createElement('img');
        
                img.src = work.imageUrl;
                
        
                const caption = document.createElement('figcaption')
                caption.textContent = work.title;
                fragment.appendChild(figure);
                figure.appendChild(div);
                div.appendChild(img);
                div.appendChild(caption);
            })
            gallery.appendChild(fragment);
        }


//categories  

fetch('http://localhost:5678/api/categories')
    .then((response) => response.json())
        .then((categories) => {
            const filtres = document.querySelector('.filter');

            // Créer le bouton "Tous"
            const allButton = createFilterButton(null, 'Tous')
            
            /*document.createElement('button')
                allButton.setAttribute("type", "button")
                allButton.classList.add("bouton")
                allButton.innerHTML = "Tous";
                */
                filtres.appendChild(allButton);

            /**
             * Pour chaque catégorie, on crée un bouton :
             * - on lui ajoute les attributs nécessaires,
             * - et on l'ajoute dans la div ".filter"
             */
            categories.forEach((category) => {
                const categoryButton = createFilterButton(category.id, category.name)
                /*document.createElement('button')
                categoryButton.setAttribute("type", "button")
                categoryButton.setAttribute('category-id', category.id)
                categoryButton.classList.add("bouton")
                categoryButton.innerHTML= category.name*/
                filtres.appendChild(categoryButton);
            });

            /**
             * Je gère les filtres au clic sur les boutons
             */
            const buttons = filtres.querySelectorAll('.bouton');

            // Pour chaque bouton de filtre
            buttons.forEach((button) => {
                // J'écoute le clic sur ce bouton
                button.addEventListener('click', () => {
                    // Je récupère l'ID de la catégorie associée à ce bouton
                    const categoryId = button.getAttribute('category-id');

                    if (categoryId) {
                        filtreWorks(categoryId)
                    } else {
                        filtreTous();
                    }
                })
            })
        });

function filtreWorks(filtreCategoryId) {
    const elements = document.querySelectorAll('div.gallery figure');
    elements.forEach((element) => {
        const categoryId = element.getAttribute('category-id');
        if (categoryId === filtreCategoryId) {
            element.style.display = 'block';
        } else {
            element.style.display = 'none';
        }
    });
}


//Filtre tous//
function filtreTous(){
    const elements = document.querySelectorAll('div.gallery figure');
    elements.forEach((element) => {
        element.style.display = 'block';
    });   
}


function createFilterButton(categoryId, buttonText) {
    const categoryButton = document.createElement('button')
    categoryButton.setAttribute("type", "button")
    if (categoryId) {
        categoryButton.setAttribute('category-id', categoryId)
    }
    categoryButton.classList.add("bouton")
    categoryButton.innerHTML = buttonText

    /**
     * On retourne le bouton en tant que résultat de la fonction
     * 
     * Comme ça, on peut assigner ce bouton à une variable lorsqu'on appellera la fonction :
     * 
     * ex : 
     * 
     * const monButton = createFilterButton("1", "Tous")
     */
    return categoryButton
}

// ********ADMIN MODE****** //

document.addEventListener("DOMContentLoaded", function() {
    // Vérifie si un token d'authentification est présent dans le localStorage
    const token = localStorage.getItem("token");

    if (token) {
        // Crée un élément de bandeau noir
        const blackBanner = document.createElement("div");
        blackBanner.classList.add("black-banner"); // Ajoute une classe CSS pour styler le bandeau noir
        
        // Ajoute le texte "Mode édition" dans le bandeau noir
        const editIcon = document.createElement('i');
        editIcon.classList.add('far', 'fa-pen-to-square');
        blackBanner.appendChild(editIcon);
        editIcon.style.marginRight = "10px";
        const bannerText = document.createElement("p");
        bannerText.textContent = "Mode édition";
        blackBanner.appendChild(bannerText);

        // Ajoute le bandeau noir à l'élément <body> de la page d'accueil
        document.body.appendChild(blackBanner);

        // Modifie le texte du lien "Login" en "Logout"
        const loginLink = document.querySelector('nav ul li:nth-child(3) a'); // Sélectionne le lien "Login"
        loginLink.textContent = "Logout";

        // Gestionnaire d'événements pour le lien "Logout"
        loginLink.addEventListener("click", function(event) {
            event.preventDefault(); // Empêche le comportement par défaut du lien
            // Supprime le token d'authentification du localStorage
            localStorage.removeItem("token");
            // Redirige l'utilisateur vers la page de login
            window.location.href = "login.html";
        });

        // Masque les boutons de filtre
        document.querySelector(".filter").style.display = "none";

        // Ajoute le lien "Modifier" à côté du titre "Mes Projets"
        const portfolioHeader = document.querySelector('#portfolio h2');
        const modifierLink = document.createElement('a');
        modifierLink.href = '#';
        modifierLink.style.fontSize = '14px'; // Taille de police
        modifierLink.style.marginLeft = '20px'; // Marge à gauche
        const icon = document.createElement('i');
        icon.classList.add('fa-regular', 'fa-pen-to-square'); // Ajoute les classes pour l'icône
        modifierLink.appendChild(icon); // Ajoute l'icône
        modifierLink.appendChild(document.createTextNode(' Modifier')); // Ajoute le texte
        portfolioHeader.appendChild(modifierLink);

// ********MODAL****** //

        // Ajoute un gestionnaire d'événements pour le clic sur le lien "Modifier"
        modifierLink.addEventListener("click", function(event) {
            event.preventDefault(); // Empêche le comportement par défaut du lien

            // Recherchez le modal correspondant
            const modal = document.querySelector('.modal');

            // Affichez le modal en changeant son style
            modal.style.display = 'block';
        });

    // Ajoute un gestionnaire d'événements pour le clic sur la croix pour fermer le modal
    const closeButton = document.querySelector('.modalHeader .fa-xmark');
    closeButton.addEventListener("click", function() {
        const modal = document.querySelector('.modal');
        modal.style.display = 'none';

        });
    }
});

