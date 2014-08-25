/**
 * Module dependencies.
 */

var random_search = require('./stochastic/random_search');
var differential_evolution = require('./evolutionary/differential_evolution');
var pso = require('./swarm/pso');
var sa = require('./physical/simulated_annealing');
var soma = require('./swarm/soma');
var perceptron = require('./neural/perceptron');
var airs = require('./immune/airs');
var boa = require('./probabilistic/boa');
/**
 * Expose the prototypes.
 */
exports.random_search = random_search;
exports.differential_evolution = differential_evolution;
exports.pso = pso;
exports.sa = sa;
exports.soma = soma;
exports.perceptron = perceptron;
exports.perceptron = perceptron;
exports.airs = airs;
exports.boa = boa;
