const CLOCKSVG = document.querySelector("#svg-container");
//SVG containter size should be responsive to the device's screen size
//The whole container should be a square
//The calculation is not yet configured properly.
//We hardcode it for now.
CLOCKSVG.setAttribute("width", "500" || Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)/2);
CLOCKSVG.setAttribute("height", "500" || Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0));
const CLOCKSVGWIDTH = CLOCKSVG.getAttribute("width");
const CLOCKSVGHEIGHT = CLOCKSVG.getAttribute("height");

const CLOCKFRAME = document.querySelector("#clock-frame");
CLOCKFRAME.setAttribute("cx", CLOCKSVGWIDTH/2);
CLOCKFRAME.setAttribute("cy", CLOCKSVGHEIGHT/2);
CLOCKFRAME.setAttribute("r", CLOCKSVGWIDTH/2 - 10);//offset a bit to avoid getting cutt off by the svg border
CLOCKFRAME.setAttribute("fill", "rgb(255, 255, 255)");
CLOCKFRAME.setAttribute("stroke", "rgb(0, 0, 0)");
CLOCKFRAME.setAttribute("stroke-width", 20);


const makeCircle = (cx, cy, r, fill, stroke, strokeWidth) => {
	let newCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
	newCircle.setAttribute("cx", cx || CLOCKSVGWIDTH/2);
	newCircle.setAttribute("cy", cy || CLOCKSVGHEIGHT/2);
	newCircle.setAttribute("r", r || CLOCKSVGWIDTH/2);
	newCircle.setAttribute("fill", fill || "white");
	newCircle.setAttribute("stroke", stroke || "gray");
	newCircle.setAttribute("stroke-width", strokeWidth || 2.5);
	//Append to #svg-cotainer
	CLOCKSVG.appendChild(newCircle);
}



//Since we will use Math.cos(), Math.sin(), we need to specify the angle in radians.
//How about we adjust the angle so it has 12 o'clock as its initial angle, and make it negative so it moves clockwise?
const degToRad = deg => {
	//Make the passed degree and negative and add 90 degrees to start at 12.
	 let angle = (-(deg) + 90)*Math.PI/180;
	 return angle;
}

//Make a function that convert the polar coordinate to cartesian coordinates and returns it as an object.
//Angle argument should be in radians.
const polarToCartesian = (angle, radius) => {
	//Use cosine for the x-coordinate
	//Use sine for the y-coordinate
	//Radius is constant. Note that this is different from the circle radius.
	//We use this radius for the polar coordinate, not the circle radius attribute.
	let r = CLOCKSVGWIDTH/2 - radius || CLOCKSVGWIDTH/2 - 30;
	let xCoordinate = Math.cos(angle)*r;
	let yCoordinate = Math.sin(angle)*r;
	let coordinates = {
		x: xCoordinate,
		y: yCoordinate
	};

	return coordinates;
}

//Create clock tick marks using dots for simplicity
//Position a circle/dot for the every relevant degree
for (let i = 0; i < 360; i++) {
	//Since the polarToCartesian() expects the angle to be in degrees, we use the degToRad().
	let coordinates = polarToCartesian(degToRad(i), 50);
	//SVG has a different positioning values, though.
	//To fix this, we subtract the resulting x-coordinates from the middle of the clock.
	//Then, add the resulting y-coordinates to the middle of the clock; 
	let cx = (CLOCKSVGWIDTH/2) - coordinates.x;
	let cy = (CLOCKSVGHEIGHT/2) - coordinates.y;

	//For the hours mark:
	if (i % 30 == 0) {
		makeCircle(cx, cy, 10, "white", "black");
	}
	//For the minutes mark
	else if (i % 6 == 0) {
		makeCircle(cx, cy, 5);
	}
}

