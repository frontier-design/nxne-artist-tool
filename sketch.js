let img;
let font;
let maxSize;
let rectCount = 15;
let placedRects = [];
let belowImageIndices = [];
let aspectRatio = 4 / 5;
let textSizeValue = 70;
let svgSize = 160;
let canvas;
let svgRightImg;
let svgLeftImg;
let imageUploaded = false;
let artistName = "Insert Your Artist Name";
let textFillColor = 255;
let bgColor = 15;
let svgTintColor = 255;

// Variables for sound
let sound;
let amplitude;
let currentLevel = 0;

let dimensionsDiv;

function preload() {
  font = loadFont("fonts/53561.otf");
  img = loadImage("images/uploadAnImage-100.jpg");

  svgRightImg = loadImage("images/nxneWhite30.svg");
  svgLeftImg = loadImage("images/tt-outlined.svg");
}

function setup() {
  // Create canvas at fixed width (750) and initial height (750)
  canvas = createCanvas(750, 750);
  textFont(font);
  rectMode(CENTER);
  noLoop();

  textSizeValue = 70;
  textLeading(70);

  let artistInput = document.getElementById("artist-name-input");
  artistInput.value = artistName;
  artistInput.addEventListener("input", () => {
    artistName = artistInput.value;
    draw();
  });

  const fileInput = document.getElementById("file-upload");
  fileInput.addEventListener("change", handleFile);

  document
    .getElementById("audio-upload")
    .addEventListener("change", handleAudioFile);
  document
    .querySelector(".play-pause-button")
    .addEventListener("click", toggleAudio);

  // When Post or Reel buttons are clicked, update the aspect ratio and canvas dimensions.
  document.getElementById("post-dimensions").addEventListener("click", () => {
    aspectRatio = 4 / 5;
    textSizeValue = 70;
    textLeading(70);
    svgSize = 160;
    updateCanvasDimensions();
    dimensionsDiv.html("3:4 Post Dimensions");
  });
  document.getElementById("reel-dimensions").addEventListener("click", () => {
    aspectRatio = 9 / 16;
    textSizeValue = 50;
    textLeading(50);
    svgSize = 160;
    updateCanvasDimensions();
    dimensionsDiv.html("9:16 Reel Dimensions");
  });

  document.getElementById("regenerate-button").addEventListener("click", () => {
    if (imageUploaded) {
      regenerateRectangles();
    }
  });

  document.getElementById("color-theme-1").addEventListener("click", () => {
    bgColor = 15;
    textFillColor = 255;
    svgTintColor = 255;
    draw();
  });
  document.getElementById("color-theme-2").addEventListener("click", () => {
    bgColor = 255;
    textFillColor = color(0, 89, 255);
    svgTintColor = color(0, 89, 255);
    draw();
  });
  document.getElementById("color-theme-3").addEventListener("click", () => {
    bgColor = 15;
    textFillColor = color(137, 255, 210);
    svgTintColor = color(137, 255, 210);
    draw();
  });
  document.getElementById("color-theme-4").addEventListener("click", () => {
    bgColor = 255;
    textFillColor = color(255, 94, 0);
    svgTintColor = color(255, 94, 0);
    draw();
  });
  document.getElementById("color-theme-5").addEventListener("click", () => {
    bgColor = 15;
    textFillColor = color(0, 237, 95);
    svgTintColor = color(0, 237, 95);
    draw();
  });
  document.getElementById("color-theme-6").addEventListener("click", () => {
    bgColor = 255;
    textFillColor = color(253, 0, 118);
    svgTintColor = color(253, 0, 118);
    draw();
  });

  document
    .getElementById("save-image-button")
    .addEventListener("click", saveCanvasAsImage);

  // Create a div to display the current dimension mode (non-clickable text)
  dimensionsDiv = createDiv("3:4 Post Dimensions");
  dimensionsDiv.class("dimensions-div");
  dimensionsDiv.style("font-size", "0.8rem");
  dimensionsDiv.style("color", "black");
  dimensionsDiv.style("background", "rgb(190,190,190)");
  dimensionsDiv.style("padding", "5px 10px");
  dimensionsDiv.style("border-radius", "120px");
  dimensionsDiv.style("z-index", "-20");
  // Position the div relative to the canvas (10px from the left, below the canvas)
  dimensionsDiv.position(10, canvas.position().y + height + 10);

  updateCanvasDimensions();
  updateCanvas();
}

