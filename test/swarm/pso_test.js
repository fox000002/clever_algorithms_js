var pso = require('../../lib/swarm/pso');

// Disable console output
console.log = function(){};

exports['objective'] = function (test) {
    test.equal(pso.objective_function([1, 2]), 5);
    // integer
    test.equal(99*99, pso.objective_function([99]));
    // float
    test.equal(0.1*0.1, pso.objective_function([0.1]));
    // vector
    test.equal(1*1+2*2+3*3, pso.objective_function([1, 2, 3]));
    // optima
    test.equal(0, pso.objective_function([0, 0]));
    test.done();
};

exports['random_vector'] = function (test) {
    var rv = pso.random_vector([[1, 2], [2, 3]]);
    test.equal(rv.length, 2);
    test.ok(1 <= rv[0] && rv[0] <= 2);
    test.ok(2 <= rv[1] && rv[1] <= 3);
    test.done();
};

exports['generate_array'] = function (test) {
    var a = pso.generate_array([-5, 5], 2);
    test.equal(a.length, 2);
    test.deepEqual(a, [[-5,5], [-5,5]]);
    test.done();
};

exports['create_particle'] = function (test) {
    var rs = pso.create_particle([[-1, 1], [-1, 1]], [[0, 1]]);
    test.notEqual(rs['position'], null);
    test.notEqual(rs['cost'], null);
    test.notEqual(rs['b_position'], null);
    test.notEqual(rs['b_cost'], null);
    test.notEqual(rs['velocity'], null);
    test.equal(2, rs['position'].length);
    test.equal(1, rs['velocity'].length);
    for (var x in rs['position']) {
        test.ok(x>=-1);
        test.ok(x<=1);
    }

    for (var v in rs['velocity']) {
        test.ok(v>=0);
        test.ok(v<=1);
    }

    test.notEqual(rs['position'], rs['b_position']);
    test.done();
};

exports['get_global_best'] = function (test) {
    var problem_size = 2;
    var search_space = pso.generate_array([-10, 10], problem_size);
    var vel_space = [[-1, 1]];
    var pop_size = 11;
    var pop = [];
    var i;
    for (i=0; i<pop_size; i++) {
        pop.push(pso.create_particle(search_space, vel_space));
        pop[i]['cost'] = i;
    }
    //console.log(pop);
    // test ascending order
    var gbest = pso.get_global_best(pop, null);
    test.equal(0, gbest['cost']);
    // test descending order
    for (i=0; i<pop_size; i++) {
        pop[i]['cost'] = pop_size - i - 1;
    }
    gbest = pso.get_global_best(pop, null);
    test.equal(0, gbest['cost']);
    test.done();
};

function do_test_update_velocity(test, max_vel, particle, gbest, pos, vel, l_pos, g_pos, expected) {
    var sum = 0;
    var count = 0;
    while (count < 20000) {
        particle['position'] = [pos],  particle['velocity'] = [vel];
        particle['b_position'] = [l_pos], gbest['position'] = [g_pos];
        pso.update_velocity(particle, gbest, max_vel, 1, 1) ;
        test.ok(Math.abs(particle['velocity'][0])<=max_vel);
        sum += particle['velocity'][0];
        count += 1;
    }
    //console.log(expected + ' ' + sum/count);
    test.ok(expected-0.1 <= (sum / count) && (sum / count) <= expected + 0.1);
}

exports['update_velocity'] = function (test) {
    var problem_size = 1;
    var search_space = pso.generate_array([-10, 10], problem_size);
    var vel_space = [[0, 0]];
    var particle = pso.create_particle(search_space, vel_space);
    var gbest = pso.create_particle(search_space, vel_space);

    // test vel updates
    do_test_update_velocity(test, 5, particle, gbest, 0, 0, 0, 0, 0)
    do_test_update_velocity(test, 5, particle, gbest, 0, 5, 0, 0, 5)
    do_test_update_velocity(test, 50, particle, gbest, 0, 0, -10, 10, 0)
    do_test_update_velocity(test, 5, particle, gbest, -10, 10, 10, 10, 5)
    do_test_update_velocity(test, 50, particle, gbest, 0, 5, -5, 10, 7.5)
    do_test_update_velocity(test, 50, particle, gbest, -2.5, -5, 0, 0, -2.5)
    test.done();
};

exports['update_position'] = function (test) {
    var problem_size = 2;
    var search_space = pso.generate_array([-10, 10], problem_size);
    var particle = pso.create_particle(search_space, [-1,1]);
    // positive integers
    particle['position'] = [0,9];
    particle['velocity'] = [4,4];
    pso.update_position(particle, search_space);
    test.deepEqual([4,7], particle['position']);
    // negative integers
    particle['position'] = [-8,-9];
    particle['velocity'] = [-2,-4];
    pso.update_position(particle, search_space);
    test.deepEqual([-10,-7], particle['position']);
    test.done();
};

exports['update_best_position'] = function (test) {
    // no update
    var p = {
        'position': [0],
        'cost': 99,
        'b_cost': 0,
        'b_position': [1]
    };
    pso.update_best_position(p);
    test.equal(0, p['b_cost']);
    test.deepEqual([1], p['b_position']);
    // update
    p = {
        'position': [0],
        'cost': 9,
        'b_cost': 50,
        'b_position': [1]
    };
    pso.update_best_position(p);
    test.equal(9, p['b_cost']);
    test.deepEqual([0], p['b_position']);
    test.done();
};

exports['search'] = function (test) {
    var best = pso.search(200, [[-5,5],[-5,5]], [[-1,1],[-1,1]], 50, 100.0, 2, 2);
    test.notEqual(best['cost'], null);
    test.ok(0.0-0.6 <= best['cost'] && best['cost'] <= 0.6);
    test.done();
};
