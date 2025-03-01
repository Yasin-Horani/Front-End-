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


// display 5 games per page 
fetch('json/games.json')
    .then(response => response.json())
    .then(games => {
        const gamesPerPage = 6;
        let currentPage = 0;
        const totalPages = Math.ceil(games.length / gamesPerPage);
        const container = document.querySelector('.games');
        const prevButton = document.getElementById('prevButton');
        const nextButton = document.getElementById('nextButton');
        const pageButtonsContainer = document.getElementById('pageButtons');

        function renderGames() {
            container.innerHTML = ''; // Clear current games
            const gamesToShow = games.slice(currentPage * gamesPerPage, (currentPage + 1) * gamesPerPage);
            gamesToShow.forEach(game => {
                const gameDiv = document.createElement('div');
                gameDiv.classList.add('game-img');

                const img = document.createElement('img');
                img.classList.add('game-image');
                img.src = game.img;
                img.alt = game.title + ' game';

                const title = document.createElement('h2');
                title.classList.add('game-title');
                title.textContent = game.title;

                gameDiv.appendChild(img);
                gameDiv.appendChild(title);
                container.appendChild(gameDiv);
            });

            updatePageButtons(); // Update the page buttons when games are rendered
        }

        function updatePageButtons() {
            pageButtonsContainer.innerHTML = ''; // Clear the existing buttons
            for (let i = 0; i < totalPages; i++) {
                const button = document.createElement('button');
                button.textContent = i + 1; // Button number starts from 1
                button.addEventListener('click', () => {
                    currentPage = i;
                    renderGames(); // Render the selected page's games
                });
                if (i === currentPage) {
                    button.style.backgroundColor = '#4CAF50'; // Highlight the active page
                    button.style.color = 'white';
                }
                pageButtonsContainer.appendChild(button);
            }
        }

        prevButton.addEventListener('click', () => {
            if (currentPage > 0) {
                currentPage--;
            } else {
                currentPage = totalPages - 1; // Go to last page
            }
            renderGames();
        });

        nextButton.addEventListener('click', () => {
            if (currentPage < totalPages - 1) {
                currentPage++;
            } else {
                currentPage = 0; // Go back to first page
            }
            renderGames();
        });

        renderGames(); // Initial render
    })
    .catch(error => console.error('Error loading JSON:', error));
