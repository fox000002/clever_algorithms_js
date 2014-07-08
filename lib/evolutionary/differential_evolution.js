#!/usr/bin/env node --harmony

// Differential Evolution (DE)

"use strict";

var util = require("util");

function objective_function(v) {
    return v.map(function(x) {
        return x*x;
    }).reduce(function(a, b) {
        return a+b;
    });
}

function random_vector(min_max) {
    return min_max.map(function(x) {
        return x[0] + (x[1] - x[0]) * Math.random();
    });
}

function generate_array(element, repeat) {
    return new Array(repeat+1).join(1).split('').map(function(){return element;});
}

function randInt(min, max){
    var range = max - min;
    // it actually does work the other way...
    // if (range < 0) { throw new RangeError("min must be less than max"); }

    var rand = Math.floor(Math.random() * (range + 1));
    return min + rand;
}

function de_rand_1_bin(p0, p1, p2, p3, f, cr, search_space) {
    var sample = {
        'vector': generate_array(0, p0['vector'].length)
    };
    var cut = 1 + randInt(0, sample['vector'].length-1);
    for (var i=0; i<sample['vector'].length; i++) {
        if (i === cut || Math.random() < cr) {
            var v = p3['vector'][i] + f * (p1['vector'][i] - p2['vector'][i]);
            if (v < search_space[i][0]) {
                v = search_space[i][0];
            } else if (v > search_space[i][1]) {
                v = search_space[i][1];
            }
            sample['vector'][i] = v;
        }
    }
    return sample;
}

function select_parents(pop, current) {
    var p1 = randInt(0, pop.length-1);
    var p2 = randInt(0, pop.length-1);
    var p3 = randInt(0, pop.length-1);
    while (p1 === current) {
        p1 = randInt(0, pop.length-1);
    }
    while (p2 === current || p2 === p1) {
        p2 = randInt(0, pop.length-1);
    }
    while (p3 === current || p3 === p1 || p3 === p2) {
        p3 = randInt(0, pop.length-1);
    }
    return [p1, p2, p3];
}

function create_children(pop, minmax, f, cr) {
    var children = [];
    for (var i=0; i<pop.length; i++) {
        var p0 = pop[i];
        var pp = select_parents(pop, i);
        var p1 = pp[0];
        var p2 = pp[1];
        var p3 = pp[2];
        children.push(de_rand_1_bin(p0, pop[p1], pop[p2], pop[p3], f, cr, minmax));
    }
    return children;
}

function select_population(parents, children) {
    var temp = [];
    for (var i=0; i<parents.length; i++) {
        temp.push(children[i]['cost'] <= parents[i]['cost'] ? children[i] : parents[i]);
    }
    return temp;
}

function search(max_gens, search_space, pop_size, f, cr) {
    var pop = [];
    for (var i=0; i<pop_size; i++) {
        pop.push({'vector': random_vector(search_space)});
        pop[i]['cost'] = objective_function(pop[i]['vector']);
    }
    pop.sort(function(a, b){return a['cost'] - b['cost'];});
    var best = pop[0];

    function compareTo(a, b){return a['cost'] - b['cost'];}

    for (var gen=0; gen<max_gens; gen++) {
        var children = create_children(pop, search_space, f, cr);
        for (var j=0; j<children.length; j++) {
            var c = children[j];
            c['cost'] = objective_function(c['vector']);
            pop = select_population(pop, children);
            pop.sort(compareTo);
            if (pop[0]['cost'] < best['cost']) {
                best = pop[0];
            }
        }
        console.log("> gen #" + (gen+1) + ", fitness=" + best['cost']);
    }
    return best;
}

function run() {
    // problem configuration
    var problem_size = 3;
    var search_space = generate_array([-5, 5], problem_size);
    //  algorithm configuration
    var max_gens = 200;
    var pop_size = 10 * problem_size;
    var weightf = 0.8;
    var crossf = 0.9;
    //  execute the algorithm
    var best = search(max_gens, search_space, pop_size, weightf, crossf);
    console.log("Done. Best Solution: " + util.inspect(best));
}

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
