#!/usr/bin/env node --harmony

// Simulated Annealing (SA)

"use strict";

var util = require("util");


function euc_2d(c1, c2) {
    var dx = c1[0]-c2[0],
        dy = c1[1]-c2[1];
    return Math.round(Math.sqrt(dx*dx+dy*dy));
}

function cost(permutation, cities) {
    var distance = 0,
        c1, c2;
    for (var i=0; i<permutation.length; i++) {
        c1 = permutation[i];
        c2 = (i == permutation.length - 1 ? permutation[0] : permutation[i + 1]);
        distance += euc_2d(cities[c1], cities[c2]);
    }
    return distance;
}

function range(count) {
    return Array.apply(null, Array(count)).map(function (_, i) {return i;});
}

function randInt(min, max){
    var range = max - min;
    // it actually does work the other way...
    // if (range < 0) { throw new RangeError("min must be less than max"); }

    var rand = Math.floor(Math.random() * (range + 1));
    return min + rand;
}

function random_permutation(cities) {
    var perm = range(cities.length);
    var r, temp;
    for (var i=0; i<perm.length; i++) {
        r = randInt(0, perm.length-i-1) + i;
        temp = perm[r];
        perm[r] = perm[i];
        perm[i] = temp;
    }
    return perm;
}

function stochastic_two_opt(perm) {
    var c1 = randInt(0, perm.length-1),
        c2 = randInt(0, perm.length-1);
    var exclude = [c1];
    exclude.push((c1==0) ? perm.length-1 : c1-1);
    exclude.push((c1==perm.length-1) ? 0 : c1+1);
    while (exclude.indexOf(c2) !== -1) {
        c2 = randInt(0, perm.length-1);
    }
    var temp;
    if (c2 < c1) {
        temp = c1;
        c1 = c2;
        c2 = temp;
    }
    var newArray = perm.slice(c1, c2).reverse();
    return perm.slice(0, c1).concat(newArray, perm.slice(c2));
}

function create_neighbor(current, cities) {
    var candidate = {};
    candidate['vector'] = current['vector'].slice(0);
    candidate['vector'] = stochastic_two_opt(candidate['vector']);
    candidate['cost'] = cost(candidate['vector'], cities);
    //console.log(current);
    //console.log(candidate);
    return candidate;
}

function should_accept(candidate, current, temp) {
    if (candidate['cost'] <= current['cost']) {
        return true;
    }
    return Math.exp((current['cost'] - candidate['cost']) / temp) > Math.random();
}

function generate_array(element, repeat) {
    return new Array(repeat+1).join(1).split('').map(function(){return element;});
}

function search(cities, max_iteration, max_temp, temp_change) {
    var current = {
        'vector': random_permutation(cities)
    };
    current['cost'] = cost(current['vector'], cities);
    var temp= max_temp,
        best = current;
    var candidate;
    for (var iter=0; iter<max_iteration; iter++) {
        candidate = create_neighbor(current, cities);
        temp = temp * temp_change;
        if (should_accept(candidate, current, temp)) {
            current = candidate;
        }
        //console.log(candidate['cost'] + ' -- ' + best['cost']);
        if (candidate['cost'] < best['cost']) {
            best = candidate;
        }
        if ((iter+1)%10 === 0) {
            console.log(" > iteration " + (iter+1) + ", temp=" + temp + ", best=" + best['cost']);
        }

    }
    return best;
}

function run () {
    // problem configuration
    var berlin52 = [[565, 575], [25, 185], [345, 750], [945, 685], [845, 655],
        [880, 660], [25, 230], [525, 1000], [580, 1175], [650, 1130], [1605, 620],
        [1220, 580], [1465, 200], [1530, 5], [845, 680], [725, 370], [145, 665],
        [415, 635], [510, 875], [560, 365], [300, 465], [520, 585], [480, 415],
        [835, 625], [975, 580], [1215, 245], [1320, 315], [1250, 400], [660, 180],
        [410, 250], [420, 555], [575, 665], [1150, 1160], [700, 580], [685, 595],
        [685, 610], [770, 610], [795, 645], [720, 635], [760, 650], [475, 960],
        [95, 260], [875, 920], [700, 500], [555, 815], [830, 485], [1170, 65],
        [830, 610], [605, 625], [595, 360], [1340, 725], [1740, 245]];
    // algorithm configuration
    var max_iterations = 2000,
        max_temp = 100000.0,
        temp_change = 0.98;
    // execute the algorithm
    var best = search(berlin52, max_iterations, max_temp, temp_change);
    console.log("Done. Best Solution: " + util.inspect(best));
}


exports.euc_2d = euc_2d;
exports.cost = cost;
exports.range = range;
exports.randInt = randInt;
exports.random_permutation = random_permutation;
exports.stochastic_two_opt = stochastic_two_opt;
exports.create_neighbor = create_neighbor;
exports.should_accept = should_accept;
exports.generate_array = generate_array;
exports.search = search;
exports.run = run;
