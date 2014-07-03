var random_search = require('../random_search');

exports['objective'] = function (test) {
    test.equal(random_search.objective_function([1, 2]), 5);
    test.done();
};

exports['random_vector'] = function (test) {
	var rv = random_search.random_vector([[1, 2], [2, 3]]);
	test.equal(rv.length, 2);
    test.ok(1 <= rv[0] && rv[0] <= 2);
    test.ok(2 <= rv[1] && rv[1] <= 3);
    test.done();	
};

exports['generate_array'] = function (test) {
	var a = random_search.generate_array([-5, 5], 2);
	test.equal(a.length, 2);
	test.deepEqual(a, [[-5,5], [-5,5]]);
    test.done();		
};

exports['search'] = function (test) {
    var problem_size = 2,
        search_space = random_search.generate_array([-5, 5], problem_size),
        max_iter = 100;
    var best = random_search.search(search_space, max_iter);
    test.notEqual(best, {});
    test.ok(-5 <= best['cost'] && best['cost'] <= 5);
    test.done();        
};