var soma = require('../../lib/swarm/soma')


exports['objective'] = function (test) {
    test.equal(soma.objective_function([1, 2]), 5);
    // integer
    test.equal(99 * 99, soma.objective_function([99]));
    // float
    test.equal(0.1 * 0.1, soma.objective_function([0.1]));
    // vector
    test.equal(1 * 1 + 2 * 2 + 3 * 3, soma.objective_function([1, 2, 3]));
    // optima
    test.equal(0, soma.objective_function([0, 0]));
    test.done();
};

exports['random_vector'] = function (test) {
    var rv = soma.random_vector([[1, 2], [2, 3]]);
    test.equal(rv.length, 2);
    test.ok(1 <= rv[0] && rv[0] <= 2);
    test.ok(2 <= rv[1] && rv[1] <= 3);
    test.done();
};

exports['generate_array'] = function (test) {
    var a = soma.generate_array([-5, 5], 2);
    test.equal(a.length, 2);
    test.deepEqual(a, [[-5,5], [-5,5]]);
    test.done();
};