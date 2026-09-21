let pointerLocked = false;
let lookDeltaX = 0;
let lookDeltaY = 0;
const lookSensitivity = 0.025; // equivalent to the old "/100" divisor

function firstPerson(cam){
  cam.firstPersonState = cam.firstPersonState || {
    azimuth: -atan2(cam.eyeZ - cam.centerZ, cam.eyeX - cam.centerX),
    zenith: -atan2(cam.eyeY - cam.centerY, dist(cam.eyeX, cam.eyeZ, cam.centerX, cam.centerZ)),
    lookAtDist: dist(cam.eyeX, cam.eyeY, cam.eyeZ, cam.centerX, cam.centerY, cam.centerZ)
  }
  
  // Look around controls (Pointer Lock API)
  // lookDeltaX/lookDeltaY are accumulated from raw 'mousemove' movementX/movementY
  // events while the pointer is locked (see setup() / onMouseMove below), then
  // consumed and reset here each frame. This gives unlimited look rotation instead
  // of stopping once the cursor hits the edge of the window.
  cam.firstPersonState.azimuth -= lookDeltaX * lookSensitivity;
  // NOTE: using 90 instead of PI/2 here since angleMode(DEGREES) is active in setup()
  if(abs(cam.firstPersonState.zenith + lookDeltaY * lookSensitivity) < 90) cam.firstPersonState.zenith += lookDeltaY * lookSensitivity;
  lookDeltaX = 0;
  lookDeltaY = 0;
  
  // Movement controls
  // Build a combined movement vector from all held keys, then normalize it
  // so diagonal movement (e.g. W+D) isn't faster than moving in one direction.
  let moveX = 0;
  let moveZ = 0;
  const baseSpeed = 2;
  // Scale by deltaTime so movement speed stays consistent regardless of frame rate.
  // (1000/60) is the nominal ms-per-frame at 60fps, used as the baseline.
  const speed = baseSpeed * (deltaTime / (1000 / 60));
  
  if(keyIsDown(87) || keyIsDown(UP_ARROW)){ // W / Up
    moveX -= cos(cam.firstPersonState.azimuth);
    moveZ += sin(cam.firstPersonState.azimuth);
  }
  if(keyIsDown(83) || keyIsDown(DOWN_ARROW)){ // S / Down
    moveX += cos(cam.firstPersonState.azimuth);
    moveZ -= sin(cam.firstPersonState.azimuth);
  }
  if(keyIsDown(65) || keyIsDown(LEFT_ARROW)){ // A / Left
    moveX -= cos(cam.firstPersonState.azimuth + 90);
    moveZ += sin(cam.firstPersonState.azimuth + 90);
  }
  if(keyIsDown(68) || keyIsDown(RIGHT_ARROW)){ // D / Right
    moveX += cos(cam.firstPersonState.azimuth + 90);
    moveZ -= sin(cam.firstPersonState.azimuth + 90);
  }
  
  const moveMag = sqrt(moveX * moveX + moveZ * moveZ);
  if(moveMag > 0){
    cam.eyeX += (moveX / moveMag) * speed;
    cam.eyeZ += (moveZ / moveMag) * speed;
  }
  
  // Update the look-at point
  cam.centerX = cam.eyeX - cam.firstPersonState.lookAtDist * cos(cam.firstPersonState.zenith) * cos(cam.firstPersonState.azimuth);
  cam.centerY = cam.eyeY + cam.firstPersonState.lookAtDist * sin(cam.firstPersonState.zenith);
  cam.centerZ = cam.eyeZ + cam.firstPersonState.lookAtDist * cos(cam.firstPersonState.zenith) * sin(cam.firstPersonState.azimuth);
  
  // Call the built in p5 function 'camera' to position and orient the camera
  camera(cam.eyeX, cam.eyeY, cam.eyeZ,  // position
         cam.centerX, cam.centerY, cam.centerZ,  // look-at
         0, 1, 0)  // up vector
}

let canvas;
let angle = 0;
let x = 0;
let y = 0;

let pg;

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function requestLook(e) {
  // Don't trigger pointer lock for clicks on real page controls (nav links, buttons, etc.)
  // so those always behave like normal links/buttons, unaffected by the 3D scene.
  if(e.target.closest('a, button, input, select, textarea')) return;
  canvas.elt.requestPointerLock();
}

function onPointerLockChange() {
  pointerLocked = (document.pointerLockElement === canvas.elt);
  // Clear any leftover deltas so re-locking doesn't cause a sudden jump
  lookDeltaX = 0;
  lookDeltaY = 0;
}

function onMouseMove(e) {
  if(pointerLocked){
    lookDeltaX += e.movementX;
    lookDeltaY += e.movementY;
  }
}

async function setup() {
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  canvas.position(0, 0);
  canvas.style("z-index",-1);
  
  angleMode(DEGREES);
  frameRate(60); // cap the sketch at 60fps
  cam1 = createCamera()
  
  // Pointer Lock setup: click anywhere on the page (except nav links/buttons) to
  // enable unlimited FPS-style mouse look. Listening on `document` instead of the
  // canvas itself is necessary because the canvas sits at z-index -1 behind the
  // page content, so it never receives click events directly.
  // Browsers require a user gesture (the click) before pointer lock can be granted,
  // and release it automatically when the user presses Esc.
  document.addEventListener('click', requestLook);
  document.addEventListener('pointerlockchange', onPointerLockChange);
  document.addEventListener('mousemove', onMouseMove);

  // 3D Text
  pg = createGraphics(400, 400);
  pg.background(0, 0, 0, 0);
  pg.fill(0);
  pg.textSize(20);
  pg.textAlign(CENTER, CENTER);
  pg.text('Default Blender Cube', pg.width / 2, pg.height / 2);
}

function draw() {
  background(220);
  drawScene();
  firstPerson(cam1);

}

function drawScene() {
  clear();

  translate(100, 0, 500);
  // emissiveMaterial(255, 255, 255);
  strokeWeight(0);
  
  // SPEED OF SPHERES
  x += 0.5;
  y += 0.5;
  //SPEED OF TORUSES
  angle += 0.2;
  
  sinX = sin(x);
  cosY = cos(y);

  x2 = map(sinX, 0, 1, 0, 160);
  y2 = map(cosY, 0, 1, 0, 160);
  
   // Sphere-1
  push();
  // translate x, y, z
  translate(x2, x2, y2);
  sphere(40, 20, 20);
  pop();
  
  // Sphere-2
  push();
  // translate x, y, z
  translate(-x2, -x2, -y2);
  sphere(60, 20, 20);
  pop();
  
  // Torus-1
  push();
  rotateZ(120);
  rotateX(angle);
  torus(100, 10, 30);
  pop();
  
  // Torus-2
  push();
  rotateY(angle);
  rotateX(-angle);
  rotateZ(angle);
  torus(330, 15, 50);
  pop();
  
  // Torus-3
  push();
  rotateY(-20);
  rotateX(angle);
  rotateZ(angle);
  torus(390, 15, 50);
  pop();
  
  // floor
  // push()
  //   fill(200, 255, 200)
  //   noStroke()
  //   translate(-90, 90, 800)
  //   rotateX(90)
  //   plane(200)
  // pop()

  lights()
  pointLight(255, 255, 255, -120, 0, 900)

  push()
    fill(150, 150, 150)
    translate(-90, 65, 800)
    box(50)
  pop()

  // Text Plane
  push()
    scale(-1, 1, 1);
    translate(90, 0, 800);
    texture(pg);
    plane(200, 200);
  pop()
}