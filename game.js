// JavaScript code for the Dino Game

let dino = document.getElementById('dino');
let obstacle = document.getElementById('obstacle');
let obstacle2 = document.getElementById('obstacle2'); // Second obstacle
let scoreDisplay = document.getElementById('score');
let gameContainer = document.getElementById('gameContainer');
let gameOverBox = document.getElementById('gameOverBox');
let finalScore = document.getElementById('finalScore');
let playAgainButton = document.getElementById('playAgainButton');

let isJumping = false;
let isFalling = false;
let score = 0;
let obstacleSpeed = 5; // Initial speed of the obstacle
let gameOver = false; // Flag to track game state

const GRAVITY = -0.6; // Gravity effect
let JUMP_VELOCITY = 16; // Initial jump velocity

let dinoBottom = 0; // Dino's bottom position in px
let dinoVelocity = 0; // Dino's vertical velocity

let difficultyIncreaseInterval = 2000; // Time interval for increasing difficulty (ms)
let difficultyTimer = 0; // Timer to track time elapsed for difficulty increase

// Define difficulty levels
const DIFFICULTY_LEVELS = [
    { speed: 5, jumpVelocity: 16, spawnChance: 0.6 },
    { speed: 7, jumpVelocity: 14, spawnChance: 0.7 },
    { speed: 10, jumpVelocity: 12, spawnChance: 0.8 },
    { speed: 13, jumpVelocity: 10, spawnChance: 0.9 }
];

let currentLevel = 0; // Start at level 0
let levelUpScore = 10; // Score threshold to move to the next level

// Function to handle jumping
function jump() {
    if (!isJumping && !gameOver) {
        isJumping = true;
        dinoVelocity = JUMP_VELOCITY; // Set initial jump velocity
        dino.style.transition = 'none'; // Ensure no transition interference
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
    e.preventDefault(); // Prevent default touch behavior
    jump();
}, { passive: false }); // Ensure preventDefault works

// Optional: Listen for touchend to ensure jump response
document.addEventListener('touchend', (e) => {
    e.preventDefault(); // Prevent default touch behavior
    jump();
}, { passive: false }); // Ensure preventDefault works

// Play again button event listener
playAgainButton.addEventListener('click', () => {
    resetGame();
    gameOverBox.style.display = 'none'; // Hide game over box
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

function updateDifficulty() {
    if (score >= (currentLevel + 1) * levelUpScore && currentLevel < DIFFICULTY_LEVELS.length - 1) {
        currentLevel++;
        obstacleSpeed = DIFFICULTY_LEVELS[currentLevel].speed;
        JUMP_VELOCITY = DIFFICULTY_LEVELS[currentLevel].jumpVelocity;
        difficultyIncreaseInterval = 2000 / (currentLevel + 1); // Increase difficulty more often
        console.log(`Level Up! Current Level: ${currentLevel}`);
    }
}

function updateGame() {
    if (gameOver) return; // Skip update if game is over

    let containerRect = gameContainer.getBoundingClientRect();
    let dinoRect = dino.getBoundingClientRect();
    let obstacleRect = obstacle.getBoundingClientRect();
    let obstacle2Rect = obstacle2.getBoundingClientRect(); // Second obstacle rect

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

        // Update difficulty
        updateDifficulty();

        // Randomly decide whether to spawn the second obstacle
        if (Math.random() < DIFFICULTY_LEVELS[currentLevel].spawnChance) {
            obstacle2.classList.remove('hidden');
            obstacle2.style.right = '-80px'; // Position second obstacle off-screen
        } else {
            obstacle2.classList.add('hidden');
        }
    }

    // Move the second obstacle
    if (!obstacle2.classList.contains('hidden')) {
        let obstacle2Right = parseInt(getComputedStyle(obstacle2).right);
        obstacle2.style.right = (obstacle2Right + obstacleSpeed) + 'px';
        if (parseInt(getComputedStyle(obstacle2).right) > containerRect.width) {
            obstacle2.classList.add('hidden'); // Hide second obstacle once it passes the container
        }
    }

    // Collision detection
    if ((dinoRect.left < obstacleRect.right &&
        dinoRect.right > obstacleRect.left &&
        dinoRect.bottom > obstacleRect.top) ||
        (!obstacle2.classList.contains('hidden') &&
         dinoRect.left < obstacle2Rect.right &&
         dinoRect.right > obstacle2Rect.left &&
         dinoRect.bottom > obstacle2Rect.top)) {
        gameOver = true;
        finalScore.innerText = `Cookies 🍪: ${score}`;
        gameOverBox.style.display = 'block'; // Show game over box
    }

    // Increase difficulty over time (if needed for levels)
    difficultyTimer += 20; // Increment the timer by the update interval (20 ms)
    if (difficultyTimer >= difficultyIncreaseInterval) {
        difficultyTimer = 0; // Reset the timer
    }
}

// Function to reset the game
function resetGame() {
    gameOver = false;
    score = 0;
    scoreDisplay.innerText = 'Cookies 🍪: 0';
    obstacle.style.right = '-50px'; // Reset obstacle position
    obstacle2.classList.add('hidden'); // Hide the second obstacle
    dinoBottom = 0;
    dinoVelocity = 0;
    dino.style.bottom = '0px';
    obstacleSpeed = DIFFICULTY_LEVELS[currentLevel].speed; // Reset obstacle speed
    JUMP_VELOCITY = DIFFICULTY_LEVELS[currentLevel].jumpVelocity; // Reset jump velocity
    difficultyTimer = 0; // Reset difficulty timer
}

// Update the game at regular intervals
setInterval(updateGame, 20);
