"use strict";

function loadComponent(id, file) {
  fetch(file)
    .then((response) => response.text())
    .then((data) => {
      document.getElementById(id).innerHTML = data;
      document.title = document.querySelector(".title").innerText;
    })
    .catch((error) => console.error(`Error loading ${file}:`, error));
}

// Load components
loadComponent("head-placeholder", "head.html");
//Navigation
loadComponent("nav-placeholder", "nav.html");
//footer
loadComponent("footer-placeholder", "footer.html");

let games = [];
let currentPage = 1;
const gamesPerPage = 5;

// Function to display games for the current page
function displayGames(filteredGames = games) {
  const startIndex = (currentPage - 1) * gamesPerPage;
  const endIndex = startIndex + gamesPerPage;
  const gamesToDisplay = filteredGames.slice(startIndex, endIndex);

  const container = document.querySelector(".games");
  container.innerHTML = "";

  gamesToDisplay.forEach((game) => {
    const gameDiv = document.createElement("div");
    gameDiv.className = "game-img";

    gameDiv.innerHTML = `
            <img src="${game.img}" alt="${game.title} game" class="game-image">
            <h2 class="game-title">${game.title}</h2>
            <div class="hover-info">Released in <span>${game.year}</span> Price on Steam: <span>€${game.price}</span></div>
        `;

    container.appendChild(gameDiv);
  });

  updatePagination(filteredGames.length);
}

// Function to update pagination buttons
function updatePagination(totalGames) {
  const totalPages = Math.ceil(totalGames / gamesPerPage);
  const pageButtonsContainer = document.getElementById("pageButtons");
  pageButtonsContainer.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i;
    if (i === currentPage) {
      pageButton.classList.add("active");
    }
    pageButton.addEventListener("click", () => {
      currentPage = i;
      displayGames();
    });
    pageButtonsContainer.appendChild(pageButton);
  }
}

// Fetch and load games from JSON
fetch("json/games.json")
  .then((response) => response.json())
  .then((data) => {
    games = data;
    displayGames();
  })
  .catch((error) => console.error("Error loading JSON:", error));

// Pagination button event listeners
document.getElementById("prevButton").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    displayGames();
  }
});

document.getElementById("nextButton").addEventListener("click", () => {
  if (currentPage < Math.ceil(games.length / gamesPerPage)) {
    currentPage++;
    displayGames();
  }
});
