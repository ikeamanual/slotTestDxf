'use strict';
// external parameters
// dimensions are in mm

var thickness = 4	// thickness of the material
var slotDepth = 65 / 2

var kerf = 0.2  // width in mm of the laser cut. This value is divided by two to correct the dimensions given as input
var numberOfSlots = 10 // The slots will increase in width by slotWidthIncrement, starting with slotWidth
var slotWidthIncrement = 0.1



// internal parameters
var kerf2 = kerf / 2
var slotWidth = thickness
var slotDistance = thickness * 2
var preLength = thickness * 4
var textHeight = 4



// acad colors
// http://sub-atomic.com/~moses/acadcolors.html
// 62 = color: ACAD colors: 0 = black, 1 = red, 2 = yellow, 3 = green, 4 = blue
// 39 = thickness

var dxfPreface = `0
SECTION
2
ENTITIES`

var dxfPostface = `0
ENDSEC
0
EOF`

var x = 0
var y = 0
var textHeigth = 0
var text = 0

var textTemplate = `0
MTEXT
62
0
10
${x}
20
${y}
40
${textHeigth}
1
${text}
50
-90`



var dxfPolylinePreface = `0
LWPOLYLINE
62
1
39
0.01`

console.log("dxfPreface = " + dxfPreface)
console.log("dxfPostface = " + dxfPostface)
console.log("kerf2 = " + kerf2)
console.log("textTemplate = " + textTemplate)

/*
	global x, y coordinates
*/
let xBase = 0;
let yBase = 0;
let curX = xBase;
let curY = yBase;

/**
return an absolute dxf xy point as a string

@param x The x coordinate
@param y The y coordinate
@param kerfMode Defines how the kerf is added to the x and y coordinates. 
The 2 characters + or - define is the kerf is added or subtracted from the x and y coordinates.
"++", "+-", "--", "-+"
@return A string of dxf x and y coordinates
*/
function drawRel(x, y, kerfMode) {

	let useX = 0;
	let useY = 0;
	switch(kerfMode) {
		case "++":
			useX = curX + x + kerf2;
			useY = curY + y + kerf2;
			break;
		case "+-":
			useX = curX + x + kerf2;
			useY = curY + y - kerf2;
			break;
		case "--":
			useX = curX + x - kerf2;
			useY = curY + y - kerf2;
			break;
		case "-+":
			useX = curX + x - kerf2;
			useY = curY + y + kerf2;
			break;
		default:
			console.log(`ERROR: drawRel(): unhandeld kerfMode ${kerfMode}`);
			break;
	}
	var result = `10\n${useX}\n20\n${useY}\n`;
	curX += x;
	curY += y;
	console.log(`drawRel(${x}, ${y}, ${kerfMode}) : ${result}`);
	return result;
}

/**
return the sum of all the integers from 1 to the argument, Triangular number
http://en.wikipedia.org/wiki/Triangular_number
Example: sumOfAllNumbers(3) returns 0 + 1 + 2 + 3 = 6

@param x The number 

@return the sum of all the integers from 1 to the argument
*/
var sumOfAllNumbers = function sumOfAllNumbers(x) {
	return (x * (x + 1)) / 2
};


function drawSlots() {
	console.log("drawSlots")
	
	
	let result = dxfPolylinePreface + '\n';
	result += drawRel(xBase, yBase, "-+");
	result += drawRel(preLength, yBase, "++");
	
	for (let i = 0; i < numberOfSlots; i++) {
		console.log(`slot ${i}`);
		
		result += drawRel(0, -slotDepth, "++")
		result += drawRel(slotWidth + (slotWidthIncrement * i), 0, "-+")
		result += drawRel(0, slotDepth, "-+")
		
		if (i !== numberOfSlots - 1) {
			result += drawRel(slotDistance, 0, "++")
		}
	}
	
	result += drawRel(preLength,0, "++")
	result += drawRel(0, -slotDepth * 2, "+-")
	result += drawRel(-((preLength * 2) + (numberOfSlots * slotWidth) + ((numberOfSlots - 1) * slotDistance) + (sumOfAllNumbers(numberOfSlots - 1) * slotWidthIncrement)),0, "--")
	result += drawRel(0, slotDepth * 2, "-+")
	
	return result;
}


let dxfResult = dxfPreface + '\n';
dxfResult += drawSlots();
dxfResult += dxfPostface;
console.log(`dxfResult = ${dxfResult}`)

var fs = require('fs');
var wstream = fs.createWriteStream('slotTestDxf.dxf');
wstream.write(dxfResult);

wstream.end();


module.exports.sumOfAllNumbers = sumOfAllNumbers;

