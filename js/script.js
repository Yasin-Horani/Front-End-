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
let filteredGames = [];
let currentPage = 1;
const gamesPerPage = 5; // Number of games to display per page

// Function to display games for the current page
function displayGames() {
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
            <div class="hover-info">Year: <span>${game.year}</span> | Price: <span>€${game.price}</span></div>
        `;

    container.appendChild(gameDiv);
  });

  updatePagination();
}

// Function to update pagination buttons
function updatePagination() {
  const totalPages = Math.ceil(filteredGames.length / gamesPerPage);
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

// Function to filter games by search input
function searchGames() {
  const searchText = document.getElementById("searchInput").value.toLowerCase();
  filteredGames = games.filter((game) =>
    game.title.toLowerCase().includes(searchText)
  );
  currentPage = 1;
  displayGames();
}

// Function to sort games
function sortGames() {
  const sortOption = document.getElementById("sortSelect").value;

  filteredGames.sort((a, b) => {
    if (sortOption === "title") {
      return a.title.localeCompare(b.title);
    } else if (sortOption === "HighestPrice") {
      return b.price - a.price;
    } else if (sortOption === "LowestPrice") {
      return a.price - b.price;
    } else if (sortOption === "newest") {
      return b.year - a.year; // Sort by newest first
    } else if (sortOption === "oldest") {
      return a.year - b.year; // Sort by oldest first
    }
  });

  displayGames();
}

// Fetch and load games from JSON
fetch("json/games.json")
  .then((response) => response.json())
  .then((data) => {
    games = data;
    filteredGames = [...games];
    displayGames();
  })
  .catch((error) => console.error("Error loading JSON:", error));

// Event Listeners
document.getElementById("searchInput").addEventListener("input", searchGames);
document.getElementById("sortSelect").addEventListener("change", sortGames);

document.getElementById("prevButton").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    displayGames();
  }
});

document.getElementById("nextButton").addEventListener("click", () => {
  if (currentPage < Math.ceil(filteredGames.length / gamesPerPage)) {
    currentPage++;
    displayGames();
  }
});

// catorgories
function filterByCategory() {
  const selectedCategory = document.getElementById("categorySelect").value;

  if (selectedCategory === "all") {
    filteredGames = [...games]; // Show all games 
  } else {
    filteredGames = games.filter((game) => game.category === selectedCategory);
  }

  currentPage = 1;
  displayGames();
}

document.getElementById("categorySelect").addEventListener("change", filterByCategory);
