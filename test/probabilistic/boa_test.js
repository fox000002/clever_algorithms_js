var boa = require('../../lib/probabilistic/boa');

// Disable console output
console.log = function(){};

exports['onemax'] = function (test) {
    test.equal(boa.onemax([1, 0]), 1);
    test.done();
};
