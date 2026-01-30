const themeToggle = document.getElementById('checkbox');
const body = document.documentElement;

// Function to set the theme
function setTheme(theme) {
    body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
        themeToggle.checked = true;
    } else {
        themeToggle.checked = false;
    }
}

// Check for saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    setTheme(savedTheme);
}

// Event listener for the toggle
themeToggle.addEventListener('change', () => {
    if (themeToggle.checked) {
        setTheme('dark');
    } else {
        setTheme('light');
    }
});


const gamesContainer = document.getElementById('games-container');
const loading = document.getElementById('loading');

const API_URL = 'https://www.balldontlie.io/api/v1/games';

// Get today's date in YYYY-MM-DD format
const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0');
const day = String(today.getDate()).padStart(2, '0');
const todayDate = `${year}-${month}-${day}`;

// URL to get today's games
const url = `${API_URL}?dates[]=${todayDate}`;

fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        loading.style.display = 'none';
        const games = data.data;

        if (games.length === 0) {
            gamesContainer.innerHTML = '<p>No games scheduled for today.</p>';
            return;
        }

        games.forEach(game => {
            const gameElement = document.createElement('div');
            gameElement.classList.add('game');

            const homeTeam = game.home_team.full_name;
            const visitorTeam = game.visitor_team.full_name;
            const homeScore = game.home_team_score;
            const visitorScore = game.visitor_team_score;
            const status = game.status;

            gameElement.innerHTML = `
                <h2>${visitorTeam} at ${homeTeam}</h2>
                <p><strong>Status:</strong> ${status}</p>
                <p><strong>Score:</strong> ${visitorScore} - ${homeScore}</p>
            `;

            gamesContainer.appendChild(gameElement);
        });
    })
    .catch(error => {
        loading.style.display = 'none';
        gamesContainer.innerHTML = `<p>Sorry, there was an error fetching the game data. Please try again later.</p><p>Error: ${error.message}</p>`;
        console.error('There has been a problem with your fetch operation:', error);
    });