//We use line for the hands.
//(x1, y1) is on the center.
//(x2, y2) is on the time. 
const makeLine = (id, x2, y2, strokeWidth, stroke) => {
	let newLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
	newLine.setAttribute("id", id || `line${document.querySelectorAll("svg line").length}`);

	newLine.setAttribute("x1", CLOCKSVGWIDTH/2);
	newLine.setAttribute("y1", CLOCKSVGHEIGHT/2);

	newLine.setAttribute("x2", x2 || CLOCKSVGWIDTH/2);
	newLine.setAttribute("y2", y2 || CLOCKSVGHEIGHT/2 - 200);

	newLine.setAttribute("stroke-width", strokeWidth || 15);
	newLine.setAttribute("stroke", stroke || "black");
	//Append to #svg-cotainer
	CLOCKSVG.appendChild(newLine);
}

//Make a function that returns a coordinates object.
const getDate = () => {
	//Create an instance of Date class.
	let date = new Date(); 
	let coordinates = { };

	//Store in a variable each time property objects converted to cartesian coordinates.

	//The hour hand will increment 30 degrees every hour.
	coordinates.hourCoordinates = polarToCartesian(degToRad((date.getHours()-12)*30 + date.getMinutes()/2), 120);
	
	//The minute had will increment 1 degree every minute.  
	coordinates.minuteCoordinates = polarToCartesian(degToRad(date.getMinutes()*6 + date.getSeconds()/10), 75);

	//The second hand will increment 1 degree every second.
	coordinates.secondCoordinates = polarToCartesian(degToRad(date.getSeconds()*6), 30);

	return coordinates;
}

//This will set the initial time coordinates when the window first loads. 
let date = getDate(); 

//Hour hand
makeLine("hour-hand", CLOCKSVGWIDTH/2 + (date.hourCoordinates.x), CLOCKSVGWIDTH/2 - (date.hourCoordinates.y));

//Minute hand
makeLine("minute-hand", CLOCKSVGWIDTH/2 + date.minuteCoordinates.x, CLOCKSVGWIDTH/2 - date.minuteCoordinates.y, 10);

//Second Hand
makeLine("second-hand", CLOCKSVGWIDTH/2 + date.secondCoordinates.x, CLOCKSVGWIDTH/2 - date.secondCoordinates.y, 5);

//Center/origin of the clock
makeCircle(CLOCKSVGWIDTH/2, CLOCKSVGHEIGHT/2, 10);

//Make a function that assigns the coordinates of each of the hands with respect to the current time.
const updateClockSVG = (hourId, minuteId, secondID) => {
	const HOURHAND = document.querySelector(`#${hourId || "hour-hand"}`);
	const MINUTEHAND = document.querySelector(`#${minuteId || "minute-hand"}`);
	const SECONDHAND = document.querySelector(`#${secondID || "second-hand"}`);	

	let date = getDate();
	//Change the (x2,y2) values of each hand.
	//Adjust the coordinate, because SVG has different x and y values positioning.
	HOURHAND.setAttribute("x2", CLOCKSVGWIDTH/2 + (date.hourCoordinates.x));
	HOURHAND.setAttribute("y2", CLOCKSVGWIDTH/2 - (date.hourCoordinates.y));

	MINUTEHAND.setAttribute("x2", CLOCKSVGWIDTH/2 + date.minuteCoordinates.x);
	MINUTEHAND.setAttribute("y2", CLOCKSVGWIDTH/2 - date.minuteCoordinates.y);

	SECONDHAND.setAttribute("x2", CLOCKSVGWIDTH/2 + date.secondCoordinates.x);
	SECONDHAND.setAttribute("y2", CLOCKSVGWIDTH/2 - date.secondCoordinates.y);

	//console.log(hourCoordinates);
	//console.log(date.minuteCoordinates);
	//console.log(secondCoordinates);
};

//problem: seconds oscillate between 0 to 60 degrees only
//solution: multiply the seconds degree value to the minutes mark that will be converted to rad
//problem: clock moves counterclockwise lol
//solution: made the passed angle as argument negative, also added 60 degrees so the clock starts at 12.
//problem: hour hand is off by 60 degrees
//solution: subtract 12 hours so the hour value is always less than 12.

const START = setInterval(function(){
	updateClockSVG();
}, 1000);