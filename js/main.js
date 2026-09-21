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
// let cam;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  canvas.position(0, 0);
  canvas.style("z-index",-1);
  
  angleMode(DEGREES);

  // cam = createCamera();
  // // cam.lookAt(0, 0, 0);
  // translate(width/16, 0, height/5);

}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  // frameRate(24);
  clear();

  translate(100, 0, 500);
  
  // directionalLight(140, 140, 140, 1, 1, -0.7);
  // directionalLight(160, 100, 110, -1, -1, 0.7);
  
  // orbitControl();
  
  // normalMaterial(200, 0, 0);
  // specularMaterial(200, 0, 0);
  
  emissiveMaterial(255, 255, 255);

  // var p5jsHover = document.querySelector(".selected-page");
  // p5jsHover.addEventListener("mouseover", p5jsFast);
  // p5jsHover.addEventListener('mouseout', p5jsSlow);

  // function p5jsFast(event) {
  //   console.log(event.target);
  //   emissiveMaterial(0, 100, 100);
  // }
  // function p5jsSlow(event) {
  //   console.log(event.target);
  // }

  
  strokeWeight(0);
  
  // SPEED OF SPHERES
  x += 0.5;
  y += 0.5;
  //SPEED OF TORUSES
  angle += 0.2;
  
  
  sinX = sin(x);
  cosY = cos(y);

  // ROTATING CAMERA

  // cam.roll(mouseX/1000);
  // cam.roll(-mouseY/1000);
  // cam.lookAt(0,0,0);
  // cam.setPosition(0, 0, 800);


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
  
  
  
  //original ellipse below
  // ellipse(x2, y2, 50, 50);
  // sphere(x2, y2, height);
}