// script.js
let dino = document.getElementById('dino');
let obstacle = document.getElementById('obstacle');
let scoreDisplay = document.getElementById('score');
let gameContainer = document.getElementById('gameContainer');

let isJumping = false;
let score = 0;
let obstacleSpeed = 5; // Speed of the obstacle

// Function to handle jumping
function jump() {
    if (!isJumping) {
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

function updateGame() {
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
        scoreDisplay.innerText = `Score: ${score}`;
    }

    // Collision detection
    if (dinoRect.left < obstacleRect.right &&
        dinoRect.right > obstacleRect.left &&
        dinoRect.bottom > obstacleRect.top) {
        alert('Game Over! Your score: ' + score);
        score = 0;
        scoreDisplay.innerText = 'Score: 0';
        obstacle.style.right = '-50px'; // Reset obstacle position
    }
}

// Handle resizing of the game container
window.addEventListener('resize', () => {
    let containerRect = gameContainer.getBoundingClientRect();
    // Optional: Add logic to adjust game elements if needed
});

// Update the game at regular intervals
setInterval(updateGame, 20);
