const YOUR_MOUSE_ID = "1698";//4701
let BACKGROUND_COLOR = "#000000";
let MAX_SHADOW_BLUR = 50;

let mouse;

let age = 0
const maxAge = 120;
const canvasSize = 240;
const irradiated = "5,255,0,255";
let irradiatedColor;
let isIrradiated = false;
let isGlitched = false;

let img;
let glow;
let lightGlow;
let lightGlowColor;
let shadow;

let hasCrazyEyes = false;

let boids = [];

const tileSize = 10;
const numTiles = 24;

let newImage;
let newBgColor;
let newGlowRadius;
let makeGifCallback;
let isMakingGIF = false;

export const numberSubmitted = (p5, canvasParentRef, props) => {
  const mouseId = props.mouseNum;
  const bgColor = props.bgColor.length > 0 ? props.bgColor : "#000000";
  const glowRadius = props.glowRadius.length > 0 ? props.glowRadius : "50";
  console.log('oook');
  isGlitched = false;
  boids = [];

  p5.loadImage(`https://raw.githubusercontent.com/jozanza/anonymice-images/main/${mouseId}.png`, image => {
    newImage = image;
    newBgColor = bgColor;
    newGlowRadius = glowRadius;
  });
}


export const mouseSetup = (p5, canvasParentRef) => {
  p5.createCanvas(240, 240).parent(canvasParentRef);
  
  p5.loadImage(`https://raw.githubusercontent.com/jozanza/anonymice-images/main/${YOUR_MOUSE_ID}.png`, image => {
    mouse = image;
    makeMouseWithoutGlow(p5);
    hasCrazyEyes = checkIfHasCrazyEyes();
  });
  
  irradiatedColor = p5.color(5, 255, 0, 255);
  lightGlowColor = p5.color(5, 255, 0, 20);
  
  p5.frameRate(60)
}

export const makeGIF = (p5, callback) => {
  makeGifCallback = callback;
}

// TODO: need a way to pull traits into the JS

export const mouseDraw = (p5) => {
  p5.clear();
  p5.noSmooth();

  if (newImage) {
    img.pixels = [];
    glow.pixels = [];
    lightGlow.pixels = [];
    shadow.pixels = [];

    img.updatePixels();
    glow.updatePixels();
    lightGlow.updatePixels();
    shadow.updatePixels();

    isIrradiated = false;

    mouse = newImage;
    makeMouseWithoutGlow(p5);
    hasCrazyEyes = checkIfHasCrazyEyes();

    age = 0;

    newImage = null;
    
  }

  if (newGlowRadius) {
    MAX_SHADOW_BLUR = newGlowRadius;
    newGlowRadius = null;
  }

  if (newBgColor) {
    BACKGROUND_COLOR = newBgColor;
    newBgColor = null;
  }

  if (age == 0 && makeGifCallback && !isMakingGIF) {
    isMakingGIF = true;
    p5.createLoop({duration:2, gif: {render: false, download: true}})
    setTimeout(function() {
      isMakingGIF = false;
      makeGifCallback();
      makeGifCallback = null;
    }, 2000);
  }
  
  if (age == 0) {
    for (let i = 0; i < boids.length; i++) {
      boids[i].isReturning = false;
    }
  }
  
  if (!img) {
    return;
  }
  
  recordAndPixelizeShadow(p5)
  
  p5.clear();
  if (BACKGROUND_COLOR !== "clear") {
    p5.background(BACKGROUND_COLOR);
  }
  
  if (hasCrazyEyes) {
    animateCrazyEyes(p5);
  }
  
  if (isGlitched && age > 40) {
    animateGlitched(p5);
  }
  else {
    drawFinal(p5);
  }
  
  if (age == 80) {
    for (let i = 0; i < boids.length; i++) {
      boids[i].goBack();
    }
  }
  
  age++;
  if (age >= maxAge) {
    age = 0;
  }
}

function animateGlitched(p5) {
  // Run all the boids
  for (let i = 0; i < boids.length; i++) {
    boids[i].run(boids);
  }
}

