let img, font;
let maxSize;
let rectCount = 15;
let placedRects = [];
let belowImageIndices = [];
let aspectRatio = 4 / 5;
let textSizeValue = 70;
let canvas;
let svgRightImg;
let imageUploaded = false;
let artistName = "Insert Your Artist Name";
let textFillColor = 255;
let bgColor = 15;
let svgTintColor = 255;

// Audio
let sound,
  amplitude,
  currentLevel = 0;

// UI overlays
let dimensionsDiv;

// Logo & event‐info sizing & margins
let logoSize = 120;
let eventTextSize = 20;
let svgMargin = { x: 50, y: 40 };
let eventMargin = { x: 30, y: 30 };

// Event dropdown data
let venuesList = [
  "Supermarket Bar & Variety",
  "Handlebar",
  "Collective Arts",
  "Cafe Pamenar",
  "Bovine Sex Club",
  "Horseshoe Tavern",
  "Cameron House",
  "Paddock Tavern",
  "Future-Infinity Room",
  "Rivoli",
  "Drake Underground",
  "Theatre Centre",
  "Death & Taxes",
  "The Drake Hotel",
  "Jean Darlene Piano Room",
  "The Painted Lady",
  "The Garrison",
  "The Baby G",
  "Burdock Brewery",
  "Duffy's Tavern",
  "The Pilot",
  "Dance Cave",
  "Lee's Palace",
];
let selectedVenue = "";
const dateList = [
  "Wednesday, June 11 2025",
  "Thursday, June 12 2025",
  "Friday, June 13 2025",
  "Saturday, June 14 2025",
  "Sunday, June 15 2025",
];
let selectedDate = dateList[0];
let selectedTime = "";

function preload() {
  font = loadFont("fonts/53561.otf");
  img = loadImage("images/uploadAnImage-100.jpg");
  svgRightImg = loadImage("images/nxneWhite30.svg");
}

function setup() {
  // Canvas
  canvas = createCanvas(1920, 1080);
  textFont(font);
  rectMode(CENTER);
  noLoop();

  // Initial sizes
  textSizeValue = 70;
  textLeading(70);
  logoSize = 120;
  eventTextSize = 20;
  svgMargin = { x: 50, y: 40 };
  eventMargin = { x: 30, y: 30 };

  // Artist name
  const artistInput = document.getElementById("artist-name-input");
  artistInput.value = artistName;
  artistInput.addEventListener("input", () => {
    artistName = artistInput.value;
    draw();
  });

  // File & audio
  document.getElementById("file-upload").addEventListener("change", handleFile);
  document
    .getElementById("audio-upload")
    .addEventListener("change", handleAudioFile);
  document
    .querySelector(".play-pause-button")
    .addEventListener("click", toggleAudio);

  // Refresh
  document.getElementById("regenerate-button").addEventListener("click", () => {
    if (imageUploaded) regenerateRectangles();
  });

  // Dimension toggles
  document.getElementById("post-dimensions").addEventListener("click", () => {
    aspectRatio = 4 / 5;
    textSizeValue = 70;
    textLeading(70);
    logoSize = 120; // Post: larger logo
    eventTextSize = 20; // Post: larger event text
    svgMargin.x = 50;
    svgMargin.y = 40;
    eventMargin.x = 30;
    eventMargin.y = 30;
    updateCanvasDimensions();
    dimensionsDiv.html("3:4 Post Dimensions");
    draw();
  });
  document.getElementById("reel-dimensions").addEventListener("click", () => {
    aspectRatio = 9 / 16;
    textSizeValue = 50;
    textLeading(50);
    logoSize = 100; // Reel: smaller logo
    eventTextSize = 20; // Reel: smaller event text
    svgMargin.x = 270;
    svgMargin.y = 55 + 15;
    eventMargin.x = 30;
    eventMargin.y = 80 + 20;
    updateCanvasDimensions();
    dimensionsDiv.html("9:16 Reel Dimensions");
    draw();
  });

  // Color themes
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

  // Save
  document
    .getElementById("save-image-button")
    .addEventListener("click", saveCanvasAsImage);

  // Dimension label
  dimensionsDiv = createDiv("3:4 Post Dimensions");
  dimensionsDiv.class("dimensions");
  dimensionsDiv.style("font-size", "0.8rem");
  dimensionsDiv.style("color", "black");
  dimensionsDiv.style("background", "rgb(190,190,190)");
  dimensionsDiv.style("padding", "5px 10px");
  dimensionsDiv.style("border-radius", "120px");
  dimensionsDiv.style("z-index", "-20");
  // initial positioning
  dimensionsDiv.position(
    canvas.position().x,
    canvas.position().y + height + 10
  );

  // Venue dropdown
  const venueSelect = document.getElementById("venue-select");
  venuesList.forEach((v) => {
    let o = document.createElement("option");
    o.value = o.text = v;
    venueSelect.appendChild(o);
  });
  selectedVenue = venueSelect.value;
  venueSelect.addEventListener("change", () => {
    selectedVenue = venueSelect.value;
    draw();
  });

  // Date dropdown
  const dateSelect = document.getElementById("date-select");
  dateList.forEach((d) => {
    let o = document.createElement("option");
    o.value = o.text = d;
    dateSelect.appendChild(o);
  });
  selectedDate = dateSelect.value;
  dateSelect.addEventListener("change", () => {
    selectedDate = dateSelect.value;
    draw();
  });

  // Time dropdown
  const timeSelect = document.getElementById("time-select");
  for (let h = 20; h <= 24; h++) {
    [0, 30].forEach((m) => {
      const hh = h % 24;
      const ampm = hh < 12 ? "am" : "pm";
      const dispH = hh % 12 === 0 ? 12 : hh % 12;
      const dispM = m === 0 ? "00" : m;
      const ts = `${dispH}:${dispM}${ampm}`;
      const opt = document.createElement("option");
      opt.value = opt.text = ts;
      timeSelect.appendChild(opt);
    });
  }
  const oneAm = document.createElement("option");
  oneAm.value = oneAm.text = "1:00am";
  timeSelect.appendChild(oneAm);

  // Set initial selection and listener
  selectedTime = timeSelect.value;
  timeSelect.addEventListener("change", () => {
    selectedTime = timeSelect.value;
    draw();
  });

  updateCanvasDimensions();
}

