#!/usr/bin/env node --harmony

// Particle Swarm Optimization (PSO)

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

function create_particle(search_space, vel_space) {
    var particle = {
        'position': random_vector(search_space)
    };
    particle['cost'] = objective_function(particle['position']);
    particle['b_position'] = particle['position'].slice(0);
    particle['b_cost'] = particle['cost'];
    particle['velocity'] = random_vector(vel_space);
    return particle;
}

function get_global_best(population, current_best) {
    population.sort(function (a, b){return a['cost'] - b['cost'];});
    //console.log(population);
    var best = population[0];
    if (current_best === null || best['cost'] <= current_best['cost']) {
        current_best = {
            'position': best['position'].slice(0),
            'cost': best['cost']
        };
    }
    return current_best;
}

function update_velocity(particle, global_best, max_v, c1, c2) {
    var v, v1, v2;
    for (var i=0; i<particle['velocity'].length; i++) {
        v = particle['velocity'][i];
        v1 = c1 * Math.random() * (particle['b_position'][i] - particle['position'][i]);
        v2 = c2 * Math.random() * (global_best['position'][i] - particle['position'][i]);
        particle['velocity'][i] = v + v1 + v2;
        if (particle['velocity'][i] > max_v) {
            particle['velocity'][i] = max_v;
        }
        if (particle['velocity'][i] < -max_v) {
            particle['velocity'][i] = -max_v;
        }
    }
}

function update_position(part, bounds) {
    var v;
    for (var i=0; i < part['position'].length; i++) {
        v = part['position'][i];
        part['position'][i] = v + part['velocity'][i];
        if (part['position'][i] > bounds[i][1]) {
            part['position'][i] = bounds[i][1] - Math.abs(part['position'][i] - bounds[i][1]);
            part['velocity'][i] *= -1.0;
        }
        else if (part['position'][i] < bounds[i][0]) {
            part['position'][i] = bounds[i][0] + Math.abs(part['position'][i] - bounds[i][0]);
            part['velocity'][i] *= -1.0;
        }
    }
}

function update_best_position(particle) {
    if (particle['cost'] > particle['b_cost']) {
        return;
    }
    particle['b_cost'] = particle['cost'];
    particle['b_position'] = particle['position'].slice(0);
}

function search(max_gens, search_space, vel_space, pop_size, max_vel, c1, c2) {
    var pop = [];
    for (var i=0; i<pop_size; i++) {
        pop.push(create_particle(search_space, vel_space));
    }
    var global_best = get_global_best(pop, null);
    for (var gen=0; gen < max_gens; gen++) {
        for (var j=0; j<pop.length; j++) {
            particle = pop[j];
            update_velocity(particle, global_best, max_vel, c1, c2);
            update_position(particle, search_space);
            particle['cost'] = objective_function(particle['position']);
            update_best_position(particle);
        }
        global_best = get_global_best(pop, global_best);
        console.log("> gen #" + (gen+1) + ", fitness=" + global_best['cost']);
    }
    return global_best;
}

function run () {
    // problem configuration
    var problem_size = 2;
    var search_space = generate_array([-5, 5], problem_size);
    // algorithm configuration
    var vel_space = generate_array([-1, 1], problem_size);
    var max_gens = 100;
    var pop_size = 50;
    var max_vel = 100.0;
    var c1 = 2.0, c2 = 2.0;
    // execute the algorithm
    var best = search(max_gens, search_space, vel_space, pop_size, max_vel, c1, c2);
    console.log("Done. Best Solution: " + util.inspect(best));
}

exports.objective_function = objective_function;
exports.random_vector = random_vector;
exports.generate_array = generate_array;
exports.create_particle = create_particle;
exports.get_global_best = get_global_best;
exports.update_velocity = update_velocity;
exports.update_position = update_position;
exports.update_best_position = update_best_position;
exports.search = search;
exports.run = run;
