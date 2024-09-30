// Set up canvas
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

// Game variables
let gameRunning = false;
let ball = { x: canvas.width / 2, y: canvas.height - 30, radius: 10, speed: 5, dx: 0, dy: 0 };
let blocks = [];
let blockSpeed = 3;
let spawnRate = 2000;
let lastBlockTime = 0;

// Title screen and Play button
let showTitleScreen = true;

function drawTitleScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '48px Roboto Condensed';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.fillText('Block Escape', canvas.width / 2, canvas.height / 2 - 20);

    // Play button
    ctx.font = '30px Roboto Condensed';
    ctx.fillText('Click to Play', canvas.width / 2, canvas.height / 2 + 40);

    canvas.addEventListener('click', startGame);
}

function startGame() {
    gameRunning = true;
    showTitleScreen = false;
    ball.x = canvas.width / 2;
    ball.y = canvas.height - 30;
    ball.dx = 0;
    ball.dy = 0;
    blocks = [];
    canvas.removeEventListener('click', startGame);
}

function resetGame() {
    gameRunning = false;
    showTitleScreen = true;
    drawTitleScreen();
}

// Ball movement (using WASD)
window.addEventListener('keydown', (e) => {
    if (e.key === 'd') ball.dx = ball.speed;
    if (e.key === 'a') ball.dx = -ball.speed;
    if (e.key === 'w') ball.dy = -ball.speed;
    if (e.key === 's') ball.dy = ball.speed;
});

window.addEventListener('keyup', (e) => {
    if (['d', 'a'].includes(e.key)) ball.dx = 0;
    if (['w', 's'].includes(e.key)) ball.dy = 0;
});

// Block generation
function generateBlock() {
    const blockWidth = 50;
    const blockHeight = 20;
    const x = Math.random() * (canvas.width - blockWidth);
    const y = -blockHeight;
    blocks.push({ x, y, width: blockWidth, height: blockHeight });
}

function updateBlocks() {
    const currentTime = Date.now();
    if (currentTime - lastBlockTime > spawnRate) {
        generateBlock();
        lastBlockTime = currentTime;
    }

    blocks.forEach((block, index) => {
        block.y += blockSpeed;

        // Remove block if it goes off screen
        if (block.y > canvas.height) {
            blocks.splice(index, 1);
        }

        // Check collision with the ball
        if (ball.x + ball.radius > block.x && ball.x - ball.radius < block.x + block.width &&
            ball.y + ball.radius > block.y && ball.y - ball.radius < block.y + block.height) {
            resetGame();
        }
    });
}

// Game loop
function update() {
    if (!gameRunning) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Move the ball
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Boundaries for the ball
    if (ball.x - ball.radius < 0) ball.x = ball.radius;
    if (ball.x + ball.radius > canvas.width) ball.x = canvas.width - ball.radius;
    if (ball.y - ball.radius < 0) ball.y = ball.radius;
    if (ball.y + ball.radius > canvas.height) ball.y = canvas.height - ball.radius;

    // Draw the ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'blue';
    ctx.fill();
    ctx.closePath();

    // Update and draw blocks
    updateBlocks();
    blocks.forEach(block => {
        ctx.fillStyle = 'red';
        ctx.fillRect(block.x, block.y, block.width, block.height);
    });

    requestAnimationFrame(update);
}

// Start the game loop
drawTitleScreen();
update();
