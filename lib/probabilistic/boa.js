#!/usr/bin/env node --harmony

// Bayesian Optimization Algorithm

"use strict";

function onemax(vector) {
    return vector.reduce(function(a, b) {
        return a+b;
    });
}

function run() {

}

exports.onemax = onemax;
exports.run = run;
