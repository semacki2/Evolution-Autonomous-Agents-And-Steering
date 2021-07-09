var vehicles = [];
var food = [];
var poison = [];
var debug = false;
var btnDebug;

function setup() {
  createCanvas(640, 640);
  createP('Click and drag to add more vehicles');
  btnDebug = createButton('Toggle Debug');
  btnDebug.mousePressed(toggleDeubg);
  
  for (var i = 0; i < 100; i++) {
    var x = random(width);
    var y = random(height);
    var vehicle = new Vehicle(x, y);
    vehicles.push(vehicle);
  }

  for (i = 0; i < 200; i++) {
    var x = random(width);
    var y = random(height);
    food.push(createVector(x, y));
  }

  for (i = 0; i < 50; i++) {
    var x = random(width);
    var y = random(height);
    poison.push(createVector(x, y));
  }
}

function draw() {
  background(51);

  //30% of the time, add a new random peice of food
  if (random(1) < 0.3) {
    var x = random(width);
    var y = random(height);
    food.push(createVector(x, y));
  }


  //10% of the time, add a new random peice of poison
  if (random(1) < 0.1) {
    var x = random(width);
    var y = random(height);
    poison.push(createVector(x, y));
  }

  //draw the food
  for (var i = food.length - 1; i >= 0; i--) {
    fill(0, 255, 0);
    noStroke();
    ellipse(food[i].x, food[i].y, 8);
  }

  //draw the poison
  for (var i = poison.length - 1; i >= 0; i--) {
    fill(255, 0, 0);
    noStroke();
    ellipse(poison[i].x, poison[i].y, 8);
  }

  for (i = vehicles.length - 1; i >= 0; i--) {
    //call the vehicle's functions
    vehicles[i].behaviors(food, poison);

    //vehicle.seek(food);
    vehicles[i].update();
    vehicles[i].display();

    //clone, might be null
    var child = vehicles[i].clone();
    if (child != null) {
      vehicles.push(child);
    }

    //check if dead
    if (vehicles[i].dead()) {
      food.push(vehicles[i].loc.copy());
      vehicles.splice(i, 1);
    }
  }
}

function mousePressed() {
  var vehicle = new Vehicle(mouseX, mouseY);
  vehicles.push(vehicle);
}

function mouseDragged() {
  var vehicle = new Vehicle(mouseX, mouseY);
  vehicles.push(vehicle);
}

function toggleDeubg(){
  debug = !debug;
}