let dino = document.getElementById('dino');
let obstacle = document.getElementById('obstacle');
let obstacle2 = document.getElementById('obstacle2'); // Second obstacle
let scoreDisplay = document.getElementById('score');
let levelDisplay = document.getElementById('levelDisplay'); // New element for displaying level
let gameContainer = document.getElementById('gameContainer');
let gameOverBox = document.getElementById('gameOverBox');
let finalScore = document.getElementById('finalScore');
let playAgainButton = document.getElementById('playAgainButton');
let mobileMessageBox = document.getElementById('mobileMessageBox');
let startGameButton = document.getElementById('startGameButton');
let codeMessageGameOver = document.getElementById('codeMessageGameOver'); // Updated to match HTML ID
let congratulatoryMessageBox = document.getElementById('congratulatoryMessage');
let codeMessageCongratulatory = document.getElementById('codeMessageCongratulatory'); // Updated to match HTML ID

// Define difficulty levels (10 levels)
const DIFFICULTY_LEVELS = [
    { speed: 5, jumpVelocity: 16, spawnChance: 0.6, obstacleSpacing: 40 },
    { speed: 6, jumpVelocity: 15, spawnChance: 0.65, obstacleSpacing: 60 },
    { speed: 7, jumpVelocity: 14, spawnChance: 0.7, obstacleSpacing: 80 },
    { speed: 8, jumpVelocity: 13, spawnChance: 0.75, obstacleSpacing: 100 },
    { speed: 9, jumpVelocity: 12, spawnChance: 0.8, obstacleSpacing: 120 },
    { speed: 10, jumpVelocity: 11, spawnChance: 0.85, obstacleSpacing: 140 },
    { speed: 11, jumpVelocity: 10, spawnChance: 0.9, obstacleSpacing: 160 },
    { speed: 15, jumpVelocity: 9, spawnChance: 0.95, obstacleSpacing: 155 },
    { speed: 15, jumpVelocity: 8, spawnChance: 1.0, obstacleSpacing: 200 },
    { speed: 16, jumpVelocity: 7, spawnChance: 1.05, obstacleSpacing: 220 }
];

let isJumping = false;
let isFalling = false;
let score = 0;
let obstacleSpeed = DIFFICULTY_LEVELS[0].speed; // Initial speed of the obstacle
let gameOver = false; // Flag to track game state

const GRAVITY = -0.6; // Gravity effect
let JUMP_VELOCITY = DIFFICULTY_LEVELS[0].jumpVelocity; // Initial jump velocity
let obstacleSpacing = DIFFICULTY_LEVELS[0].obstacleSpacing; // Initial obstacle spacing

let dinoBottom = 0; // Dino's bottom position in px
let dinoVelocity = 0; // Dino's vertical velocity

let difficultyIncreaseInterval = 2000; // Time interval for increasing difficulty (ms)
let difficultyTimer = 0; // Timer to track time elapsed for difficulty increase

let currentLevel = 0; // Start at level 0
let levelUpScore = 100; // Score threshold to move to the next level

// Function to detect mobile devices
function isMobile() {
    return /Mobi|Android/i.test(navigator.userAgent);
}

// Function to start the game
function startGame() {
    mobileMessageBox.classList.add('hidden'); // Hide the message box
    gameContainer.classList.remove('hidden'); // Show the game container
    gameLoop(); // Start the game loop
}

// Show message and start button for mobile users
if (isMobile()) {
    gameContainer.classList.add('hidden'); // Hide game container initially
    mobileMessageBox.classList.remove('hidden'); // Show the mobile message box

    startGameButton.addEventListener('click', () => {
        startGame();
    });

    startGameButton.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Prevent default touch behavior
        startGame();
    }, { passive: false }); // Ensure preventDefault works
}

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

// Ensure touch events are handled for mobile
playAgainButton.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Prevent default touch behavior
    resetGame();
    gameOverBox.style.display = 'none'; // Hide game over box
}, { passive: false }); // Ensure preventDefault works

