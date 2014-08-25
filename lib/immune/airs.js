#!/usr/bin/env node --harmony

// Artificial Immune Recognition System

"use strict";

function random_vector(min_max) {
    return min_max.map(function(x) {
        return x[0] + (x[1] - x[0]) * Math.random();
    });
}

function run() {

}

exports.random_vector = random_vector;
exports.run = run;