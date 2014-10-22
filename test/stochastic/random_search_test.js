// Generated by CoffeeScript 1.8.0
(function() {
  var random_search;

  random_search = require('../../lib/stochastic/random_search');

  console.log = function() {};

  exports['objective'] = function(test) {
    test.equal(random_search.objective_function([1, 2]), 5);
    test.done();
  };

  exports['random_vector'] = function(test) {
    var rv, _ref, _ref1;
    rv = random_search.random_vector([[1, 2], [2, 3]]);
    test.equal(rv.length, 2);
    test.ok((1 <= (_ref = rv[0]) && _ref <= 2));
    test.ok((2 <= (_ref1 = rv[1]) && _ref1 <= 3));
    test.done();
  };

  exports['generate_array'] = function(test) {
    var a;
    a = random_search.generate_array([-5, 5], 2);
    test.equal(a.length, 2);
    test.deepEqual(a, [[-5, 5], [-5, 5]]);
    test.done();
  };

  exports['search'] = function(test) {
    var best, max_iter, problem_size, search_space, _ref;
    problem_size = 2;
    search_space = random_search.generate_array([-5, 5], problem_size);
    max_iter = 100;
    best = random_search.search(search_space, max_iter);
    test.notEqual(best, {});
    test.ok((-5 <= (_ref = best['cost']) && _ref <= 5));
    test.done();
  };

}).call(this);

//# sourceMappingURL=random_search_test.js.map
