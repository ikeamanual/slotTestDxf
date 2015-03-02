'use strict';
// external parameters
// dimensions are in mm

var thickness = 4	// thickness of the material
var slotDepth = 65 / 2

var kerf = 0.2  // width in mm of the laser cut. This value is divided by two to correct the dimensions given as input
var numberOfSlots = 10 // The slots will increase in width by slotWidthIncrement, starting with slotWidth
var slotWidthIncrement = 0.1
var numberOfNegativeSlots = 2 // number of slots with negative slotWidthIncrement, to test the slot fit if the material is soft



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


var dxfPolylinePreface = `0
LWPOLYLINE
62
1
39
0.01`

console.log("dxfPreface = " + dxfPreface)
console.log("dxfPostface = " + dxfPostface)
console.log("kerf2 = " + kerf2)


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
	//console.log(`drawRel(${x}, ${y}, ${kerfMode}) : ${result}`);
	return result;
}

/**
return the sum of all the integers from 1 to the argument, Triangular number
http://en.wikipedia.org/wiki/Triangular_number
Example: sumOfAllNumbers(3) returns 0 + 1 + 2 + 3 = 6

@param x The number 

@return the sum of all the integers from 1 to the argument
*/
function sumOfAllNumbers(x) {
	return (x * (x + 1)) / 2
};


function drawSlots() {
	console.log("drawSlots")
	
	
	let result = dxfPolylinePreface + '\n';
	result += drawRel(xBase, yBase, "-+");
	result += drawRel(preLength, yBase, "++");
	
	let slotWidthBegin = slotWidth - (numberOfNegativeSlots * slotWidthIncrement)
	for (let i = 0; i < numberOfSlots; i++) {
		console.log(`slot ${i}`);
		
		result += drawRel(0, -slotDepth, "++")
		result += drawRel(slotWidthBegin + (slotWidthIncrement * i), 0, "-+")
		result += drawRel(0, slotDepth, "-+")
		
		if (i !== numberOfSlots - 1) {
			result += drawRel(slotDistance, 0, "++")
		}
	}
	
	result += drawRel(preLength,0, "++")
	result += drawRel(0, -slotDepth * 2, "+-")
	
	
	console.log(`preLength * 2 = ${preLength * 2},
	numberOfSlots * slotWidthBegin = ${numberOfSlots * slotWidthBegin}
	(numberOfSlots - 1) * slotDistance = ${(numberOfSlots - 1) * slotDistance}
	sumOfAllNumbers(numberOfSlots - 1) = ${sumOfAllNumbers(numberOfSlots - 1)}
	sumOfAllNumbers(numberOfSlots - 1) * slotWidthIncrement) = ${sumOfAllNumbers(numberOfSlots - 1) * slotWidthIncrement}`)
	
	
	result += drawRel(-((preLength * 2) + (numberOfSlots * slotWidthBegin) + ((numberOfSlots - 1) * slotDistance) + (sumOfAllNumbers(numberOfSlots - 1) * slotWidthIncrement)), 0, "--")
	
	result += drawRel(0, slotDepth * 2, "-+")
	
	return result;
}

function indexCorrection(i) {
	let incrementFactor = ( i < 2 ? 0 : i - 1) // correct index, the first 2 need to be 0
	return incrementFactor
}

function drawTexts() {
	let result = ""

	let slotWidthBegin = slotWidth - (numberOfNegativeSlots * slotWidthIncrement)
	for (let i=0; i < numberOfSlots; i++) {
			console.log(`slot text ${i}`)
			let incrementFactor = indexCorrection( i ) //< 2 ? 0 : i - 1) // correct index, the first 2 need to be 0
			let curSlotWidth = slotWidthBegin + (slotWidthIncrement * i)
			let xOffset = preLength + ( i * slotWidthBegin) + (i * slotDistance) + (sumOfAllNumbers(incrementFactor) * slotWidthIncrement)
			console.log(`line ${i}, incrementFactor = ${incrementFactor}, curSlotWidth = ${curSlotWidth}, xOffset = ${xOffset}`)
		
			
			let x = xOffset + curSlotWidth + textHeight + 2
			let y = -(slotDepth / 4)
			let text = `${(curSlotWidth - kerf).toFixed(1)} ~ ${curSlotWidth.toFixed(1)}`
			let textHeigth = textHeight
			let textTemplate = `0
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

			result += textTemplate + "\n"
	}
	return result
}

function drawInfoText() {
	let result = ""

	let i = 1 // numberOfSlots / 2 - 1
	let incrementFactor = indexCorrection( i )
	let slotWidthBegin = slotWidth - (numberOfNegativeSlots * slotWidthIncrement)
	let xOffset = preLength + ( i * slotWidthBegin) + (i * slotDistance) + (sumOfAllNumbers(incrementFactor) * slotWidthIncrement)

	let x = xOffset //preLength / 2 + textHeight / 2
	let y = -(slotDepth + ( slotDepth / 4))
	let text = `kerf = ${kerf.toFixed(1)} mm\\Pthickness = ${thickness}\\Pgithub.com/ikeamanual/slotTestDxf`
	let textHeigth = textHeight
	let textTemplate = `0
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
0`

	result += textTemplate + "\n"

	return result
}

let dxfResult = dxfPreface + '\n';
dxfResult += drawInfoText();
dxfResult += drawTexts();
dxfResult += drawSlots();
dxfResult += dxfPostface;
console.log(`dxfResult = ${dxfResult}`)

var fs = require('fs');
var wstream = fs.createWriteStream('slotTestDxf.dxf');
wstream.write(dxfResult);

wstream.end();


module.exports.sumOfAllNumbers = sumOfAllNumbers;
module.exports.drawRel = drawRel;
module.exports.indexCorrection = indexCorrection;