function animateCrazyEyes(p5) {
  const black = p5.color(0,0,0,255)
  const white = p5.color(255,255,255,255)
  const gray = p5.color(177,173,172,255)
  const almostWhite = p5.color(245,245,245,255)
  
  if (age % 10 != 0) {
    return;
  }
  let eyeFrame = (age - 30) % 40;
  
  // animate eye one
  switch (eyeFrame) {
    case 0:
      img.set(10,12, black);
      img.set(11,12, white);
      img.set(10,13, gray);
      img.set(11,13, gray);
      break;
    case 10:
      img.set(10,12, white);
      img.set(11,12, gray);
      img.set(10,13, black);
      img.set(11,13, gray);
      break;
    case 20:
      img.set(10,12, gray);
      img.set(11,12, gray);
      img.set(10,13, white);
      img.set(11,13, black);
      break;
    case 30:
      img.set(10,12, gray);
      img.set(11,12, black);
      img.set(10,13, gray);
      img.set(11,13, white);
      break;
  }
  
  // animate eye two
  switch (eyeFrame) {
    case 0:
      img.set(15,12, gray);
      img.set(16,12, gray);
      img.set(15,13, almostWhite);
      img.set(16,13, black);
      break;
    case 10:
      img.set(15,12, almostWhite);
      img.set(16,12, gray);
      img.set(15,13, black);
      img.set(16,13, gray);
      break;
    case 20:
      img.set(15,12, black);
      img.set(16,12, almostWhite);
      img.set(15,13, gray);
      img.set(16,13, gray);
      break;
    case 30:
      img.set(15,12, gray);
      img.set(16,12, black);
      img.set(15,13, gray);
      img.set(16,13, almostWhite);
      break;
  }
  
  img.updatePixels();
}

function checkIfHasCrazyEyes() {
  // eye one
  if (img.get(10,12).toString() !== "0,0,0,255") {
    return false;
  }
  if (img.get(11,12).toString() !== "255,255,255,255") {
    return false;
  }
  if (img.get(10,13).toString() !== "177,173,172,255") {
    return false;
  }
  if (img.get(11,13).toString() !== "177,173,172,255") {
    return false;
  }
  
  // eye two
  if (img.get(16,13).toString() !== "0,0,0,255") {
    return false;
  }
  if (img.get(15,13).toString() !== "245,245,245,255") {
    return false;
  }
  if (img.get(15,12).toString() !== "177,173,172,255") {
    return false;
  }
  if (img.get(16,12).toString() !== "177,173,172,255") {
    return false;
  }
  return true;
}

function recordAndPixelizeShadow(p5) {
  var context = p5.drawingContext; // or p5.drawingContext
  context.shadowOffsetX = 0;
  context.shadowOffsetY = 0;
  context.shadowBlur = calculateShadowBlur();
  context.shadowColor = p5.color(5, 255, 0, 180);
  
  drawGlow(p5);
  drawMouseWithoutGlow(p5);
  
  pixelizeShadow(p5);
  
  context.shadowOffsetX = 0;
  context.shadowOffsetY = 0;
  context.shadowBlur = 0;
}

function drawGlitchGlow(p5) {
  if (isIrradiated) {
    if (age >= 40 && age <= 106) {
      drawGlow(p5);
    }
    // LAZY HACK LOL
    else if (age > 106 && age <= 116) {
      for (var i = 0; i < 120 - age; i++) {
        drawLightGlow(p5);
        drawLightGlow(p5);
      }
    }
    else {
      drawLightGlow(p5);
      drawLightGlow(p5);
      drawLightGlow(p5);
      drawLightGlow(p5);
    }
  }
  
  if (age >= 40 && age <= 106 && isIrradiated) {
    drawPixelizedShadow(p5);
  }
}

function drawFinal(p5) {
  if (isIrradiated) {
    if (age >= 40 && age <= 106) {
      drawGlow(p5);
    }
    // LAZY HACK LOL
    else if (age > 106 && age <= 116) {
      for (var i = 0; i < 120 - age; i++) {
        drawLightGlow(p5);
        drawLightGlow(p5);
      }
    }
    else {
      drawLightGlow(p5);
      drawLightGlow(p5);
      drawLightGlow(p5);
      drawLightGlow(p5);
    }
  }
  
  
  drawMouseWithoutGlow(p5);
  
  if (age >= 40 && age <= 106 && isIrradiated) {
    drawPixelizedShadow(p5);
  }
}

// First 40: light glow
// 40-55: Glow with expand
// 55-58: Pause w max glow
// 58-73: Glow with contract
// 73-88: Glow with expand
// 88-91: Pause w max glow
// 91-106: Glow with contract

function calculateShadowBlur() {
  if (age < 40) {
    return 0;
    
  } else if (age < 55) {
    let ratio = (55 - age) / 15;
    return (1 - ratio) * MAX_SHADOW_BLUR;
    
  } else if (age < 58) {
    return MAX_SHADOW_BLUR;
    
  } else if (age < 73) {
    let ratio = (73 - age) / 15;
    return ratio * MAX_SHADOW_BLUR;
    
  }  else if (age < 88) {
    let ratio = (88 - age) / 15;
    return (1-ratio) * MAX_SHADOW_BLUR;
    
  } else if (age < 91) {
    return MAX_SHADOW_BLUR;
    
  } else if (age <= 106) {
    let ratio = (106 - age) / 15;
    return ratio * MAX_SHADOW_BLUR;
  }
  
  return 0;
}

