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
    .then((response) => {
        return response.json();
    })
    .then((data) => {console.log(data)
        })
