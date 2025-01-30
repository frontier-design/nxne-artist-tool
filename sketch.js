let img;
let font;
let maxSize;
let rectCount = 10;
let placedRects = [];
let belowImageIndices = [];
let aspectRatio = 3 / 4;
let textSizeValue = 70; // Default text size for post
let svgSize = 160; // Default SVG size for post
let canvas;
let svgRightImg;
let svgLeftImg;
let imageUploaded = false;
let artistName = "Insert Artist Name Here"; // Default text
let textFillColor = 255; // Default white text
let bgColor = 15; // Default black background
let svgTintColor = 255; // Default white tint for SVGs

function preload() {
  font = loadFont("fonts/Haffer-TRIAL-Medium.ttf");
  img = loadImage("images/uploadAnImage-100.jpg");

  // Load SVGs directly into the canvas
  svgRightImg = loadImage("images/nxneWhite30.svg");
  svgLeftImg = loadImage("images/nxneWhiteText.svg");
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight - 20);
  textFont(font);
  rectMode(CENTER);
  noLoop();

  // Get the textarea element and listen for changes
  let artistInput = document.getElementById("artist-name-input");
  artistInput.value = artistName; // Set initial value

  artistInput.addEventListener("input", () => {
    artistName = artistInput.value; // Update artist name
    draw(); // Re-execute draw() to update text correctly
  });

  const fileInput = document.getElementById("file-upload");
  fileInput.addEventListener("change", handleFile);

  document.getElementById("post-dimensions").addEventListener("click", () => {
    aspectRatio = 3 / 4;
    updateCanvasDimensions();
  });

  document.getElementById("reel-dimensions").addEventListener("click", () => {
    aspectRatio = 9 / 16;
    updateCanvasDimensions();
  });

  document.getElementById("regenerate-button").addEventListener("click", () => {
    if (imageUploaded) {
      regenerateRectangles();
    }
  });

  document.getElementById("post-dimensions").addEventListener("click", () => {
    aspectRatio = 3 / 4;
    textSizeValue = 70; // Text size for post
    textLeading(70);
    svgSize = 160; // SVG size for post
    updateCanvasDimensions();
  });

  document.getElementById("reel-dimensions").addEventListener("click", () => {
    aspectRatio = 9 / 16;
    textSizeValue = 50; // Smaller text size for reels
    textLeading(50);
    svgSize = 160; // Smaller SVG size for reels
    updateCanvasDimensions();
  });

  document
    .getElementById("save-image-button")
    .addEventListener("click", saveCanvasAsImage);

  // Color theme buttons event listeners
  document.getElementById("color-theme-1").addEventListener("click", () => {
    bgColor = 15; // Black
    textFillColor = 255; // White
    svgTintColor = 255; // White
    draw();
  });

  document.getElementById("color-theme-2").addEventListener("click", () => {
    bgColor = 255; // White
    textFillColor = 0; // Black
    svgTintColor = 0; // Black
    draw();
  });

  document.getElementById("color-theme-3").addEventListener("click", () => {
    bgColor = 200; // Gray
    textFillColor = "blue"; // Blue
    svgTintColor = "blue"; // Blue
    draw();
  });

  document.getElementById("color-theme-4").addEventListener("click", () => {
    bgColor = 255; // White
    textFillColor = color(255, 100, 0); // Orange
    svgTintColor = color(255, 100, 0); // Orange
    draw();
  });

  updateCanvasDimensions();
  updateCanvas();
}

function draw() {
  background(bgColor); // Apply the chosen background color

  if (img) {
    maxSize = width * 0.85;
    let scaleFactor = min(maxSize / img.width, maxSize / img.height, 1);
    let newWidth = img.width * scaleFactor;
    let newHeight = img.height * scaleFactor;
    let x = (width - newWidth) / 2;
    let y = (height - newHeight) / 2;

    image(img, x, y, newWidth, newHeight);

    if (imageUploaded) {
      drawRectangles(x, y, newWidth, newHeight, scaleFactor, true);
      drawRectangles(x, y, newWidth, newHeight, scaleFactor, false);
    }

    // Draw artist name dynamically with correct color and size
    fill(textFillColor);
    textSize(textSizeValue);
    textFont(font);
    textAlign(LEFT, TOP);
    text(artistName, 240, 100, 400);

    // Adjust SVG sizes dynamically
    let svgLeftAspect = svgLeftImg.width / svgLeftImg.height;
    let svgRightAspect = svgRightImg.width / svgRightImg.height;

    let svgLeftHeight = svgSize / svgLeftAspect;
    let svgRightHeight = svgSize / svgRightAspect;

    // Apply tint to the SVGs
    tint(svgTintColor);
    image(svgLeftImg, 44, height - svgSize - 40, svgSize, svgLeftHeight);
    image(
      svgRightImg,
      width - (svgSize + 47),
      height - svgSize,
      svgSize,
      svgRightHeight
    );
    noTint(); // Reset tint for other elements
  }
}

