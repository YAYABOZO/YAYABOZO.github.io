let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');

let ball = {
    x: 50,
    y: 500,
    radius: 20,
    color: 'blue',
    speed: 5,
    velocityY: 0,
    isJumping: false
};

let obstacles = [];
let lava = { x: 0, y: 550, width: 800, height: 50 };
let floorHeight = 10; // Height of the floor
let isGameOver = false;

// Fuel settings
let fuel = 100; // Fuel level (0 to 100)
const fuelConsumptionRate = 0.5; // Rate of fuel consumption when moving up
const fuelRegenerationRate = 0.1; // Rate of fuel regeneration
const maxFuel = 100;

// Simple player structure
let currentPlayer = { username: null, isGuest: false };

// Handle user input
let keys = {};

document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

document.getElementById('guestBtn').onclick = () => {
    currentPlayer.isGuest = true;
    startGame();
};

document.getElementById('loginBtn').onclick = () => {
    const username = prompt("Enter username:");
    const password = prompt("Enter password:");
    currentPlayer.username = username;
    startGame();
};

// Game loop
function startGame() {
    if (!isGameOver) {
        requestAnimationFrame(update);
    }
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    moveBall();
    drawBall();
    drawObstacles();
    drawLava();
    drawFloor();
    drawFuelBar();
    checkCollision();
    
    if (!isGameOver) {
        requestAnimationFrame(update);
    }
}

function moveBall() {
    // Apply gravity
    ball.velocityY += 0.2; // Gravity effect
    ball.y += ball.velocityY;

    if (keys['w'] && fuel > 0 && !ball.isJumping) {
        ball.velocityY = -5; // Jumping effect
        fuel -= fuelConsumptionRate; // Consume fuel
        ball.isJumping = true;
    }

    // Check for collision with the floor
    if (ball.y + ball.radius >= canvas.height - floorHeight) {
        ball.y = canvas.height - floorHeight - ball.radius; // Set on floor
        ball.velocityY = 0; // Reset velocity
        ball.isJumping = false; // Reset jumping state
    }

    // Keep the ball within canvas boundaries (left/right)
    if (ball.x < ball.radius) ball.x = ball.radius;
    if (ball.x > canvas.width - ball.radius) ball.x = canvas.width - ball.radius;

    // Regenerate fuel over time
    if (!keys['w'] && fuel < maxFuel) {
        fuel += fuelRegenerationRate;
        if (fuel > maxFuel) fuel = maxFuel;
    }
}

function drawBall() {
    ctx.fillStyle = ball.color;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
}

function drawObstacles() {
    ctx.fillStyle = 'red';
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

function drawLava() {
    ctx.fillStyle = 'orange';
    ctx.fillRect(lava.x, lava.y, lava.width, lava.height);
}

function drawFloor() {
    ctx.fillStyle = 'green';
    ctx.fillRect(0, canvas.height - floorHeight, canvas.width, floorHeight); // Draw floor
}

function drawFuelBar() {
    ctx.fillStyle = 'grey';
    ctx.fillRect(10, 10, 200, 20); // Background bar
    ctx.fillStyle = 'green';
    ctx.fillRect(10, 10, 2 * fuel, 20); // Fuel level
}

function checkCollision() {
    // Check collision with lava
    if (ball.y + ball.radius > lava.y) {
        gameOver();
    }

    // Check collision with obstacles
    for (let obstacle of obstacles) {
        if (ball.x + ball.radius > obstacle.x &&
            ball.x - ball.radius < obstacle.x + obstacle.width &&
            ball.y + ball.radius > obstacle.y &&
            ball.y - ball.radius < obstacle.y + obstacle.height) {
            gameOver();
        }
    }
}

function gameOver() {
    isGameOver = true;
    alert('Game Over! Press "R" to respawn.');
    document.addEventListener('keydown', (e) => {
        if (e.key === 'r') {
            respawn();
        }
    });
}

function respawn() {
    ball.x = 50;
    ball.y = 500; // Reset position
    ball.velocityY = 0; // Reset velocity
    fuel = maxFuel; // Reset fuel
    isGameOver = false;
    startGame();
}

// Sample obstacles
obstacles.push({ x: 300, y: 300, width: 100, height: 20 });
obstacles.push({ x: 500, y: 200, width: 100, height: 20 });

startGame();
