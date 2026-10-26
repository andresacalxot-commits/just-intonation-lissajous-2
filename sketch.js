let angle = 0;

let osc1, osc2, osc3;
let playing;

let slider1, slider2, slider3;

let a, b, c;
let g, h, i;

let divi;

let trail = [];
const TRAIL_LENGTH = 600;

const sliderVal = [120, 128, 135, 144, 150, 160, 180, 192, 200, 225, 240, 256, 270, 288, 300, 320, 384, 400, 450, 480];

let myFont; 

let prevAngle = 0;
const SUBSTEPS = 20;

let newFill = [ '#ffffff', '#c1a3ff', '#9150e9', '#543593', '#ffda54', '#cb8b4d', '#80be3b', '#586830', '#ff8f47', '#a04732', '#79493e'];

let myRadio;

let x, y, z;

let newFillindex = newFill[4];

function preload() {

  myFont = loadFont('LibreBaskerville.ttf');

}

function setup() {
  
  let cnv = createCanvas(windowWidth, windowHeight, WEBGL);
  cnv.mousePressed(playOscillator);
  cnv.mouseReleased(mouseReleased);

  frameRate(60);
  textFont(myFont);
  textSize(50);

  osc1 = new p5.Oscillator();
  osc2 = new p5.Oscillator();
  osc3 = new p5.Oscillator();

  osc1.amp(0, 0);
  osc2.amp(0, 0);
  osc3.amp(0, 0);

  slider1 = createSlider(0, sliderVal.length - 1, 10, 1);
  slider1.position(10, 10);
  slider1.size(100);

  slider2 = createSlider(0, sliderVal.length - 1, 10, 1);
  slider2.position(10, 50);
  slider2.size(100);

  slider3 = createSlider(0, sliderVal.length - 1, 10, 1);
  slider3.position(10, 90);
  slider3.size(100);

  slider1.input(onSliderinput);
  slider2.input(onSliderinput);
  slider3.input(onSliderinput);

  myRadio = createRadio();
  myRadio.position(width - 100, 20);
  myRadio.size(50);

  myRadio.option('parametric');
  myRadio.option('spherical');

  myRadio.selected('parametric');

  myRadio.input(onSliderinput);

  g = 1;
  h = 1;
  i = 1;

}

function draw() {

  //visualize a selected frequency ratio using spherical particles.
  //render this visualization in 3D, allowing the user to change
  //perspective without altering the visualization.

  background('rgba(2, 175, 55, 0.29)');

  orbitControl();

  ambientLight(0, 128, 128);
  directionalLight(128, 128, 128, 0, 0, -1);

  let alpha = sin(angle * i);

  if(myRadio.value() === 'parametric'){

    normalMaterial();
    sphere(20);

    x = map(sin(angle * g), -1, 1, -width, width);
    y = map(sin(angle * h), -1, 1, -width, width);
    z = map(sin(angle * i), -1, 1, -width, width);

  }
  else{

    
    sphere(width / 4, 0, 0);

    x = sin(h * angle) * cos(g * angle - alpha * PI) * width / 4;
    y = sin(h * angle) * sin(g * angle - alpha * PI) * width / 4;
    z = cos(h * angle) * width / 4;

  }

  for(let s = 1; s <= SUBSTEPS; s++){
  let t = s / SUBSTEPS;
  let a = lerp(prevAngle, angle, t);
  let alpha = sin(a * i);
  let sx, sy, sz;

    if(myRadio.value() === 'spherical'){

      let scale = width / 4;
      sx = sin(h * a) * cos(g * a - alpha * PI) * scale;
      sy = sin(h * a) * sin(g * a - alpha * PI) * scale;
      sz = cos(h * a) * scale;

    } 
    else {

      sx = map(sin(a * g), -1, 1, -width / 4, width / 4);
      sy = map(sin(a * h), -1, 1, -height / 3, height / 3);
      sz = map(sin(a * i), -1, 1, -width / 4, width / 4);

    }

    trail.push({ x: sx, y: sy, z: sz });

  }

  prevAngle = angle;

  trail.push({ x, y, z });
  if (trail.length > TRAIL_LENGTH) trail.shift();

  for(let i = 0; i < trail.length; i++){

    let t = i / trail.length;
    push();
    translate(trail[i].x, trail[i].y, trail[i].z);
    fill(newFillindex);
    sphere(4); 
    pop();

  }
  
  push();
  translate(x, y, z);
  normalMaterial();
  sphere(15);
  pop();

  if(slider1.input || slider2.input || slider3.input){

    a = sliderVal[slider1.value()];
    b = sliderVal[slider2.value()];
    c = sliderVal[slider3.value()];

    gcd(a, b, c);
    g = a / divi;
    h = b / divi;
    i = c / divi;
    
  }

  textAlign(CENTER, TOP);
  fill('black');
  text(g, -600, -600);
  text(h, -600, -550);
  text(i, -600, -500); 

  if(floor(angle) % 80 === 0){
  
    trail.length = 0;
  
  } 

  angle += 0.05;

}

function onSliderinput(){

  //effectively 'resets' the visualization when the sliders'
  //values are changed by the user

  trail.length = 0;
  angle = 0;
  newFillindex = newFill[floor(random(0, 10))];
  playOscillator();

}

function playOscillator(){

  //plays tones (sine waves) that the user selects
  //using the sliders 

  osc1.start();
  osc1.freq(sliderVal[slider1.value()], 0.5);
  osc1.amp(0.3, 0.01);

  osc2.start();
  osc2.freq(sliderVal[slider2.value()], 0.5);
  osc2.amp(0.3, 0.01);

  osc3.start();
  osc3.freq(sliderVal[slider3.value()], 0.5);
  osc3.amp(0.3, 0.01);

  playing = true;

}

function keyPressed(){

  //allows user to begin playing the depicted tones by
  //pressing space bar

  if(keyCode === 32){

    playOscillator();

  }

  return false;

}

function keyReleased(){

  //simple envelope to make tone offset less jarring

  if(keyCode === 32){
  
    osc1.amp(0, 0.5);
    osc2.amp(0, 0.5);
    osc3.amp(0, 0.5);
    playing = false;

  }

}

function mouseReleased(){

  //simple envelope to make tone offset less jarring

  osc1.amp(0, 0.5);
  osc2.amp(0, 0.5);
  osc3.amp(0, 0.5);
  playing = false;

}

function gcd(a, b, c){

  //finds the greatest common divisor via euclidean algorithm
  //this value is later used to reduce the frequency ratios to the
  //simplest form, in accordance with just intonation notation norms

  while( a != b ){

    if( a > b ){

      a = a - b;

    }
    else{

      b = b - a;
      
    }
  }

  while( a != c ){

    if( a > c ){

      a = a - c;

    }
    else{

      c = c - a;
      
    }
    
  }

  divi = a
  return divi;

}
