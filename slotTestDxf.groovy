import groovy.text.SimpleTemplateEngine


// external parameters
// dimensions are in mm

thickness = 4	// thickness of the material
slotDepth = 65 / 2

kerf = 0.2  // width in mm of the laser cut. This value is divided by two to correct the dimensions given as input
numberOfSlots = 10 // The slots will increase in width by slotWidthIncrement, starting with slotWidth
slotWidthIncrement = 0.1



// internal parameters
kerf2 = kerf / 2
slotWidth = thickness
slotDistance = thickness * 2
preLength = thickness * 4
textHeight = 4

println "slotTestDxf.groovy"

// acad colors
// http://sub-atomic.com/~moses/acadcolors.html
// 62 = color: ACAD colors: 0 = black, 1 = red, 2 = yellow, 3 = green, 4 = blue
// 39 = thickness

def dxfPreface = '''0
SECTION
2
ENTITIES
'''

def dxfPostface = '''0
ENDSEC
0
EOF
'''


def textTemplate = '''0
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
-90'''


dxfPolylinePreface = '''0
LWPOLYLINE
62
1
39
0.01
'''

def engine = new SimpleTemplateEngine()
templateData = ["x":"x", "y":"y", "text":"text", "textHeigth":"textHeigth"]
template = engine.createTemplate(textTemplate).make(templateData)

/*
	global x, y coordinates
*/
xBase = 0
yBase = 0
curX = xBase
curY = yBase

/**
return an absolute dxf xy point as a string

@param x The x coordinate
@param y The y coordinate
@param kerfMode Defines how the kerf is added to the x and y coordinates. 
The 2 characters + or - define is the kerf is added or subtracted from the x and y coordinates.
"++", "+-", "--", "-+"
@return A string of dxf x and y coordinates
*/
def drawRel(x, y, kerfMode) {

	def useX
	def useY
	switch(kerfMode) {
		case "++":
			useX = curX + x + kerf2
			useY = curY + y + kerf2
			break
		case "+-":
			useX = curX + x + kerf2
			useY = curY + y - kerf2
			break
		case "--":
			useX = curX + x - kerf2
			useY = curY + y - kerf2
			break
		case "-+":
			useX = curX + x - kerf2
			useY = curY + y + kerf2
			break
		default:
			println "ERROR: drawRel(): unhandeld kerfMode ${kerfMode}"
			break;
	}
	def result = "10\n${useX}\n20\n${useY}\n"
	curX += x
	curY += y
	println "drawRel(${x}, ${y}, ${kerfMode}) : ${result}"
	result
}



/**
return the sum of all the integers from 1 to the argument, Triangular number
http://en.wikipedia.org/wiki/Triangular_number
Example: sumOfAllNumbers(3) returns 0 + 1 + 2 + 3 = 6

@param x The number 

@return the sum of all the integers from 1 to the argument
*/
def sumOfAllNumbers(x) {
	(x * (x + 1)) / 2
}

def drawSlots() {
	println "drawSlots"
	
	
	def result = dxfPolylinePreface
	result += drawRel(xBase, yBase, "-+")
	result += drawRel(preLength, yBase, "++")
	
	for (i in (0..numberOfSlots - 1).toArray()) {
		println "slot ${i}"
		
		result += drawRel(0, -slotDepth, "++")
		result += drawRel(slotWidth + (slotWidthIncrement * i), 0, "-+")
		result += drawRel(0, slotDepth, "-+")
		
		if (i != numberOfSlots - 1) {
			result += drawRel(slotDistance, 0, "++")
		}
	}
	result += drawRel(preLength,0, "++")
	result += drawRel(0, -slotDepth * 2, "+-")
	result += drawRel(-((preLength * 2) + (numberOfSlots * slotWidth) + ((numberOfSlots - 1) * slotDistance) + (sumOfAllNumbers(numberOfSlots - 1) * slotWidthIncrement)),0, "--")
	result += drawRel(0, slotDepth * 2, "-+")
	result
}

def drawTexts() {

	def result = ""

	for (i in (0..numberOfSlots - 1).toArray()) {
			println "slot text ${i}"
			def incrementFactor = ( i < 2 ? 0 : i - 1) // correct index, the first 2 need to be 0
			def curSlotWidth = slotWidth + (slotWidthIncrement * i)
			def xOffset = preLength + ( i * slotWidth) + (i * slotDistance) + (sumOfAllNumbers(incrementFactor) * slotWidthIncrement)
			println "line ${i}, incrementFactor = ${incrementFactor}, curSlotWidth = ${curSlotWidth}, xOffset = ${xOffset}"
		
			
			templateData["x"] = xOffset + curSlotWidth + textHeight + 2
			templateData["y"] = -(slotDepth / 2)
			templateData["text"] = "${curSlotWidth} mm"
			templateData["textHeigth"] = textHeight
			result += template.toString() + "\n"
	}
	result
}

def dxfResult = dxfPreface
dxfResult += drawSlots()
dxfResult += drawTexts()
dxfResult += dxfPostface

new File("slotTestDxf.dxf").withWriter { w ->
	w.write dxfResult
}
