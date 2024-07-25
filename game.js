// script.js
let dino = document.getElementById('dino');
let obstacle = document.getElementById('obstacle');
let scoreDisplay = document.getElementById('score');
let gameContainer = document.getElementById('gameContainer');
let gameOverBox = document.getElementById('gameOverBox');
let finalScore = document.getElementById('finalScore');
let playAgainButton = document.getElementById('playAgainButton');

let isJumping = false;
let isFalling = false;
let score = 0;
let obstacleSpeed = 5; // Speed of the obstacle
let gameOver = false; // Flag to track game state

const GRAVITY = -0.4; // Gravity effect
const JUMP_VELOCITY = 10; // Initial jump velocity

let dinoBottom = 0; // Dino's bottom position in px
let dinoVelocity = 0; // Dino's vertical velocity

// Function to handle jumping
function jump() {
    if (!isJumping && !gameOver) {
        isJumping = true;
        dinoVelocity = JUMP_VELOCITY; // Set initial jump velocity
        dino.style.transition = 'none';
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

// Resize gameContainer based on window size
function resizeGameContainer() {
    let viewportWidth = window.innerWidth;
    let viewportHeight = window.innerHeight;
    let containerWidth = viewportWidth * 0.9; // 90% of viewport width
    let containerHeight = viewportHeight * 0.6; // 60% of viewport height
    
    gameContainer.style.width = containerWidth + 'px';
    gameContainer.style.height = containerHeight + 'px';
}

window.addEventListener('resize', resizeGameContainer);

// Initial resize
resizeGameContainer();

function updateGame() {
    if (gameOver) return; // Skip update if game is over

    let containerRect = gameContainer.getBoundingClientRect();
    let dinoRect = dino.getBoundingClientRect();
    let obstacleRect = obstacle.getBoundingClientRect();

    // Update dino's vertical position
    if (isJumping || isFalling) {
        dinoVelocity += GRAVITY; // Apply gravity
        dinoBottom += dinoVelocity; // Update vertical position
        if (dinoBottom <= 0) {
            dinoBottom = 0;
            isJumping = false;
            isFalling = false;
        } else if (dinoBottom > containerRect.height - dinoRect.height) {
            dinoBottom = containerRect.height - dinoRect.height;
            isFalling = false;
        }
        dino.style.bottom = dinoBottom + 'px';
    }

    // Move the obstacle
    let obstacleRight = parseInt(getComputedStyle(obstacle).right);
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
    dinoBottom = 0;
    dinoVelocity = 0;
    dino.style.bottom = '0px';
}

// Update the game at regular intervals
setInterval(updateGame, 20);
