var boa = require('../../lib/probabilistic/boa');

// Disable console output
//console.log = function(){};

exports['onemax'] = function (test) {
    test.equal(boa.onemax([1, 0]), 1);
    test.equal(boa.onemax([0, 0, 0, 0]), 0);
    test.equal(boa.onemax([1, 1, 1, 1]), 4);
    test.equal(boa.onemax([0, 1, 0, 1]), 2);
    test.done();
};

exports['random_bitstring'] = function (test) {
    test.equal(10, boa.random_bitstring(10).length);
    test.equal(10, boa.random_bitstring(10).filter(function (x) { return x===0 || x===1;}).length);
    test.done();
};

exports['path_exists'] = function (test) {
    test.equal(false, boa.path_exists(0, 1, [{'out': []}, {'out': []}]));
    test.equal(false, boa.path_exists(0, 1, [{'out': []}, {'out': [0]}]));
    test.equal(false, boa.path_exists(0, 1, [{'out': [2]}, {'out': []}, {'out': [0]}]));
    test.equal(true, boa.path_exists(0, 1, [{'out': [1]}, {'out': []}]));
    test.equal(true, boa.path_exists(0, 1, [{'out': [2]}, {'out': []}, {'out': [1]}]));
    test.equal(true, boa.path_exists(0, 2, [{'out': [1]}, {'out': [2]}, {'out': []}]));
    test.equal(false, boa.path_exists(2, 0, [{'out': [1]}, {'out': [2]}, {'out': []}]));

    test.done();
};