(function() {
  var create_children, de_rand_1_bin, generate_array, objective_function, randInt, random_vector, run, search, select_parents, select_population, util;

  util = require('util');

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

  randInt = function(min, max) {
    var range;
    range = max - min;
    return min + Math.floor(Math.random() * (range + 1));
  };

  de_rand_1_bin = function(p0, p1, p2, p3, f, cr, search_space) {
    var cut, i, sample, v, _i, _ref;
    sample = {
      'vector': generate_array(0, p0["vector"].length)
    };
    cut = 1 + randInt(0, sample['vector'].length - 1);
    for (i = _i = 0, _ref = sample['vector'].length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      if (i === cut || Math.random() < cr) {
        v = p3['vector'][i] + f * (p1['vector'][i] - p2['vector'][i]);
        if (v < search_space[i][0]) {
          v = search_space[i][0];
        }
        if (v > search_space[i][1]) {
          v = search_space[i][1];
        }
        sample['vector'][i] = v;
      }
    }
    return sample;
  };

  select_parents = function(pop, current) {
    var p1, p2, p3;
    p1 = randInt(0, pop.length - 1);
    p2 = randInt(0, pop.length - 1);
    p3 = randInt(0, pop.length - 1);
    while (p1 === current) {
      p1 = randInt(0, pop.length - 1);
    }
    while (p2 === current || p2 === p1) {
      p2 = randInt(0, pop.length - 1);
    }
    while (p3 === current || p3 === p1 || p3 === p2) {
      p3 = randInt(0, pop.length - 1);
    }
    return [p1, p2, p3];
  };

  create_children = function(pop, minmax, f, cr) {
    var children, i, p0, p1, p2, p3, pp, _i, _ref;
    children = [];
    for (i = _i = 0, _ref = pop.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      p0 = pop[i];
      pp = select_parents(pop, i);
      p1 = pp[0];
      p2 = pp[1];
      p3 = pp[2];
      children.push(de_rand_1_bin(p0, pop[p1], pop[p2], pop[p3], f, cr, minmax));
    }
    return children;
  };

  select_population = function(parents, children) {
    var i, temp, _i, _ref;
    temp = [];
    for (i = _i = 0, _ref = parents.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      temp.push(children[i]['cost'] <= parents[i]['cost'] ? children[i] : parents[i]);
    }
    return temp;
  };

  search = function(max_gens, search_space, pop_size, f, cr) {
    var best, c, children, compareTo, gen, i, j, pop, _i, _j, _k, _ref;
    pop = [];
    for (i = _i = 0; 0 <= pop_size ? _i < pop_size : _i > pop_size; i = 0 <= pop_size ? ++_i : --_i) {
      pop.push({
        vector: random_vector(search_space)
      });
      pop[i]['cost'] = objective_function(pop[i]['vector']);
    }
    pop.sort(function(a, b) {
      return a['cost'] - b['cost'];
    });
    best = pop[0];
    compareTo = function(a, b) {
      return a['cost'] - b['cost'];
    };
    for (gen = _j = 0; 0 <= max_gens ? _j < max_gens : _j > max_gens; gen = 0 <= max_gens ? ++_j : --_j) {
      children = create_children(pop, search_space, f, cr);
      for (j = _k = 0, _ref = children.length; 0 <= _ref ? _k < _ref : _k > _ref; j = 0 <= _ref ? ++_k : --_k) {
        c = children[j];
        c['cost'] = objective_function(c['vector']);
        pop = select_population(pop, children);
        pop.sort(compareTo);
        if (pop[0]['cost'] < best['cost']) {
          best = pop[0];
        }
      }
      console.log("> gen #" + (gen + 1) + ", fitness=" + best['cost']);
    }
    return best;
  };

  run = function() {
    var best, crossf, max_gens, pop_size, problem_size, search_space, weightf;
    problem_size = 3;
    search_space = generate_array([-5, 5], problem_size);
    max_gens = 200;
    pop_size = 10 * problem_size;
    weightf = 0.8;
    crossf = 0.9;
    best = search(max_gens, search_space, pop_size, weightf, crossf);
    return console.log("Done. Best Solution: " + util.inspect(best));
  };

  exports.objective_function = objective_function;

  exports.random_vector = random_vector;

  exports.generate_array = generate_array;

  exports.de_rand_1_bin = de_rand_1_bin;

  exports.select_parents = select_parents;

  exports.create_children = create_children;

  exports.select_population = select_population;

  exports.randInt = randInt;

  exports.search = search;

  exports.run = run;

}).call(this);
