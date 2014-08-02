(function() {
  var generate_array, objective_function, random_vector, run, search, util;

  util = require("util");

  objective_function = function(v) {
    return v.reduce(function(x, y) {
      return x * x + y * y;
    });
  };

  random_vector = function(min_max) {
    return min_max.map(function(rx) {
      return rx[0] + (rx[1] - rx[0]) * Math.random();
    });
  };

  generate_array = function(element, repeat) {
    var _i, _results;
    _results = [];
    for (_i = 1; 1 <= repeat ? _i <= repeat : _i >= repeat; 1 <= repeat ? _i++ : _i--) {
      _results.push(element);
    }
    return _results;
  };

  search = function(search_space, max_iteration) {
    var best, candidate, iteration, _i, _ref;
    best = {};
    for (iteration = _i = 0, _ref = max_iteration - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; iteration = 0 <= _ref ? ++_i : --_i) {
      candidate = {
        'vector': random_vector(search_space)
      };
      candidate['cost'] = objective_function(candidate['vector']);
      if (iteration === 0 || candidate['cost'] < best['cost']) {
        best = candidate;
      }
      console.log(' > iteration=' + (iteration + 1) + ' best=' + best['cost']);
    }
    return best;
  };

  run = function() {
    var best, max_iteration, problem_size, search_space;
    problem_size = 2;
    search_space = generate_array([-5, 5], problem_size);
    max_iteration = 100;
    best = search(search_space, max_iteration);
    console.log("Done. Best Solution: " + util.inspect(best));
  };

  exports.objective_function = objective_function;

  exports.random_vector = random_vector;

  exports.generate_array = generate_array;

  exports.search = search;

  exports.run = run;

}).call(this);
