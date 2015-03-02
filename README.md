# slotTestDxf
Node/Iojs script (ES6) which generates a dxf file to laser cut 2 pieces to test optimal slot width.
Laser cut 2 of these pieces and determine the optimal slot width.

![](graphics/slotTestDxf.png?raw=true)

*Usage*
- Clone
- npm install
- npm test
- npm start
- A file slotTestDxf.dxf will be created
- Edit slotTestDxf.js, change the parameters at the top
	- you can change:
		- material thickness
		- number of slots
		- kerf
		- size increment by which the slot widths are incremented
		- number of slots which are less than the material thickness to test soft material
- run again.

Here is an svg image. ( does not display )
![Alt text](https://rawgit.com/ikeamanual/slotTestDxf/graphics/slotTestDxf.svg)
<img src="https://rawgit.com/ikeamanual/slotTestDxf/graphics/slotTestDxf.svg">

There is also a groovy variant but is not as up to date as the js variant.
