var mutationRate = 0.1;

function Vehicle(x, y, dna) {
  this.loc = createVector(x, y);
  this.vel = createVector(0, -2);
  this.acc = createVector(0, 0);

  this.mass = 1;
  this.r = 4;
  this.maxSpeed = 10; //the faster it will move
  this.maxForce = 0.5; //bigger the number, the faster it will turn.

  this.dna = [];
  if (dna === undefined) {
    this.dna[0] = random(-5, 5); //food attraction
    this.dna[1] = random(-5, 5); //poison attraction
    this.dna[2] = random(0, 200); //food line of sight
    this.dna[3] = random(0, 200); //poison line of sight
  } else {
    this.dna[0] = dna[0]; //food attraction
    if (random(1) < mutationRate) {
      this.dna[0] += random(-0.1, 0.1);
    }
    this.dna[1] = dna[1]; //poison attraction
    if (random(1) < mutationRate) {
      this.dna[1] += random(-0.1, 0.1);
    }
    this.dna[2] = dna[2]; //food line of sight
    if (random(1) < mutationRate) {
      this.dna[2] += random(-10, 10);
    }
    this.dna[3] = dna[3]; //poison line of sight
    if (random(1) < mutationRate) {
      this.dna[3] += random(-10, 10);
    }
  }




  this.health = 1;

  this.update = function() {
    //update velocity
    this.vel.add(this.acc);

    //limit velocity
    this.vel.limit(this.maxSpeed);

    //update location
    this.loc.add(this.vel);

    //reset acceleration
    this.acc.mult(0);

    //lose a little bit of health every frame
    this.health -= 0.01;
  }

  this.applyForce = function(force) {
    var newAcc = force.div(this.mass);
    this.acc.add(newAcc);
  }

  this.seek = function(target) {
    //desired is the vector towards the target. Straight line to the target
    var desired = p5.Vector.sub(target, this.loc);

    var distance = desired.mag();

    //if close to the target, slow down. otherwise go at max speed
    // if (distance < 100) {
    //     var newSpeed = map(distance, 0, 100, 0, this.maxSpeed);
    //     desired.setMag(newSpeed);
    // } else {
    //         desired.setMag(this.maxSpeed);
    // }

    //steering is "desired" vector - current velocity
    var steeringForce = p5.Vector.sub(desired, this.vel);
    steeringForce.limit(this.maxForce);

    //apply the steering vector as a force to rotate the vehicle
    //this.applyForce(steering);
    return steeringForce;
  }

  this.boundaries = function() {
    var desired = null;
    var gutter = 25;

    if (this.loc.x < gutter) {
      desired = createVector(this.maxSpeed, this.vel.y);
    } else if (this.loc.x > width - gutter) {
      desired = createVector(-this.maxSpeed, this.vel.y);
    }

    if (this.loc.y < gutter) {
      desired = createVector(this.vel.x, this.maxSpeed);
    } else if (this.loc.y > height - gutter) {
      desired = createVector(this.vel.x, -this.maxSpeed);
    }

    if (desired != null) {
      desired.setMag(this.maxSpeed);
      var steeringForce = p5.Vector.sub(desired, this.vel);
      steeringForce.limit(this.maxForce);
      return steeringForce;
    } else {
      return createVector(0, 0);
    }

  }

  this.display = function() {
    // draw a triangle rotated in the direction of velocity
    var theta = this.vel.heading() + (PI / 2);
    push();
    translate(this.loc.x, this.loc.y);
    rotate(theta);

    if (debug) {
      noFill();
      //green line to show weight of how much it wants to get food
      strokeWeight(2);
      stroke(0, 255, 0);
      line(0, 0, 0, -this.dna[0] * 20);
      //green circle to show food perception
      strokeWeight(1);
      ellipse(0, 0, this.dna[2] * 2);

      //red line to show weight of how much it wants to get food
      stroke(255, 0, 0);
      line(0, 0, 0, -this.dna[1] * 20);
      //red circle to show poison perception
      ellipse(0, 0, this.dna[3] * 2);
    }

    //set color based on health
    //low health = more red
    //high health = more green
    var gr = color(0, 255, 0);
    var rd = color(255, 0, 0);
    var col = lerpColor(rd, gr, this.health);

    fill(col);
    stroke(col);
    beginShape();
    vertex(0, this.r * -2);
    vertex(-1 * this.r, this.r * 2);
    vertex(this.r, this.r * 2);
    endShape(CLOSE);
    pop();
  }

  this.eat = function(list, nutrition, perception) {
    var record = Infinity;
    var closest = null;
    for (var i = list.length - 1; i >= 0; i--) {
      var d = this.loc.dist(list[i]);

      if (d < this.maxSpeed) {
        list.splice(i, 1);
        this.health += nutrition;
      } else {
        if (d < record && d < perception) {
          record = d;
          closest = list[i];
        }
      }
    }

    if (closest != null) {
      return this.seek(closest);
    }

    //if it doesn't find anything
    return createVector(0, 0);
  }

  this.behaviors = function(good, bad) {
    var steerG = this.eat(good, 0.3, this.dna[2]);
    var steerB = this.eat(bad, -0.5, this.dna[3]);
    var steerBoundary = this.boundaries();

    steerG.mult(this.dna[0]);
    steerB.mult(this.dna[1]);
    //steerBoundary = this.boundaries();


    this.applyForce(steerG);
    this.applyForce(steerB);
    this.applyForce(steerBoundary);

  }

  this.dead = function() {
    return (this.health < 0);
  }

  //0.5% chance to generate a new me
  this.clone = function() {
    if (random(1) < 0.005) {
      var newMe = new Vehicle(this.loc.x, this.loc.y, this.dna.slice());
      return newMe;
    } else {
      return null;
    }
  }
}