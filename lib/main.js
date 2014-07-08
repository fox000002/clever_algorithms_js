/**
 * Module dependencies.
 */

var random_search = require('./stochastic/random_search');
var differential_evolution = require('./evolutionary/differential_evolution');
var pso = require('./swarm/pso');

/**
 * Expose the prototypes.
 */
exports.random_search = random_search;
exports.differential_evolution = differential_evolution;
exports.pso = pso;
