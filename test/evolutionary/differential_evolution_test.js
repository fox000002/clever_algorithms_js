var de = require('../../lib/evolutionary/differential_evolution');

// Disable console output
console.log = function(){};

exports['objective'] = function (test) {
    test.equal(de.objective_function([1, 2]), 5);
    test.done();
};

exports['random_vector'] = function (test) {
    var rv = de.random_vector([[1, 2], [2, 3]]);
    test.equal(rv.length, 2);
    test.ok(1 <= rv[0] && rv[0] <= 2);
    test.ok(2 <= rv[1] && rv[1] <= 3);
    test.done();    
};

exports['generate_array'] = function (test) {
    var a = de.generate_array([-5, 5], 2);
    test.equal(a.length, 2);
    test.deepEqual(a, [[-5,5], [-5,5]]);
    test.done();        
};

exports['de_rand_1_bin'] = function (test) {
    // no crossover
    var rs = de.de_rand_1_bin(
        {'vector': [0,0]},
        {'vector': [0.1,0.1]},
        {'vector': [0.2,0.2]},
        {'vector': [0.3,0.3]},
        0, 0, [[0,1], [0,1]]);
    test.notEqual(rs['vector'], null);
    test.equal(2, rs['vector'].length);
    for (var v1 in rs['vector']) {
        //console.log(v);
        test.ok(v1>=0);
        test.ok(v1<=1);
    }
    // all crossover
    var p0 = {'vector': [0,0]},
        p1 = {'vector': [0.5,0.5]},
        p2 = {'vector': [0.2,0.2]},
        p3 = {'vector': [1,1]};
    for (var j=0; j<100; j++) {
        rs = de.de_rand_1_bin(p0, p1, p2, p3, 0.5, 1.0, [[0,1], [0,1]]);
        test.notEqual(rs['vector'], null);
        test.equal(2, rs['vector'].length);
        for (var v2 in rs['vector']) {
            //console.log(v);
            test.ok(v2>=0);
            test.ok(v2<=1);
        }
    }
    test.done();
};

exports['select_parents'] = function (test) {
    function makeFilter(value) {
        return function(elem) {
            return elem === value;
        };
    }

    for (var j=0; j<100; j++) {
        var pop = [
            {'a': "a"},
            {'b': "b"},
            {'c': "c"},
            {'d': "d"},
            {'e': "e"},
            {'f': "f"},
            {'g': "g"},
            {'h': "h"}
        ];
        var current = de.randInt(0, pop.length-1);
        var rs = de.select_parents(pop, current);
        //console.log(rs);
        for (var i=0; i<rs.length; i++) {
            var x = rs[i];
            //console.log(x);
            test.notEqual(x, null);
            test.notEqual(x, current);
            test.ok(x>=0);
            test.ok(x<pop.length);
            test.equal(1, rs.filter(makeFilter(x)).length);
        }
    }
    test.done();
};

exports['create_children'] = function (test) {
    var pop = [
        {'vector': [0,0]},
        {'vector': [0.5,0.5]},
        {'vector': [0.2,0.2]},
        {'vector': [1,1]}
    ];
    var children = de.create_children(pop, [[0,1], [0,1]], 0.5, 0.5);
    test.equal(4, children.length);
    for (var i=0; i<children.length; i++) {
        var child = children[i];
        test.notEqual(child, pop[i]);
        test.equal(2, child['vector'].length);
        for (var v in child['vector']) {
            test.ok(v>=0);
            test.ok(v<=1);
        }
    }
    test.done();
};

exports['select_population'] = function (test) {
    // all parents
    var parents = [
        {'cost': 0.1},
        {'cost': 0.2},
        {'cost': 0.3}
    ];
    var children = [
        {'cost': 1},
        {'cost': 2},
        {'cost': 3}
    ];
    var selected = de.select_population(parents, children);
    for (var i=0; i<selected.length; i++) {
        test.equal(selected[i], parents[i]);
    }
    // all children
    parents = [
        {'cost': 1},
        {'cost': 2},
        {'cost': 3}
    ];
    children = [
        {'cost': 0.1},
        {'cost': 0.2},
        {'cost': 0.3}
    ];
    selected = de.select_population(parents, children);
    for (var j=0; j<selected.length; j++) {
        test.equal(selected[j], children[j]);
    }
    test.done();
};

exports['search'] = function (test) {
    var best = de.search(100, [[-5,5],[-5,5]], 50, 0.8, 0.9);
    test.notEqual(best['cost'], null);
    test.ok(best['cost'] >= -0.001 && best['cost'] <= 0.001);
    test.done();        
};