function pixelizeShadow(p5) {
  shadow = p5.createImage(numTiles, numTiles);
  shadow.loadPixels();
  
  for (var y = 0; y < numTiles; y++) {
    for (var x = 0; x < numTiles; x++) {
      if (glow.get(x, y)[3] != 0 || img.get(x,y)[3] != 0) {
        // Skip existing mouse
      } else {
        let c = p5.get(x*tileSize, y*tileSize);
        // Save shadow as pixel TODO: average
        shadow.set(x, y, c);
      }
    }
  }
  
  shadow.updatePixels();
}

function makeMouseWithoutGlow(p5) {
  // Displays the image at its actual size at point (0,0)
  p5.image(mouse, 0, 0);
  
  img = p5.createImage(numTiles, numTiles);
  img.loadPixels();
  
  glow = p5.createImage(numTiles, numTiles);
  glow.loadPixels();
  
  lightGlow = p5.createImage(numTiles, numTiles);
  lightGlow.loadPixels();

  let c = p5.get(23*tileSize, 12*tileSize);
  if (c[3] != 0) {
    isGlitched = true;
  }

  for (var y = 0; y < numTiles; y++) {
    for (var x = 0; x < numTiles; x++) {
      let c = p5.get(x*tileSize, y*tileSize);
      if (irradiated.toString() === c.toString()) {
        isIrradiated = true;
        // Save glow pixel coords on the side
        glow.set(x, y, c);
        lightGlow.set(x, y, lightGlowColor)
      } else {
        // Add pixel to mouse without glow
        img.set(x, y, c);

        if (x == 23 && y == 12 && c[3] != 0) {
          isGlitched = true;
        }
        
        if (c[3] != 0 && isGlitched) {
          boids.push(new Boid(x * tileSize, y * tileSize, c, p5));
        }
      }
    }
  }

  img.updatePixels();
  glow.updatePixels();
  lightGlow.updatePixels();
}

function drawPixelizedShadow(p5) {
  p5.image(shadow, 0, 0, canvasSize, canvasSize);
}

function drawMouseWithoutGlow(p5) {
  p5.image(img, 0, 0, canvasSize, canvasSize);
}

function drawLightGlow(p5) {
  p5.image(lightGlow, 0, 0, canvasSize, canvasSize);
}

function drawGlow(p5) {
  p5.image(glow, 0, 0, canvasSize, canvasSize);
}

function mix(start, end, step, steps) {
  const p5 = this.p5;
  let r = p5.map(step,0,steps,p5.red(start),p5.red(end));
  let g = p5.map(step,0,steps,p5.green(start),p5.green(end));
  let b = p5.map(step,0,steps,p5.blue(start),p5.blue(end));
  return(p5.color(r,g,b));
}






// Boid class
// Methods for Separation, Cohesion, Alignment added
class Boid {
  constructor(x, y, c, p5) {
    this.p5 = p5;

    this.acceleration = p5.createVector(0, 0);
    this.velocity = window.p5.Vector.random2D();
    this.position = p5.createVector(x, y);
    this.r = 3.0;
    this.c = c;
    this.maxspeed = 3;    // Maximum speed
    this.maxforce = 0.02; // Maximum steering force
    this.startPos = p5.createVector(x, y);
    this.isReturning = false;
  }

  run(boids) {
    if (this.isReturning) {
      this.goBack();
    } else {
      this.flock(boids);
    }
    this.update();
    //this.borders();
    this.render();
  }
  
  goBack() {
    const p5 = this.p5;
    this.isReturning = true;
    
    if (this.startPos.equals(this.position) || this.startPos.dist(this.position) < 3) {
      //this.position = this.startPos;
      this.acceleration.mult(0);
      this.velocity.set(0,0);
      this.position.set(this.startPos)
      return;
    }
    
    let desired = window.p5.Vector.sub(this.startPos,this.position);
    desired.normalize();
    
    let steer = window.p5.Vector.sub(desired,this.velocity);
    steer.mult(1);
    this.applyForce(steer);
  }
  
  // Forces go into acceleration
  applyForce(force) {
    this.acceleration.add(force);
  }
  
