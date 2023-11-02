/** @format */

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let shapes = [];
const waffles = [];
let waffleCounter = 0; // Counter for clicked waffles
const waffleImage = new Image();
waffleImage.src = "glowing-waffle.png";
const happySound = new Audio("happy-sound.mp3");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createShape(x, y) {
  const points = [];
  const numPoints = Math.floor(Math.random() * (75 - 6 + 1)) + 6;
  const angleStep = (Math.PI * 2) / numPoints;

  for (let i = 0; i < numPoints; i++) {
    points.push({
      angle: i * angleStep,
      distance: 20,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`,
    });
  }

  shapes.push({ x, y, points });
}

function drawShapes() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Assuming you know the original aspect ratio of the waffle image
  const originalAspectRatio = waffleImage.width / waffleImage.height;

  // Initialize each waffle's size
  waffles.forEach((waffle) => {
    if (waffle.size === undefined) {
      // Assign a random size multiplier, for example between 0.5 and 1.5
      const sizeMultiplier = Math.random() * (0.5 - 0.2) + 0.5;
      // Calculate the new width and height while maintaining the aspect ratio
      waffle.size = {};
      waffle.size.width = waffleImage.width * sizeMultiplier;
      waffle.size.height = waffle.size.width / originalAspectRatio;
    }
  });

  // Draw each waffle with its predetermined size
  waffles.forEach((waffle) => {
    // Adjust the x and y position to keep the waffle centered
    const adjustedX = waffle.x - waffle.size.width / 2;
    const adjustedY = waffle.y - waffle.size.height / 2;

    // Draw the waffle image with its predetermined size at the adjusted position
    ctx.drawImage(
      waffleImage,
      adjustedX,
      adjustedY,
      waffle.size.width,
      waffle.size.height
    );
  });

  // Draw the shapes (colored dots)
  shapes.forEach((shape) => {
    shape.points.forEach((point) => {
      ctx.beginPath();
      const x = shape.x + Math.cos(point.angle) * point.distance;
      const y = shape.y + Math.sin(point.angle) * point.distance;
      ctx.arc(x, y, point.distance * 0.1, 0, Math.PI * 2);
      ctx.fillStyle = point.color;
      ctx.fill();
      ctx.closePath();

      point.distance += 1;
    });

    shape.points = shape.points.filter((point) => {
      return point.distance < Math.sqrt(canvas.width ** 2 + canvas.height ** 2);
    });

    if (!shape.points.length) {
      shapes.shift();
    }
  });

  // Retro video game score keeper
  const titleText = "Glowing Waffles";
  const scoreText = `Waffles Clicked: ${waffleCounter}`;

  ctx.font = '30px "Press Start 2P"'; // Ensure this font is loaded
  ctx.fillStyle = "green";

  const textPadding = 10;
  const titleTextMetrics = ctx.measureText(titleText);
  const scoreTextMetrics = ctx.measureText(scoreText);

  // Check if the canvas is narrow (e.g., mobile device width)
  const isNarrowCanvas = canvas.width < 956; // You can adjust this threshold as needed
  if (isNarrowCanvas) {
    // Stack the title and score texts on top of each other
    ctx.fillRect(
      0,
      0,
      canvas.width,
      titleTextMetrics.actualBoundingBoxAscent +
        scoreTextMetrics.actualBoundingBoxAscent +
        10 * textPadding
    ); // Background rectangle for the score

    // Title Text
    ctx.fillStyle = "white";
    ctx.textBaseline = "top";
    ctx.textAlign = "center";
    ctx.fillText(titleText, canvas.width / 2, textPadding);

    // Score Text
    ctx.fillText(
      scoreText,
      canvas.width / 2,
      titleTextMetrics.actualBoundingBoxAscent + 6 * textPadding
    );
  } else {
    // Draw the texts side by side
    ctx.fillRect(0, 0, canvas.width, 60); // Background rectangle for the score

    // Score Text
    ctx.fillStyle = "white";
    ctx.textBaseline = "top";
    ctx.textAlign = "right";
    ctx.fillText(scoreText, canvas.width - textPadding, 20);

    // Title Text
    ctx.textAlign = "left";
    ctx.fillText(titleText, textPadding, 20);
  }
}

function animate() {
  requestAnimationFrame(animate);
  drawShapes();
}

canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width; // relationship bitmap vs. element for X
  const scaleY = canvas.height / rect.height; // relationship bitmap vs. element for Y

  const canvasLeft = (event.clientX - rect.left) * scaleX; // scale mouse coordinates after they have
  const canvasTop = (event.clientY - rect.top) * scaleY; // been adjusted to be relative to element

  waffles.forEach((waffle, index) => {
    // Adjusted X and Y considering the waffle's size
    const adjustedX = waffle.x - waffle.size.width / 2;
    const adjustedY = waffle.y - waffle.size.height / 2;

    // Check if the click is within the waffle image
    if (
      canvasLeft >= adjustedX &&
      canvasLeft <= adjustedX + waffle.size.width &&
      canvasTop >= adjustedY &&
      canvasTop <= adjustedY + waffle.size.height
    ) {
      createShape(waffle.x, waffle.y);
      waffles.splice(index, 1);
      waffleCounter++; // Increment the counter when a waffle is clicked

      // Play the happy sound
      happySound.currentTime = 0; // Rewind to the start if already playing
      happySound.play();
    }
  });
});

function spawnWaffle() {
  waffles.push({
    x: 50 + Math.random() * (window.innerWidth - 100),
    y: 50 + Math.random() * (window.innerHeight - 100),
  });
  setTimeout(spawnWaffle, Math.random() * 2500 + 500);
}

resizeCanvas();
window.addEventListener("resize", () => {
  resizeCanvas();
});

animate();
spawnWaffle(); // Initial waffle spawn