function updateText() {
  // Define text area dimensions
  let textX = 200;
  let textY = 20;
  let textWidth = 400;
  let textHeight = 100;

  // Clear only the text area by drawing a rectangle with the background color
  fill(15); // Background color
  noStroke();
  rect(textX, textY, textWidth, textHeight);

  // Now draw the updated text in white
  fill(255);
  textSize(70);
  textFont(font);
  textAlign(LEFT, TOP);
  textLeading(70);
  text(artistName, textX, textY, textWidth);
}

function drawRectangles(x, y, imgWidth, imgHeight, scaleFactor, isBelowImage) {
  for (let i = 0; i < placedRects.length; i++) {
    let r = placedRects[i];

    const shouldDrawBelow = belowImageIndices.includes(i);
    if (shouldDrawBelow !== isBelowImage) continue;

    // Adjust source values to match the scaled image size
    let srcX = map(r.x - r.width / 2 - x, 0, imgWidth, 0, img.width);
    let srcY = map(r.y - r.height / 2 - y, 0, imgHeight, 0, img.height);
    let srcW = map(r.width, 0, imgWidth, 0, img.width);
    let srcH = map(r.height, 0, imgHeight, 0, img.height);

    // Ensure source values are within the correct range
    srcX = constrain(srcX, 0, img.width - srcW);
    srcY = constrain(srcY, 0, img.height - srcH);

    copy(
      img,
      srcX,
      srcY,
      srcW,
      srcH, // Use corrected mapped coordinates
      r.x - r.width / 2,
      r.y - r.height / 2,
      r.width,
      r.height
    );

    noFill();
    stroke(0);
    strokeWeight(0);
    rect(r.x, r.y, r.width, r.height);
  }
}

function regenerateRectangles() {
  if (imageUploaded) {
    placedRects = []; // Clear previous rectangles

    let x = (width - maxSize) / 2;
    let y = (height - maxSize * (img.height / img.width)) / 2;
    let imgWidth = maxSize;
    let imgHeight = maxSize * (img.height / img.width);

    for (let i = 0; i < rectCount; i++) {
      let rectWidth = random(imgWidth * 0.07, imgWidth * 0.4);
      let rectHeight = random(imgHeight * 0.07, imgHeight * 0.3);
      let rectX, rectY;
      let tries = 0;
      const minDistance = 0;
      const centerX = x + imgWidth / 2;
      const centerY = y + imgHeight / 2;
      let isValidPosition = false;

      while (!isValidPosition && tries < 100) {
        rectX = random(x - 50, x + imgWidth + 20);
        rectY = random(y - 60, y + imgHeight + 20);

        const isFarEnoughFromCenter = dist(rectX, rectY, centerX, centerY) >= 0;
        const isFarEnoughFromOtherRects = placedRects.every((rect) => {
          return dist(rectX, rectY, rect.x, rect.y) >= minDistance;
        });

        isValidPosition = isFarEnoughFromCenter && isFarEnoughFromOtherRects;
        tries++;
      }

      if (isValidPosition) {
        let srcX = map(rectX - rectWidth / 2 - x, 0, imgWidth, 0, img.width);
        let srcY = map(rectY - rectHeight / 2 - y, 0, imgHeight, 0, img.height);
        let srcW = map(rectWidth, 0, imgWidth, 0, img.width);
        let srcH = map(rectHeight, 0, imgHeight, 0, img.height);

        placedRects.push({
          x: rectX,
          y: rectY,
          width: rectWidth,
          height: rectHeight,
          srcX: constrain(srcX, 0, img.width - srcW),
          srcY: constrain(srcY, 0, img.height - srcH),
          srcW,
          srcH,
        });
      }
    }

    draw(); // Only re-draw after regenerating rectangles
  }
}

function handleFile(event) {
  const file = event.target.files[0];
  if (file && file.type.startsWith("image")) {
    const reader = new FileReader();
    reader.onload = function (e) {
      img = loadImage(e.target.result, () => {
        imageUploaded = true;
        regenerateRectangles(); // Automatically generate rectangles after upload
        draw(); // Ensure everything is drawn immediately
      });
    };
    reader.readAsDataURL(file);
  } else {
    console.error("File is not an image");
  }
}

function updateCanvas() {
  clear();
  draw();
}

function saveCanvasAsImage() {
  saveCanvas(canvas, "nxne_design", "png");
}

function updateCanvasDimensions() {
  resizeCanvas(windowHeight * aspectRatio, windowHeight - 20);
  updateCanvas();
}

function getBelowImageIndices(total) {
  let numBelow = floor(random(0, 3));
  let indices = [];
  while (indices.length < numBelow) {
    let index = floor(random(0, total));
    if (!indices.includes(index)) indices.push(index);
  }
  return indices;
}
