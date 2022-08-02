var canvas = document.querySelector('#anim-canvas');
var c = canvas.getContext('2d');

var mouse = {
	x: undefined,
	y: undefined
}

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//Function to get a random color
function getRandomColor() {
	
	var colorArray = [
		'#5C4B51',
		'#8CBEB2',
		'#F3B562',
		'#F06060'
	];
	
	return colorArray[Math.floor(Math.random() * colorArray.length)];
}

//Add eventlisteners
window.addEventListener('resize', function(){
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	
	init();
});

window.addEventListener('mousemove', function(e){
	
	var xBorderProximity = (e.x <= 5 || e.x >= canvas.width-5);
	var yBorderProximity = (e.y <= 5 || e.y >= canvas.height-5);
	
	if ( !(xBorderProximity || yBorderProximity) ) {
		mouse.x = e.x;
		mouse.y = e.y;	
		
	} else {
		mouse.x = undefined;
		mouse.y = undefined;	
		
	}
});


//Circle object	
function Circle(x, y, dx, dy, radius, color) {
	
	var maxRadius = 20;
	var minRadius = radius;
	var proximity = 30;
	
	this.x = x || 50;
	this.y = y || 50;
	this.dx = dx || 5;
	this.dy = dy || 5;
	this.radius = radius || 15;
	this.color = color || 'blue';
	
	//Draw circle
	this.draw = function () {
		c.beginPath();
		c.arc(this.x, this.y, this.radius, Math.PI*2, false);
		c.fillStyle = this.color;
		c.fill();
	}
	
	//Update circle position
	this.update = function () {
		
		//x position and velocity
		this.dx = ((this.x > (innerWidth - this.radius)) || (this.x < this.radius)) ? -this.dx : this.dx;
		this.x += this.dx;

		//y position and velocity
		this.dy = ((this.y > (innerHeight - this.radius)) || (this.y < this.radius)) ? -this.dy : this.dy;
		this.y += this.dy;
		
		//Mouse interactivity
		var xNearby = (mouse.x - this.x < proximity) && (mouse.x - this.x > -proximity);
		var yNearby = (mouse.y - this.y < proximity) && (mouse.y - this.y > -proximity);
		
		if ( xNearby && yNearby && (this.radius < maxRadius) ) {
			this.radius += 1;
			
		} else if ( this.radius > minRadius ) {
			this.radius -= 1;
			
		}
		
		//Draw again after new update
		this.draw();
	}
}


//Create an array of circles with different properties
var circleQuantity = 200;
var circleMinSize = 4;
var circleMaxSize = 20;
var circleArray = [];

function init() {
	
	circleArray = [];
	
	for (var i = 0; i < circleQuantity; i++) {

		var radius = (circleMinSize - 1) + parseInt( (circleMaxSize - circleMinSize) * Math.random());
		var x = Math.random() * (innerWidth - radius*2) + radius;
		var y = Math.random() * (innerHeight - radius*2) + radius;
		var dx = (Math.random() - 0.5) * 5;
		var dy = (Math.random() - 0.5) * 5;
		var color = getRandomColor();

		circleArray[i] = new Circle(x, y, dx, dy, radius, color);
		circleArray[i].draw();
	}	
}
init();



//Trigger the animation
function animate() {
	
	//Clear full canvas
	//c.clearRect(x, y, width, height);
	c.clearRect(0, 0, innerWidth, innerHeight);
	
	//Animate circles
	for (var i = 0; i < circleArray.length; i++) {
		circleArray[i].update();
	}
	
	//Loop animation
	requestAnimationFrame(animate);
}
animate();