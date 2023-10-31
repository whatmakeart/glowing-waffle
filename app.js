const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let shapes = [];
const waffles = [];
const waffleImage = new Image();
waffleImage.src = 'glowing-waffle.png';

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function createShape(x, y) {
    const points = [];
    const numPoints = Math.floor(Math.random() * (75 - 6 + 1)) + 6;
    const angleStep = Math.PI * 2 / numPoints;

    for (let i = 0; i < numPoints; i++) {
        points.push({
            angle: i * angleStep,
            distance: 20,
            color: `hsl(${Math.random() * 360}, 100%, 50%)`
        });
    }

    shapes.push({ x, y, points });
}

function drawShapes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    waffles.forEach(waffle => {
        ctx.drawImage(waffleImage, waffle.x - 50, waffle.y - 50, 100, 100);
    });

    shapes.forEach(shape => {
        shape.points.forEach(point => {
            ctx.beginPath();
            const x = shape.x + Math.cos(point.angle) * point.distance;
            const y = shape.y + Math.sin(point.angle) * point.distance;
            ctx.arc(x, y, point.distance * 0.1, 0, Math.PI * 2);
            ctx.fillStyle = point.color;
            ctx.fill();
            ctx.closePath();

            point.distance += 1;
        });

        shape.points = shape.points.filter(point => {
            return point.distance < Math.sqrt(canvas.width**2 + canvas.height**2);
        });

        if (!shape.points.length) {
            shapes.shift();
        }
    });
}

function animate() {
    requestAnimationFrame(animate);
    drawShapes();
}

canvas.addEventListener('click', (event) => {
    waffles.forEach((waffle, index) => {
        const dx = event.clientX - waffle.x;
        const dy = event.clientY - waffle.y;
        if (Math.sqrt(dx * dx + dy * dy) <= 50) {
            createShape(waffle.x, waffle.y);
            waffles.splice(index, 1);
        }
    });
});

function spawnWaffle() {
    waffles.push({
        x: 50 + Math.random() * (window.innerWidth - 100),
        y: 50 + Math.random() * (window.innerHeight - 100)
    });
    setTimeout(spawnWaffle, Math.random() * 2500 + 500);
}

resizeCanvas();
window.addEventListener('resize', () => {
    resizeCanvas();
});

animate();
spawnWaffle(); // Initial waffle spawn
