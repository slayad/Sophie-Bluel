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






