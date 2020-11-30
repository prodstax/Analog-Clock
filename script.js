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
CLOCKFRAME.setAttribute("stroke", "rgb(100, 100, 100)");
CLOCKFRAME.setAttribute("stroke-width", 10);


const makeCircle = (cx, cy, r, fill, stroke, strokeWidth) => {
	let newCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
	newCircle.setAttribute("cx", cx || CLOCKSVGWIDTH/2);
	newCircle.setAttribute("cy", cy || CLOCKSVGHEIGHT/2);
	newCircle.setAttribute("r", r || CLOCKSVGWIDTH/2);
	newCircle.setAttribute("fill", fill || "black");
	newCircle.setAttribute("stroke", stroke || "gray");
	newCircle.setAttribute("stroke-width", strokeWidth || 2.5);
	//Append to #svg-cotainer
	CLOCKSVG.appendChild(newCircle);
}

//Center/origin of the clock
makeCircle(CLOCKSVGWIDTH/2, CLOCKSVGHEIGHT/2, 10)

//Since we will use Math.cos(), Math.sin(), we need to specify the angle in radians.
const degToRad = deg => {
	 let angle = deg*Math.PI/180;
	 return angle;
}

//Create clock tick marks using dots for simplicity
//Convert the polar coordinate to cartesian coordinates
//Position a circle/dot for the every relevant degree
for (let i = 0; i < 360; i++) {
	//Use cosine for the x-coordinate
	//Use sine for the y-coordinate
	//Radius is constant. Note that this is different from the circle radius.
	//We use this radius for the polar coordinate, not the circle radius attribute.
	const RADIUS = CLOCKSVGWIDTH/2 - 30;
	//SVG has a different positioning values, though.
	//To fix this, we subtract the resulting x-coordinates from the middle of the clock.
	//Then, add the resulting y-coordinates to the middle of the clock; 
	let cx = (CLOCKSVGWIDTH/2) - (Math.cos(degToRad(i))*RADIUS);
	let cy = (CLOCKSVGHEIGHT/2) + (Math.sin(degToRad(i))*RADIUS);

	//For the hours mark:
	if (i % 30 == 0) {
		makeCircle(cx, cy, 10);
	}
	//For the minutes mark
	else if (i % 6 == 0) {
		makeCircle(cx, cy, 5, "white");
	}
}

//We use line for the hands.
//(x1, y1) is on the center.
//(x2, y2) is on the time. 
const makeLine = (x2, y2, strokeWidth, stroke) => {
	let newLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
	newLine.setAttribute("x1", CLOCKSVGWIDTH/2);
	newLine.setAttribute("y1", CLOCKSVGHEIGHT/2);

	newLine.setAttribute("x2", x2 || CLOCKSVGWIDTH/2);
	newLine.setAttribute("y2", y2 || CLOCKSVGHEIGHT/2 - 200);

	newLine.setAttribute("stroke-width", strokeWidth || 15);
	newLine.setAttribute("stroke", stroke || "black");
	//Append to #svg-cotainer
	CLOCKSVG.appendChild(newLine);
}

//Hour hand
makeLine();

//Minute hand
makeLine(CLOCKSVGWIDTH/2 + 200, CLOCKSVGHEIGHT/2, 10);

//Second Hand
makeLine(CLOCKSVGWIDTH/2 - 200, CLOCKSVGHEIGHT/2, 5);