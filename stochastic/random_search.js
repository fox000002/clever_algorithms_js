#!/usr/bin/env node --harmony

// Random Search

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

function search(search_space, max_iteration) {
	var best = {};
	for (var iteration = 0; iteration < max_iteration; iteration++) {
		var candidate = {
			'vector': random_vector(search_space)
		};
        candidate['cost'] = objective_function(candidate['vector']);
        //console.log(candidate);
        if (iteration == 0 || candidate['cost'] < best['cost']) {
        	best = candidate;
        }
        console.log(' > iteration=' + (iteration+1) + ', best=' + best['cost']);
	}
	return best;
}

function generate_array(element, repeat) {
	return Array(repeat+1).join(1).split('').map(function(){return element;})
}

function run () {
	var problem_size = 2;
    var search_space = generate_array([-5, 5], problem_size);
    var max_iteration = 100;
    var best = search(search_space, max_iteration);
    console.log("Done. Best Solution: " + util.inspect(best));
}

exports.objective_function = objective_function;
exports.random_vector = random_vector;
exports.generate_array = generate_array;
exports.search = search;
exports.run = run;