  // We accumulate a new acceleration each time based on three rules
  flock(boids) {
    if (this.isReturning) {
      return;
    }
    let sep = this.separate(boids); // Separation
    let ali = this.align(boids);    // Alignment
    let coh = this.cohesion(boids); // Cohesion
    // Arbitrarily weight these forces
    sep.mult(2.5);
    ali.mult(1.0);
    coh.mult(1.0);
    // Add the force vectors to acceleration
    this.applyForce(sep);
    this.applyForce(ali);
    this.applyForce(coh);
  }
  
  // Method to update location
  update() {
    
    if (!this.isReturning) {
      // Update velocity
      this.velocity.add(this.acceleration);
      // Limit speed
      this.velocity.limit(this.maxspeed);
      this.position.add(this.velocity);
      // Reset acceleration to 0 each cycle
      this.acceleration.mult(0);
    } else {
      // Update velocity
      this.velocity.add(this.acceleration);
      // Limit speed
      this.position.add(this.velocity);
      // Reset acceleration to 0 each cycle
      this.acceleration.mult(0);
    }
  }
  
  // A method that calculates and applies a steering force towards a target
  // STEER = DESIRED MINUS VELOCITY
  seek(target) {
    const p5 = window.p5;
    let desired = p5.Vector.sub(target, this.position); // A vector pointing from the location to the target
    // Normalize desired and scale to maximum speed
    desired.normalize();
    desired.mult(this.maxspeed);
    // Steering = Desired minus Velocity
    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce); // Limit to maximum steering force
    return steer;
  }
  
  // Draw boid as a circle
  render() {
    const p5 = this.p5;
    p5.fill(p5.color(this.c[0], this.c[1], this.c[2], 255));
    //stroke(200);
    p5.noStroke();
    p5.rect(this.position.x, this.position.y, tileSize, tileSize);
  }
  
  // Wraparound
  borders() {
    //if (this.position.x < -this.r) this.position.x = width + this.r;
    //if (this.position.y < -this.r) this.position.y = height + this.r;
    //if (this.position.x > width + this.r) this.position.x = -this.r;
    //if (this.position.y > height + this.r) this.position.y = -this.r;
  }
  
  // Separation
  // Method checks for nearby boids and steers away
  separate(boids) {
    const p5 = this.p5;

    let desiredseparation = 25.0;
    let steer = p5.createVector(0, 0);
    let count = 0;
    // For every boid in the system, check if it's too close
    for (let i = 0; i < boids.length; i++) {
      let d = window.p5.Vector.dist(this.position,boids[i].position);
      // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
      if ((d > 0) && (d < desiredseparation)) {
        // Calculate vector pointing away from neighbor
        let diff = window.p5.Vector.sub(this.position, boids[i].position);
        diff.normalize();
        diff.div(d); // Weight by distance
        steer.add(diff);
        count++; // Keep track of how many
      }
    }
    // Average -- divide by how many
    if (count > 0) {
      steer.div(count);
    }
  
    // As long as the vector is greater than 0
    if (steer.mag() > 0) {
      // Implement Reynolds: Steering = Desired - Velocity
      steer.normalize();
      steer.mult(this.maxspeed);
      steer.sub(this.velocity);
      steer.limit(this.maxforce);
    }
    return steer;
  }
  
  // Alignment
  // For every nearby boid in the system, calculate the average velocity
  align(boids) {
    const p5 = this.p5;

    let neighbordist = 50;
    let sum = p5.createVector(0, 0);
    let count = 0;
    for (let i = 0; i < boids.length; i++) {
      let d = window.p5.Vector.dist(this.position,boids[i].position);
      if ((d > 0) && (d < neighbordist)) {
        sum.add(boids[i].velocity);
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      sum.normalize();
      sum.mult(this.maxspeed);
      let steer = window.p5.Vector.sub(sum, this.velocity);
      steer.limit(this.maxforce);
      return steer;
    } else {
      return p5.createVector(0, 0);
    }
  }
  
  // Cohesion
  // For the average location (i.e. center) of all nearby boids, calculate steering vector towards that location
  cohesion(boids) {
    const p5 = this.p5;

    let neighbordist = 50;
    let sum = p5.createVector(0, 0); // Start with empty vector to accumulate all locations
    let count = 0;
    for (let i = 0; i < boids.length; i++) {
      let d = window.p5.Vector.dist(this.position,boids[i].position);
      if ((d > 0) && (d < neighbordist)) {
        sum.add(boids[i].position); // Add location
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      return this.seek(sum); // Steer towards the location
    } else {
      return p5.createVector(0, 0);
    }
  }  
}


