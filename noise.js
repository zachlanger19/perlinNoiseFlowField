var inc;
var scl;
var z;
var particles = [];
var flowfield

function setup() {
	createCanvas(500, 300);
	inc = .1;
	scl = 10;
	rows = floor(height/scl);
	columns = floor(width/scl);
	z = 0;
	flowfield = new Array(columns*rows);

	for (i = 0; i < 1000; i++) {
		particles[i] = new particle();
	}

	background(0);
}


function draw() {
	for (y = 0; y < rows; y++) {
		for (x = 0; x < columns; x++) {
			var index = y * columns + x;
			var angle = noise(x*inc, y*inc, z*inc) * TWO_PI * 4;

			var v = p5.Vector.fromAngle(angle);
			v.mult(1.5);
			flowfield[index] = v;

			// push();
			// translate(x*scl, y*scl);
			// rotate(v.heading());
			// stroke(0, 50);
			// strokeWeight(1);
			// line(0,0,scl,0);
			// pop();
		}
	}
	z += .01;

	for (i = 0; i < 1000; i++) {
		particles[i].follow(flowfield);
		particles[i].show();
		particles[i].updatePrevious();
		particles[i].update();
		particles[i].edges();
	}
}

function particle() {
	this.pos = createVector(random(width),random(height));
	this.prevPos = this.pos.copy();
	this.vel = createVector(0,0);
	this.acc = createVector(0,0);
	this.maxSpeed = 4

	this.update = function() {
		this.pos.add(this.vel);
		this.vel.add(this.acc);
		this.acc.mult(0);
		this.vel.limit(this.maxSpeed);
	}

	this.updatePrevious = function() {
		this.prevPos.x = this.pos.x;
		this.prevPos.y = this.pos.y;
	}

	this.edges = function() {
		if (this.pos.x < 0) {
			this.pos.x = width;
			this.updatePrevious();
		}
		if (this.pos.x > width) {
			this.pos.x = 0;
			this.updatePrevious();
		}
		if (this.pos.y < 0) {
			this.pos.y = height;
			this.updatePrevious();
		}
		if (this.pos.y > height) {
			this.pos.y = 0;
			this.updatePrevious();
		}
	}

	this.applyForce = function(force) {
		this.acc.add(force);
	}

	this.follow = function(vectors) {
		var x = floor(this.pos.x / scl);
		var y = floor(this.pos.y / scl);
		index = y * columns + x;
		var force = vectors[index];
		this.applyForce(force);
	}

	this.show = function() {
		stroke(255, 5);
		strokeWeight(1);
		line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
	}
}




