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



// acad colors
// http://sub-atomic.com/~moses/acadcolors.html
// 62 = color: ACAD colors: 0 = black, 1 = red, 2 = yellow, 3 = green, 4 = blue
// 39 = thickness

dxfPreface = "0\n\
SECTION\n\
2\n\
ENTITIES\
"
 
console.log("dxfPreface = " + dxfPreface)
console.log("kerf2 = " + kerf2)
