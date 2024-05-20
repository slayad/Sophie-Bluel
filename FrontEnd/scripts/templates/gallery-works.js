// Fonction pour afficher les travaux dans la galerie après leur chargement ou mise à jour
export function displayGallery(works) {
    const gallery = document.getElementsByClassName('gallery')[0];
    gallery.innerHTML = '';
    works.forEach((work) => {
        const figure = document.createElement('figure');
        figure.setAttribute("category-id", work.categoryId);
        const div = document.createElement('div');
        const img = document.createElement('img');

        img.src = work.imageUrl;
        const caption = document.createElement('figcaption');
        caption.textContent = work.title;

        div.appendChild(img);
        div.appendChild(caption);
        figure.appendChild(div);
        gallery.appendChild(figure);
    });
}
