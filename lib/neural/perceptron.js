#!/usr/bin/env node --harmony

// Perceptron

"use strict";

function random_vector(min_max) {
    return min_max.map(function(x) {
        return x[0] + (x[1] - x[0]) * Math.random();
    });
}

function generate_array(element, repeat) {
    return new Array(repeat+1).join(1).split('').map(function(){return element;});
}

function initialize_weights(problem_size) {
    var minmax = generate_array([-1.0, 1.0], problem_size + 1)
    return random_vector(minmax);
}

function update_weights(num_inputs, weights, input, out_exp, out_act, l_rate) {
    for (var i=0; i<num_inputs; i++) {
        weights[i] += l_rate * (out_exp - out_act) * input[i];
    }
    weights[num_inputs] += l_rate * (out_exp - out_act) * 1.0;
}

function activate(weights, vector) {
    var sum = weights[weights.length-1] * 1.0;
    for (var i=0; i<vector.length; i++) {
        sum += weights[i] * vector[i];
    }
    return sum
}

function transfer(activation) {
    return (activation >= 0) ? 1.0 : 0.0
}

function get_output(weights, vector) {
    var activation = activate(weights, vector);
    return transfer(activation);
}

function train_weights(weights, domain, num_inputs, iterations, lrate) {
    var epoch,
        error,
        input,
        output,
        expected;
    for (var i=0; i<iterations; i++) {
        epoch = i;
        error = 0.0;
        domain.forEach (function (pattern) {
            input = [];
            for (var k=0; k<num_inputs; k++) {
                input.push(pattern[k]);
            }
            output = get_output(weights, input);
            expected = pattern[pattern.length-1];
            error += Math.abs(output-expected);
            update_weights(num_inputs, weights, input, expected, output, lrate);
        });
        console.log('> epoch=' + epoch + ', error=' + error);
    }
}


function test_weights(weights, domain, num_inputs) {
    var correct = 0;
    var input_vector;
    var output;
    domain.forEach(function (pattern) {
        input_vector = [];
        for (var k=0; k<num_inputs; k++) {
            input_vector.push(pattern[k]);
        }
        output = get_output(weights, input_vector);
        console.log(input_vector + " "  + weights + " " + output);

        if (Math.round(output) == pattern[pattern.length-1]) {
            correct++;
        }
    });
    console.log("Finished test with a score of " + correct + "/" + domain.length);
    return correct;
}


function execute(domain, num_inputs, iterations, learning_rate)  {
    var weights = initialize_weights(num_inputs);
    train_weights(weights, domain, num_inputs, iterations, learning_rate);
    test_weights(weights, domain, num_inputs);
    return weights;
}

function run() {
    // problem configuration
    var or_problem = [[0,0,0], [0,1,1], [1,0,1], [1,1,1]];
    var inputs = 2;
    // algorithm configuration
    var iterations = 20;
    var learning_rate = 0.1;
    // execute the algorithm
    execute(or_problem, inputs, iterations, learning_rate);
}


exports.random_vector = random_vector;
exports.generate_array = generate_array;
exports.initialize_weights = initialize_weights;
exports.update_weights = update_weights;
exports.activate = activate;
exports.transfer = transfer;
exports.get_output = get_output;
exports.train_weights = train_weights;
exports.test_weights = test_weights;
exports.execute = execute;
exports.run = run;