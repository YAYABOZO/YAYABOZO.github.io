let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');
let ball = { x: 50, y: 50, radius: 20, color: 'blue', speed: 5 };
let obstacles = [];
let lava = { x: 0, y: 550, width: 800, height: 50 };
let isGameOver = false;

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
    // Simulate login (should verify against a backend in real implementation)
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
    checkCollision();
    
    if (!isGameOver) {
        requestAnimationFrame(update);
    }
}

function moveBall() {
    if (keys['w']) ball.y -= ball.speed; // Move up
    if (keys['s']) ball.y += ball.speed; // Move down
    if (keys['a']) ball.x -= ball.speed; // Move left
    if (keys['d']) ball.x += ball.speed; // Move right

    // Keep the ball within canvas boundaries
    if (ball.x < ball.radius) ball.x = ball.radius;
    if (ball.x > canvas.width - ball.radius) ball.x = canvas.width - ball.radius;
    if (ball.y < ball.radius) ball.y = ball.radius;
    if (ball.y > canvas.height - ball.radius) ball.y = canvas.height - ball.radius;
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
    ball.y = 50;
    isGameOver = false;
    startGame();
}

// Sample obstacles
obstacles.push({ x: 300, y: 300, width: 100, height: 20 });
obstacles.push({ x: 500, y: 200, width: 100, height: 20 });

startGame();
