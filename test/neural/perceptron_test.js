var perceptron = require('../../lib/neural/perceptron');

exports['random_vector'] = function (test) {
    var rv = perceptron.random_vector([[1, 2], [2, 3]]);
    test.equal(rv.length, 2);
    test.ok(1 <= rv[0] && rv[0] <= 2);
    test.ok(2 <= rv[1] && rv[1] <= 3);
    test.done();
};

exports['generate_array'] = function (test) {
    var a = perceptron.generate_array([-5, 5], 2);
    test.equal(a.length, 2);
    test.deepEqual(a, [[-5,5], [-5,5]]);
    test.done();
};

exports['initialize_weights'] = function (test) {
    var w = perceptron.initialize_weights(10);
    test.equal(11, w.length);
    for (var i=0; i< w.length; i++) {
        test.ok(-1 <= w[i] && w[i] <= 1);
    }
    test.done();
};

exports['update_weights'] = function (test) {
    // no error, no change, one inputs
    var w = [0.5,0.5,0.5];
    var i;
    perceptron.update_weights(2, w, [1,1], 1.0, 1.0, 0.9);
    for (i=0; i< w.length; i++) {
        test.equals(0.5, w[i]);
    }
    // no error, no change, zero inputs
    w = [0.5,0.5,0.5];
    perceptron.update_weights(2, w, [1,1], 0.0, 0.0, 0.9);
    //noinspection JSDuplicatedDeclaration
    for (i=0; i< w.length; i++) {
        test.equals(0.5, w[i]);
    }
    // an update
    w = [0.5,0.5,0.5];
    perceptron.update_weights(2, w, [1,1], 1.0, 0.0, 0.9);
    for (i=0; i< w.length; i++) {
        test.equals(1.4, w[i]);
    }
    test.done();
};

exports['activate'] = function (test) {
    test.equals(5.0, perceptron.activate([1.0, 1.0, 1.0, 1.0, 1.0], [1.0, 1.0, 1.0, 1.0]));
    test.equals(2.5, perceptron.activate([0.5, 0.5, 0.5, 0.5, 0.5], [1.0, 1.0, 1.0, 1.0]));
    test.equals(-6.062263, perceptron.activate([-6.072185,2.454509,-6.062263], [0, 0]));
    test.done();
};

exports['transfer'] = function (test) {
    test.equals(0, perceptron.transfer(-1));
    test.equals(1, perceptron.transfer(0));
    test.equals(1, perceptron.transfer(1));
    test.done();
};

exports['get_output'] = function (test) {
    test.equals(1, perceptron.get_output([1,1,1], [1,1]));
    test.equals(0, perceptron.get_output([-1,-1,-1], [1,1]));
    test.done();
};

exports['train_weights'] = function (test) {
    var domain = [[0,0,0], [0,1,1], [1,0,1], [1,1,1]];
    var w = [-1,-1,-1];
    perceptron.train_weights(w, domain, 2, 10, 0.5) ;
    w.forEach(function (x) {
        test.notEqual(-1, x);
    });
    test.done();
};

exports['test_weights'] = function (test) {
    var domain = [[0,0,0], [0,1,1], [1,0,1], [1,1,1]];
    var w = [0.5,0.5,-0.5];
    var rs = perceptron.test_weights(w, domain, 2);
    test.equals(4, rs);
    test.done();
};

exports['test_search'] = function (test) {
    var domain = [[0,0,0], [0,1,1], [1,0,1], [1,1,1]];
    var weights = perceptron.execute(domain, 2, 20, 0.1);
    test.equals(3, weights.length);
    var rs = perceptron.test_weights(weights, domain, 2);
    test.equals(4, rs);
    test.done();
};