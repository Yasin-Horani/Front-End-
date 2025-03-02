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
    .then(response => response.json())
    .then(games => {
        const gamesPerPage = 5;
        let currentPage = 0;
        const totalPages = Math.ceil(games.length / gamesPerPage);
        
        const container = document.querySelector('.games');
        const prevButton = document.getElementById('prevButton');
        const nextButton = document.getElementById('nextButton');
        const pageButtonsContainer = document.getElementById('pageButtons');

        function showGames() {
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

                // Hover info div (price & year)
                const hoverInfo = document.createElement('div');
                hoverInfo.classList.add('hover-info');
                hoverInfo.textContent = `Released in ${game.year}, it is priced at €${game.price}`;

                // Append elements
                gameDiv.appendChild(gameImage);
                gameDiv.appendChild(gameTitle);
                gameDiv.appendChild(hoverInfo);
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

        showGames();
    })
    .catch(error => console.error('Error loading JSON:', error));