function draw() {
  background(bgColor);
  currentLevel = amplitude ? amplitude.getLevel() : 0;

  if (img) {
    // scale & breathe
    maxSize = width * 0.85;
    let sf = min(maxSize / img.width, maxSize / img.height, 1);
    let w0 = img.width * sf,
      h0 = img.height * sf;
    let bs = 1 + currentLevel * 0.15;
    let w1 = w0 * bs,
      h1 = h0 * bs;
    let x0 = (width - w1) / 2,
      y0 = (height - h1) / 2;
    image(img, x0, y0, w1, h1);

    if (imageUploaded) {
      drawRectangles(x0, y0, w1, h1, true);
      drawRectangles(x0, y0, w1, h1, false);
    }

    // artist name
    fill(textFillColor);
    textSize(textSizeValue);
    textAlign(LEFT, TOP);
    text(artistName, 240, 100, 400);

    // event info
    drawEventInfo();

    // logo with dynamic margin
    tint(svgTintColor);
    let asp = svgRightImg.width / svgRightImg.height;
    image(
      svgRightImg,
      width - logoSize - svgMargin.x,
      height - logoSize / asp - svgMargin.y,
      logoSize,
      logoSize / asp
    );
    noTint();
  }
}

function drawEventInfo() {
  let lines = [selectedVenue, selectedDate, selectedTime];
  textSize(eventTextSize);
  textFont(font);
  textAlign(LEFT, TOP);

  let maxW = 0;
  lines.forEach((l) => (maxW = max(maxW, textWidth(l))));

  let pad = 10,
    totalH = lines.length * (eventTextSize + 6) - 6,
    bx = eventMargin.x + pad + maxW / 2,
    by = height - eventMargin.y - pad - totalH / 2;

  push();
  rectMode(CENTER);
  noStroke();
  fill(bgColor);
  rect(bx, by + 20, maxW + pad * 2, totalH + pad * 2 + 50);

  fill(textFillColor);
  let y0 = height - eventMargin.y - pad - totalH;
  lines.forEach((l, i) =>
    text(l, eventMargin.x + pad, y0 + i * (eventTextSize + 6))
  );
  pop();
}

