const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let shapes = [];
let timeout;
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

    if (timeout) {
        const lastShape = shapes[shapes.length - 1];
        if (lastShape) {
            ctx.drawImage(waffleImage, lastShape.x - 50, lastShape.y - 50, 100, 100);
        }
    }
}

function animate() {
    requestAnimationFrame(animate);
    drawShapes();
}

function handleInteraction(event) {
    clearTimeout(timeout);
    let x, y;
    if (event.touches) {
        x = event.touches[0].clientX;
        y = event.touches[0].clientY;
    } else {
        x = event.clientX;
        y = event.clientY;
    }
    createShape(x, y);
    timeout = setTimeout(() => {}, 2000);
}

canvas.addEventListener('mousemove', handleInteraction);
canvas.addEventListener('touchstart', handleInteraction);
canvas.addEventListener('touchmove', handleInteraction);

resizeCanvas();
window.addEventListener('resize', () => {
    resizeCanvas();
});

animate();
