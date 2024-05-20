document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.querySelector('.loginForm');

    loginForm.addEventListener("submit", function(event) {
        event.preventDefault(); // Empêche chargement de la page

        // Récupère les valeurs du formulaire
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Envoie les données au serveur pour vérification
        
        fetch('http://localhost:5678/api/users/login', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Mauvaises informations d\'identification');
            }
        })
        .then(data => {
            localStorage.setItem("token", data.token); 
            window.location.replace("index.html");
        })
        .catch(error => {
            console.error('Erreur:', error);
            // Affiche un message d'erreur à l'utilisateur
            const errorMessage = document.createElement('div');
            errorMessage.textContent = 'Mauvaises informations d\'identification.';
            loginForm.appendChild(errorMessage);
        });
    });
});

