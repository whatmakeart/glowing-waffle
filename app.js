const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let circles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function createCircle(x, y) {
    const numCircles = 10;
    for (let i = 0; i < numCircles; i++) {
        circles.push({
            x: x,
            y: y,
            radius: i * 20,
            lineWidth: (i * 20) * 0.05,
            color: `hsl(${Math.random() * 360}, 100%, 50%)`
        });
    }
}

function drawCircles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    circles.forEach(circle => {
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        ctx.strokeStyle = circle.color;
        ctx.lineWidth = circle.lineWidth;
        ctx.stroke();
        ctx.closePath();
        
        circle.radius += 1;
        circle.lineWidth = circle.radius * 0.05;

        if (circle.radius > Math.sqrt(canvas.width**2 + canvas.height**2)) {
            const index = circles.indexOf(circle);
            circles.splice(index, 1);
        }
    });
}

function animate() {
    requestAnimationFrame(animate);
    drawCircles();
}

canvas.addEventListener('mousemove', (event) => {
    createCircle(event.clientX, event.clientY);
});

resizeCanvas();
window.addEventListener('resize', () => {
    resizeCanvas();
});

animate();