function drawRectangles(x, y, imgW, imgH, isBelow) {
  let cx = width / 2,
    cy = height / 2,
    mult = -1.25;
  for (let i = 0; i < placedRects.length; i++) {
    let r = placedRects[i];
    let below = belowImageIndices.includes(i);
    if (below !== isBelow) continue;

    let sx = map(r.x - r.width / 2 - x, 0, imgW, 0, img.width);
    let sy = map(r.y - r.height / 2 - y, 0, imgH, 0, img.height);
    let sw = map(r.width, 0, imgW, 0, img.width);
    let sh = map(r.height, 0, imgH, 0, img.height);
    sx = constrain(sx, 0, img.width - sw);
    sy = constrain(sy, 0, img.height - sh);

    let dx = cx - r.x,
      dy = cy - r.y;
    let targetX = dx * currentLevel * mult;
    let targetY = dy * currentLevel * mult;
    r.offsetX =
      r.offsetX === undefined ? targetX : lerp(r.offsetX, targetX, 0.35);
    r.offsetY =
      r.offsetY === undefined ? targetY : lerp(r.offsetY, targetY, 0.35);

    copy(
      img,
      sx,
      sy,
      sw,
      sh,
      r.x + r.offsetX - r.width / 2,
      r.y + r.offsetY - r.height / 2,
      r.width,
      r.height
    );
  }
}

function regenerateRectangles() {
  if (!imageUploaded) return;
  placedRects = [];
  belowImageIndices = [];

  let imgW = maxSize;
  let imgH = maxSize * (img.height / img.width);
  let startX = (width - imgW) / 2;
  let startY = (height - imgH) / 2;

  for (let i = 0; i < rectCount; i++) {
    let w = random(imgW * 0.07, imgW * 0.4);
    let h = random(imgH * 0.07, imgH * 0.3);
    let px,
      py,
      tries = 0;
    let centerX = startX + imgW / 2,
      centerY = startY + imgH / 2;

    while (tries < 100) {
      px = random(startX - 50, startX + imgW + 20);
      py = random(startY - 60, startY + imgH + 20);
      let ok1 = dist(px, py, centerX, centerY) >= 0;
      let ok2 = placedRects.every((o) => dist(px, py, o.x, o.y) >= 0);
      if (ok1 && ok2) break;
      tries++;
    }
    if (tries === 100) continue;

    let sx = constrain(
      map(px - w / 2 - startX, 0, imgW, 0, img.width),
      0,
      img.width - w
    );
    let sy = constrain(
      map(py - h / 2 - startY, 0, imgH, 0, img.height),
      0,
      img.height - h
    );
    let sw = map(w, 0, imgW, 0, img.width);
    let sh = map(h, 0, imgH, 0, img.height);

    placedRects.push({
      x: px,
      y: py,
      width: w,
      height: h,
      srcX: sx,
      srcY: sy,
      srcW: sw,
      srcH: sh,
    });
  }

  let belowCount = floor(random(0, 3));
  while (belowImageIndices.length < belowCount) {
    let idx = floor(random(placedRects.length));
    if (!belowImageIndices.includes(idx)) belowImageIndices.push(idx);
  }

  draw();
}

function handleFile(e) {
  let file = e.target.files[0];
  if (!file || !file.type.startsWith("image"))
    return console.error("Not an image");
  let reader = new FileReader();
  reader.onload = (evt) => {
    loadImage(evt.target.result, (loaded) => {
      img = loaded;
      imageUploaded = true;
      regenerateRectangles();
      draw();
    });
  };
  reader.readAsDataURL(file);
}

function handleAudioFile(e) {
  let file = e.target.files[0];
  if (!file || !file.type.startsWith("audio"))
    return console.error("Not audio");
  let url = URL.createObjectURL(file);
  if (sound) {
    sound.stop();
    sound.disconnect();
  }
  sound = loadSound(url, () => {
    amplitude = new p5.Amplitude();
    amplitude.setInput(sound);
    sound.play();
    loop();
  });
}

function toggleAudio() {
  if (!sound) return console.error("No sound");
  if (sound.isPlaying()) {
    sound.pause();
    noLoop();
  } else {
    sound.play();
    loop();
  }
}

function saveCanvasAsImage() {
  saveCanvas(canvas, "NXNE_Post", "jpg");
}

function updateCanvasDimensions() {
  let fixedH = 730;
  let newW = fixedH * aspectRatio;
  resizeCanvas(newW, fixedH);
  dimensionsDiv.position(
    canvas.position().x,
    canvas.position().y + height + 10
  );
}

function windowResized() {
  updateCanvasDimensions();
}
