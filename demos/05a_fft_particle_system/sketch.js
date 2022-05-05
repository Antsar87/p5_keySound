/*
  Analyze the frequency spectrum with FFT (Fast Fourier Transform)
  Draw a 1024 particles system that represents bins of the FFT frequency spectrum. 

  Example by Jason Sigal
 */

var mic, soundFile, soundFile2, soundFile3, soundFile4, soundFile5; // input sources, press T to toggleInput()

var fft;
var smoothing = 0.8; // play with this, between 0 and .99
var binCount = 1024; // size of resulting FFT array. Must be a power of 2 between 16 an 1024
var particles = new Array(binCount);

function setup() {
  c = createCanvas(windowWidth, windowHeight);
  noStroke();

  soundFile = createAudio('../../music/LCIR_85_Bmin_Kit2_Pad_chorus.wav');
  soundFile2 = createAudio('../../music/LCIR_85_Bmin_Kit2_Pad_intro.wav');
  soundFile3 = createAudio('../../music/LCIR_85_Bmin_Kit2_Pad_verse.wav');
  soundFile4 = createAudio('../../music/LCIR_90_Amaj_Kit7_Pad_02.wav');
  soundFile5 = createAudio('../../music/Pad1.wav');
  mic = new p5.AudioIn();
  mic.start();

  // initialize the FFT, plug in our variables for smoothing and binCount
  fft = new p5.FFT(smoothing, binCount);
  fft.setInput(mic);

  // instantiate the particles.
  for (var i = 0; i < particles.length; i++) {
    var x = map(i, 0, binCount, 0, width * 2);
    var y = random(0, height);
    var position = createVector(x, y);
    particles[i] = new Particle(position);
  }
}

function draw() {
  background(0, 0, 0, 100);

  // returns an array with [binCount] amplitude readings from lowest to highest frequencies
  var spectrum = fft.analyze(binCount);

  // update and draw all [binCount] particles!
  // Each particle gets a level that corresponds to
  // the level at one bin of the FFT spectrum.
  // This level is like amplitude, often called "energy."
  // It will be a number between 0-255.
  for (var i = 0; i < binCount; i++) {
    var thisLevel = map(spectrum[i], 0, 255, 0, 1);

    // update values based on amplitude at this part of the frequency spectrum
    particles[i].update(thisLevel);

    // draw the particle
    particles[i].draw();

    // update x position (in case we change the bin count while live coding)
    particles[i].position.x = map(i, 0, binCount, 0, width * 2);
  }
}

// ===============
// Particle class
// ===============

var Particle = function (position) {
  this.position = position;
  this.scale = random(0, 1);
  this.speed = createVector(0, random(0, 10));
  this.color = [random(0, 255), random(0, 255), random(0, 255)];
};

var theyExpand = 1;

// use FFT bin level to change speed and diameter
Particle.prototype.update = function (someLevel) {
  this.position.y += this.speed.y / (someLevel * 2);
  if (this.position.y > height) {
    this.position.y = 0;
  }
  this.diameter = map(someLevel, 0, 1, 0, 100) * this.scale * theyExpand;
};

Particle.prototype.draw = function () {
  fill(this.color);
  ellipse(this.position.x, this.position.y, this.diameter, this.diameter);
};

// ================
// Helper Functions
// ================

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(0);
}

document.addEventListener('keydown', (e) => {

  if (e.code === 'ArrowUp') {
    playMusic(soundFile);
  } else if (e.code === 'ArrowLeft') {
    playMusic(soundFile2);
  } else if (e.code === 'ArrowRight') {
    playMusic(soundFile3);
  } else if (e.code === 'ArrowDown') {
    playMusic(soundFile4);
  } else if (e.code === 'Space') {
    playMusic(soundFile5);
  }
});

document.addEventListener('keyup', (e) => {

  if (e.code === 'ArrowUp') {
    stopMusic(soundFile);
  } else if (e.code === 'ArrowLeft') {
    stopMusic(soundFile2);
  }else if (e.code === 'ArrowRight') {
    stopMusic(soundFile3);
  } else if (e.code === 'ArrowDown') {
    stopMusic(soundFile4);
  } else if (e.code === 'Space') {
    stopMusic(soundFile5);
  }
});

function playMusic(music) {
  music.loop();
  mic.stop();
  fft.setInput(music);
}

function stopMusic(music) {
  music.pause();
  mic.start();
  fft.setInput(mic);
}
