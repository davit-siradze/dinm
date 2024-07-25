// script.js
let dino = document.getElementById('dino');
let obstacle = document.getElementById('obstacle');
let scoreDisplay = document.getElementById('score');
let gameContainer = document.getElementById('gameContainer');
let gameOverBox = document.getElementById('gameOverBox');
let finalScore = document.getElementById('finalScore');
let playAgainButton = document.getElementById('playAgainButton');

let isJumping = false;
let score = 0;
let obstacleSpeed = 5; // Speed of the obstacle
let gameOver = false; // Flag to track game state

// Function to handle jumping
function jump() {
    if (!isJumping && !gameOver) {
        isJumping = true;
        dino.style.transition = 'none';
        dino.style.bottom = '150px'; // Jump height
        setTimeout(() => {
            dino.style.transition = 'bottom 0.5s ease-out';
            dino.style.bottom = '0px'; // Return to original position
            isJumping = false;
        }, 500);
    }
}

// Listen for keyboard events for desktop
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        jump();
    }
});

// Listen for touch events for mobile
document.addEventListener('touchstart', (e) => {
    jump();
});

// Play again button event listener
playAgainButton.addEventListener('click', () => {
    resetGame();
    gameOverBox.classList.add('hidden');
});

function updateGame() {
    if (gameOver) return; // Skip update if game is over

    let containerRect = gameContainer.getBoundingClientRect();
    let dinoRect = dino.getBoundingClientRect();
    let obstacleRect = obstacle.getBoundingClientRect();

    // Get the current obstacle position relative to the game container
    let obstacleRight = parseInt(getComputedStyle(obstacle).right);
    
    // Move the obstacle
    obstacle.style.right = (obstacleRight + obstacleSpeed) + 'px';
    if (parseInt(getComputedStyle(obstacle).right) > containerRect.width) {
        obstacle.style.right = '-50px'; // Reset obstacle position
        score++;
        scoreDisplay.innerText = `Cookies 🍪: ${score}`;
    }

    // Collision detection
    if (dinoRect.left < obstacleRect.right &&
        dinoRect.right > obstacleRect.left &&
        dinoRect.bottom > obstacleRect.top) {
        gameOver = true;
        finalScore.innerText = score;
        gameOverBox.classList.remove('hidden'); // Show game over box
    }
}

// Function to reset the game
function resetGame() {
    gameOver = false;
    score = 0;
    scoreDisplay.innerText = 'Cookies 🍪: 0';
    obstacle.style.right = '-50px'; // Reset obstacle position
}

// Handle resizing of the game container
window.addEventListener('resize', () => {
    let containerRect = gameContainer.getBoundingClientRect();
    // Optional: Add logic to adjust game elements if needed
});

// Update the game at regular intervals
setInterval(updateGame, 20);
