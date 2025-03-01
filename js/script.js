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


fetch('json/games.json')
    .then(res => res.json())
    .then(games => {
        const gamesPerPage = 5;
        let currentPage = 0;
        const totalPages = Math.ceil(games.length / gamesPerPage);
        const container = document.querySelector('.games');
        const prevButton = document.getElementById('prevButton');
        const nextButton = document.getElementById('nextButton');
        const pageButtonsContainer = document.getElementById('pageButtons');

        const renderGames = () => {
            container.innerHTML = games.slice(currentPage * gamesPerPage, (currentPage + 1) * gamesPerPage)
                .map(game => `<div class="game-img">
                    <img class="game-image" src="${game.img}" alt="${game.title} game">
                    <h2 class="game-title">${game.title}</h2>
                </div>`).join('');
            renderPagination();
        };

        const renderPagination = () => {
            pageButtonsContainer.innerHTML = Array.from({ length: totalPages }, (_, i) => 
                `<button ${i === currentPage ? 'class="active"' : ''}>${i + 1}</button>`).join('');
            [...pageButtonsContainer.children].forEach((btn, i) => btn.onclick = () => (currentPage = i, renderGames()));
        };

        [prevButton, nextButton].forEach((btn, i) => btn.onclick = () => {
            currentPage = (currentPage + (i ? 1 : -1) + totalPages) % totalPages;
            renderGames();
        });

        renderGames();
    })
    .catch(err => console.error('Error loading JSON:', err));

