"use strict";
function loadComponent(id, file) {
    fetch(file)
        .then(response => response.text())
        .then(data => {
            document.getElementById(id).innerHTML = data;
            //Dynamic title 
            document.title = document.querySelector(".title").innerText;
        })
        .catch(error => console.error(`Error loading ${file}:`, error));
}
//HEAD
loadComponent("head-placeholder", "head.html");
//Navigation
loadComponent("nav-placeholder", "nav.html");
//footer
loadComponent("footer-placeholder", "footer.html");


// Load the games data from a JSON file
fetch('json/games.json')
    .then(response => response.json()) // Convert response to JSON
    .then(games => {
        const gamesPerPage = 5; // Number of games per page
        let currentPage = 0; // Start at the first page
        const totalPages = Math.ceil(games.length / gamesPerPage); // Calculate total pages
        
        const container = document.querySelector('.games'); // Get the container for games
        const prevButton = document.getElementById('prevButton'); // Get previous button
        const nextButton = document.getElementById('nextButton'); // Get next button
        const pageButtonsContainer = document.getElementById('pageButtons'); // Get pagination container

        function showGames() {
            // Clear the container and show the current page's games
            container.innerHTML = '';
            const start = currentPage * gamesPerPage;
            const end = start + gamesPerPage;
            const gamesToShow = games.slice(start, end);

            gamesToShow.forEach(game => {
                const gameDiv = document.createElement('div');
                gameDiv.classList.add('game-img');
                
                const gameImage = document.createElement('img');
                gameImage.classList.add('game-image');
                gameImage.src = game.img;
                gameImage.alt = game.title + ' game';

                const gameTitle = document.createElement('h2');
                gameTitle.classList.add('game-title');
                gameTitle.textContent = game.title;

                gameDiv.appendChild(gameImage);
                gameDiv.appendChild(gameTitle);
                container.appendChild(gameDiv);
            });

            updatePagination();
        }

        function updatePagination() {
            pageButtonsContainer.innerHTML = '';
            for (let i = 0; i < totalPages; i++) {
                const pageButton = document.createElement('button');
                pageButton.textContent = i + 1;
                if (i === currentPage) {
                    pageButton.classList.add('active');
                }
                pageButton.addEventListener('click', () => {
                    currentPage = i;
                    showGames();
                });
                pageButtonsContainer.appendChild(pageButton);
            }
        }

        prevButton.addEventListener('click', () => {
            if (currentPage > 0) {
                currentPage--;
                showGames();
            }
        });

        nextButton.addEventListener('click', () => {
            if (currentPage < totalPages - 1) {
                currentPage++;
                showGames();
            }
        });

        showGames(); // Show the first page when the script runs
    })
    .catch(error => console.error('Error loading JSON:', error));
