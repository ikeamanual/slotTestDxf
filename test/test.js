


/* function sumOfAllNumbers(x) {
	return (x * (x + 1)) / 2
} */
var assert = require("assert")
describe('Array', function(){
  describe('#indexOf()', function(){
    it('should return -1 when the value is not present', function(){
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    })
  })
})


var slotTestDxf = require("../slotTestDxf")

describe('sumOfAllNumbers()', function() {
	it('should return the Triangular number', function() {
		assert.equal(slotTestDxf.sumOfAllNumbers(0), 0)
		assert.equal(slotTestDxf.sumOfAllNumbers(1), 1)
		assert.equal(slotTestDxf.sumOfAllNumbers(2), 3)
		assert.equal(slotTestDxf.sumOfAllNumbers(3), 6)
	})
})
