export function displayCategorieFilters(categories) {
    const filters = document.querySelector('.filter');
    
    // Créer le bouton "Tous"
    const allButton = createFilterButton(null, 'Tous');
    filters.appendChild(allButton);

    categories.forEach(category => {
        const categoryButton = createFilterButton(category.id, category.name);
        filters.appendChild(categoryButton);
    });

    const buttons = filters.querySelectorAll('.bouton');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const categoryId = button.getAttribute('category-id');
            if (categoryId) {
                filterWorks(categoryId);
            } else {
                filterAll();
            }
        });
    });
}

function filterWorks(filterCategoryId) {
    const elements = document.querySelectorAll('div.gallery figure');
    elements.forEach(element => {
        const categoryId = element.getAttribute('category-id');
        if (categoryId === filterCategoryId) {
            element.style.display = 'block';
        } else {
            element.style.display = 'none';
        }
    });
}

function filterAll() {
    const elements = document.querySelectorAll('div.gallery figure');
    elements.forEach(element => element.style.display = 'block');
}

function createFilterButton(categoryId, buttonText) {
    const button = document.createElement('button');
    button.setAttribute("type", "button");
    button.classList.add("bouton");
    if (categoryId) {
        button.setAttribute('category-id', categoryId);
    }
    button.textContent = buttonText;
    return button;
}