// Resize gameContainer based on window size
function resizeGameContainer() {
    let viewportWidth = window.innerWidth;
    let viewportHeight = window.innerHeight;
    let containerWidth = viewportWidth * 0.9; // 90% of viewport width
    let containerHeight = viewportHeight * 0.6; // 60% of viewport height
    
    gameContainer.style.width = containerWidth + 'px';
    gameContainer.style.height = containerHeight + 'px';
    
    // Adjust cloud sizes based on container size
    let cloudElements = document.querySelectorAll('#cloud, #cloud2');
    cloudElements.forEach(cloud => {
        cloud.style.width = containerWidth * 0.3 + 'px'; // 10% of container width
        cloud.style.height = containerHeight * 0.3 + 'px'; // 10% of container height
    });
}

window.addEventListener('resize', resizeGameContainer);

// Initial resize
resizeGameContainer();

// Function to generate a 7-digit code
function generateCode() {
    return Math.floor(1000000 + Math.random() * 9000000);
}

function updateDifficulty() {
    if (score >= (currentLevel + 1) * levelUpScore && currentLevel < DIFFICULTY_LEVELS.length - 1) {
        currentLevel++;
        obstacleSpeed = DIFFICULTY_LEVELS[currentLevel].speed;
        JUMP_VELOCITY = DIFFICULTY_LEVELS[currentLevel].jumpVelocity;
        difficultyIncreaseInterval = 2000 / (currentLevel + 1); // Increase difficulty more often
        obstacleSpacing = DIFFICULTY_LEVELS[currentLevel].obstacleSpacing; // Update spacing
        levelDisplay.innerText = `დონე: ${currentLevel}`; // Update level display
        console.log(`Level Up! Current Level: ${currentLevel}`);
        
        // Check if player has reached level 10
        if (currentLevel === DIFFICULTY_LEVELS.length - 1) {
            congratulatoryMessageBox.classList.remove('hidden'); // Show the congratulatory message
            codeMessageCongratulatory.innerText = `Your code: ${generateCode()}`; // Display the code in the congratulatory message
            console.log('Congratulations! You won a pack of biscuits!');
        }
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
        obstacle.style.right = -obstacleSpacing + 'px'; // Set new obstacle position
        score += 10; // Fixed score per obstacle hit
        scoreDisplay.innerHTML = `ორცხობილა <img src="img201.png" alt="cookie" style="width:40px; height:30px;      display: inline-block;
        vertical-align: middle;">: ${score}`; // Use image

        // Update difficulty
        updateDifficulty();

        // Randomly decide whether to spawn the second obstacle
        if (Math.random() < DIFFICULTY_LEVELS[currentLevel].spawnChance) {
            obstacle2.classList.remove('hidden');
            obstacle2.style.right = -obstacleSpacing - 30 + 'px'; // Position second obstacle further off-screen
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
        finalScore.innerHTML = `ორცხობილა <img src="img201.png" alt="cookie" style="width:40px; height:30px;       display: inline-block;
        vertical-align: middle;">: ${score}`; // Use image
        codeMessageGameOver.innerText = `Your code: ${generateCode()}`; // Display the code in the game over box
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
    scoreDisplay.innerHTML = `ორცხობილა <img src="img201.png" alt="cookie" style="width:40px; height:30px;      display: inline-block;
    vertical-align: middle;">: 0`; // Use image
    obstacle.style.right = -obstacleSpacing + 'px'; // Reset obstacle position
    obstacle2.classList.add('hidden'); // Hide the second obstacle
    dinoBottom = 0;
    dinoVelocity = 0;
    dino.style.bottom = '0px';

    // Reset to initial level settings
    currentLevel = 0;
    obstacleSpeed = DIFFICULTY_LEVELS[0].speed;
    JUMP_VELOCITY = DIFFICULTY_LEVELS[0].jumpVelocity;
    obstacleSpacing = DIFFICULTY_LEVELS[0].obstacleSpacing;
    levelDisplay.innerText = `დონე: ${currentLevel}`;
    gameOverBox.style.display = 'none'; // Hide game over box
    congratulatoryMessageBox.classList.add('hidden'); // Hide the congratulatory message
}

// Main game loop
function gameLoop() {
    updateGame();
    requestAnimationFrame(gameLoop); // Request the next frame
}

// Start the game loop if not on mobile
if (!isMobile()) {
    gameLoop(); // Start the game loop
}
