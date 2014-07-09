var sa = require('../../lib/physical/simulated_annealing');

exports['euc_2d'] = function (test) {
    test.equal(0, sa.euc_2d([0,0], [0,0]));
    test.equal(0, sa.euc_2d([1.1,1.1], [1.1,1.1]));
    test.equal(1, sa.euc_2d([1,1], [2,2]));
    test.equal(3, sa.euc_2d([-1,-1], [1,1]));
    test.done();
};

exports['cost'] = function (test) {
    var cities = [[0,0], [1,1], [2,2], [3,3]];
    test.equal(1*2, sa.cost([0,1], cities));
    test.equal(3+4, sa.cost([0,1,2,3], cities));
    test.equal(4*2, sa.cost([0, 3], cities));
    test.done();
};

exports['random_permutation'] = function (test) {
    var cities = sa.generate_array([], 10);
    var p, j;
    for (var i=0; i<100; i++) {
        p = sa.random_permutation(cities);
        test.equal(cities.length, p.length);
        for (j=0; j< p.length; j++) {
            test.ok(p.indexOf(j) !== -1);
        }
    }
    test.done();
};

exports['stochastic_two_opt'] = function (test) {
    var perm = sa.range(10);
    var other, j;
    for (var i=0; i<100; i++) {
        other = sa.stochastic_two_opt(perm);
        test.equal(perm.length, other.length);
        test.notEqual(perm, other);
        for (j=0; j< other.length; j++) {
            test.ok(perm.indexOf(other[j]) !== -1);
        }
    }
    test.done();
};

exports['create_neighbor'] = function (test) {
    var cities = [[0,0],[3,3],[1,1],[2,2],[4,4]];
    var c, rs;
    for (var i=0; i<100; i++) {
        c = {'vector': [0, 1, 2, 3, 4]};
        rs = sa.create_neighbor(c, cities);
        test.notEqual(rs['cost'], null);
        test.notEqual(rs['vector'], null);
        test.notEqual(c['vector'], rs['vector']);
    }
    test.done();
};

exports['should_accept'] = function (test) {
    // accept lower cost
    test.equal(true, sa.should_accept({'cost': 1}, {'cost': 2}, 0));
    // accept same cost
    test.equal(true, sa.should_accept({'cost': 1}, {'cost': 1}, 0));
    test.done();
};

exports['search'] = function (test) {
    var berlin52 = [[565,575],[25,185],[345,750],[945,685],[845,655],
        [880,660],[25,230],[525,1000],[580,1175],[650,1130],[1605,620],
        [1220,580],[1465,200],[1530,5],[845,680],[725,370],[145,665],
        [415,635],[510,875],[560,365],[300,465],[520,585],[480,415],
        [835,625],[975,580],[1215,245],[1320,315],[1250,400],[660,180],
        [410,250],[420,555],[575,665],[1150,1160],[700,580],[685,595],
        [685,610],[770,610],[795,645],[720,635],[760,650],[475,960],
        [95,260],[875,920],[700,500],[555,815],[830,485],[1170,65],
        [830,610],[605,625],[595,360],[1340,725],[1740,245]];
    var best = sa.search(berlin52, 5000, 100000.0, 0.98);

    // better than a NN solution's cost
    test.notEqual(best['cost'], null);
    //console.log(best['cost']);
    test.ok(7542-3000 <= best['cost'] &&  best['cost'] <= 7542+3000);
    test.done();
};
