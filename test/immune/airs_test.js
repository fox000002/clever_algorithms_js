var airs = require('../../lib/immune/airs');

// Disable console output
console.log = function(){};

exports['random_vector'] = function (test) {
    var rv = airs.random_vector([[1, 2], [2, 3]]);
    test.equal(rv.length, 2);
    test.ok(1 <= rv[0] && rv[0] <= 2);
    test.ok(2 <= rv[1] && rv[1] <= 3);
    test.done();
};