function draw() {
  background(bgColor);

  currentLevel = amplitude ? amplitude.getLevel() : 0;

  if (img) {
    maxSize = width * 0.85;
    let scaleFactor = min(maxSize / img.width, maxSize / img.height, 1);
    let newWidth = img.width * scaleFactor;
    let newHeight = img.height * scaleFactor;

    let mainReactScale = 1 + currentLevel * 0.15;
    let newWidthReact = newWidth * mainReactScale;
    let newHeightReact = newHeight * mainReactScale;
    let xReactive = (width - newWidthReact) / 2;
    let yReactive = (height - newHeightReact) / 2;

    image(img, xReactive, yReactive, newWidthReact, newHeightReact);

    if (imageUploaded) {
      drawRectangles(xReactive, yReactive, newWidthReact, newHeightReact, true);
      drawRectangles(
        xReactive,
        yReactive,
        newWidthReact,
        newHeightReact,
        false
      );
    }

    fill(textFillColor);
    textSize(textSizeValue);
    textFont(font);
    textAlign(LEFT, TOP);
    text(artistName, 240, 100, 400);

    let svgLeftAspect = svgLeftImg.width / svgLeftImg.height;
    let svgRightAspect = svgRightImg.width / svgRightImg.height;

    let svgLeftHeight = svgSize / svgLeftAspect;
    let svgRightHeight = svgSize / svgRightAspect;

    // Draw background for svgLeftImg (using push/pop so it doesn't affect other drawing)
    push();
    rectMode(CORNER);
    noStroke();
    fill(bgColor);
    rect(44 - 12, height - 160, svgSize + 20, svgLeftHeight + 20);
    pop();

    // Draw the svg images
    tint(svgTintColor);
    image(svgLeftImg, 44, height - 150, svgSize, svgLeftHeight);
    image(
      svgRightImg,
      width - (svgSize + 47),
      height - 90,
      svgSize,
      svgRightHeight
    );
    noTint();
  }
}

function updateText() {
  let textX = 200;
  let textY = 20;
  let textWidth = 400;
  let textHeight = 100;

  fill(15);
  noStroke();
  rect(textX, textY, textWidth, textHeight);

  fill(255);
  textSize(70);
  textFont(font);
  textAlign(LEFT, TOP);
  textLeading(70);
  text(artistName, textX, textY, textWidth);
}

function drawRectangles(x, y, imgWidth, imgHeight, isBelowImage) {
  let centerXCanvas = width / 2;
  let centerYCanvas = height / 2;
  let multiplier = -1.25;

  for (let i = 0; i < placedRects.length; i++) {
    let r = placedRects[i];
    const shouldDrawBelow = belowImageIndices.includes(i);
    if (shouldDrawBelow !== isBelowImage) continue;

    let srcX = map(r.x - r.width / 2 - x, 0, imgWidth, 0, img.width);
    let srcY = map(r.y - r.height / 2 - y, 0, imgHeight, 0, img.height);
    let srcW = map(r.width, 0, imgWidth, 0, img.width);
    let srcH = map(r.height, 0, imgHeight, 0, img.height);

    srcX = constrain(srcX, 0, img.width - srcW);
    srcY = constrain(srcY, 0, img.height - srcH);

    let dx = centerXCanvas - r.x;
    let dy = centerYCanvas - r.y;
    let desiredOffsetX = dx * currentLevel * multiplier;
    let desiredOffsetY = dy * currentLevel * multiplier;

    if (r.offsetX === undefined) {
      r.offsetX = desiredOffsetX;
    } else {
      r.offsetX = lerp(r.offsetX, desiredOffsetX, 0.35);
    }
    if (r.offsetY === undefined) {
      r.offsetY = desiredOffsetY;
    } else {
      r.offsetY = lerp(r.offsetY, desiredOffsetY, 0.35);
    }

    copy(
      img,
      srcX,
      srcY,
      srcW,
      srcH,
      r.x + r.offsetX - r.width / 2,
      r.y + r.offsetY - r.height / 2,
      r.width,
      r.height
    );
  }
}

function regenerateRectangles() {
  if (imageUploaded) {
    placedRects = [];

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

    draw();
  }
}

function handleFile(event) {
  const file = event.target.files[0];
  if (file && file.type.startsWith("image")) {
    const reader = new FileReader();
    reader.onload = function (e) {
      img = loadImage(e.target.result, () => {
        imageUploaded = true;
        regenerateRectangles();
        draw();
      });
    };
    reader.readAsDataURL(file);
  } else {
    console.error("File is not an image");
  }
}

function handleAudioFile(event) {
  const file = event.target.files[0];
  if (file && file.type.startsWith("audio")) {
    const fileURL = URL.createObjectURL(file);

    if (sound) {
      sound.stop();
      sound.disconnect();
    }

    sound = loadSound(
      fileURL,
      () => {
        amplitude = new p5.Amplitude();
        amplitude.setInput(sound);

        sound.play();
        loop();
      },
      () => {
        console.error("Failed to load sound");
      }
    );
  } else {
    console.error("File is not an audio file");
  }
}

function toggleAudio() {
  if (sound) {
    if (sound.isPlaying()) {
      sound.pause();
      noLoop();
    } else {
      sound.play();
      loop();
    }
  } else {
    console.error("No sound loaded.");
  }
}

function updateCanvas() {
  clear();
  draw();
}

function saveCanvasAsImage() {
  saveCanvas(canvas, "NXNE_Post", "jpg");
}

function windowResized() {
  updateCanvasDimensions();
}

function updateCanvasDimensions() {
  let fixedHeight = 730;
  let newWidth = fixedHeight * aspectRatio;
  resizeCanvas(newWidth, fixedHeight);
  updateCanvas();
  dimensionsDiv.position(
    canvas.position().x,
    canvas.position().y + height + 10
  );
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
