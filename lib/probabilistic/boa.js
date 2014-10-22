#!/usr/bin/env node --harmony

// Bayesian Optimization Algorithm

"use strict";

function onemax(vector) {
    return vector.reduce(function(a, b) {
        return a+b;
    });
}

function random_bitstring(size) {
    var result = [];
    for (var i=0; i<size; i++) {
        result.push(Math.random() < 0.5 ? 1 : 1);
    }
    return result;
}


function path_exists(i, j, graph) {
    var vistied = [];
    var stack = [i];

    while (stack.length > 0) {
        if (stack.indexOf(j) != -1) {
            return true;
        }
        var k = stack.shift();
        if (vistied.indexOf(k) != -1) {
            continue;
        }
        vistied.push(k);
        for (var i=0; i<graph[k]['out'].length; i++) {
            var m = graph[k]['out'][i];
            if (vistied.indexOf(m) == -1) {
                stack.unshift(m);
            }
        }
    }

    return false;
}


function run() {

}

exports.onemax = onemax;
exports.random_bitstring = random_bitstring;
exports.path_exists = path_exists;
exports.run = run;
