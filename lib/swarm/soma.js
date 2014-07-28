#!/usr/bin/env node --harmony

// Self Organizing Migrating Algorithm (SOMA)

var util = require("util");

function objective_function(v) {
    return v.map(function(x) {
        return x*x;
    }).reduce(function(a, b) {
        return a+b;
    });
}

function random_bound(bound) {
    return bound[0] + (bound[1] - bound[0]) * Math.random();
}

function random_vector(min_max) {
    return min_max.map(function(x) {
        return x[0] + (x[1] - x[0]) * Math.random();
    });
}

function generate_array(element, repeat) {
    return new Array(repeat+1).join(1).split('').map(function(){return element;});
}

// STRATEGY "ALL-TO-ONE (LEADER)", the basic version
function soma_all_to_one(search_space, step, path_length, prt, min_div, migrations, pop_size) {
    var dim = search_space.length;

    var individuals = [];
    var cost_values = [];
    var i = 0;
    for (var i=0; i<pop_size; i++) {
        individuals.push(random_vector(search_space));
        cost_values.push(objective_function(individuals[i]));
    }

    var index_of_leader = 0;
    //  find the leader (individual with the lowest cost value)
    var xmin = 99999999;
    for (var i=0; i<pop_size; i++) {
        if (cost_values[i] < xmin) {
            xmin = cost_values[i];
            index_of_leader = i;
        }
    }

    var global_error_history = [];
    var mig = 0;
    var go = true;
    var start_position_of_individual;
    var prt_vector;
    var leader_position;
    var tmp_individual;
    while (mig < migrations && go) {
        // migrate individuals to the leader (except leader to himself, of course :)
        for (i=0; i<pop_size; i++) {
            // check if this individual is not leader
            if (i === index_of_leader) {
                if (index_of_leader !== pop_size) {
                    continue;
                }
                else{
                    break;
                }
            }

            // store the individual start position
            start_position_of_individual = individuals[i];

            leader_position = individuals[index_of_leader];
            tmp_individual = [];

            // Let's migrate!
            for (var t=0.0; t<path_length; t+=step) {
                // Generate new PRTVector for each step of this individual
                var prt_vector_contain_only_zero = true;
                prt_vector = generate_array(0, dim);
                while (prt_vector_contain_only_zero) {
                    for (var j = 0; j < dim; j++) {
                        if (Math.random() < prt) {
                            prt_vector[j] = 1;
                            prt_vector_contain_only_zero = false;
                        } else {
                            prt_vector[j] = 0;
                        }
                    }
                }

                // new position for all dimension
                for (var j = 0; j < dim; j++) {
                    tmp_individual.push(start_position_of_individual[j] +
                        (leader_position[j] - start_position_of_individual[j]) * t * prt_vector[j]);
                }
                // check boundaries
                for (var j = 0; j < dim; j++) {
                    if (tmp_individual[j] < search_space[j][0] || tmp_individual[j] > search_space[j][1]) {
                        tmp_individual[j] = random_bound(search_space[j]);
                    }
                }


                var tmp_cost_value = objective_function(tmp_individual);
                if (tmp_cost_value < cost_values[i]) {
                    cost_values[i] = tmp_cost_value;  // store better CV and postion
                    individuals[i] = tmp_individual;
                }
            }
        }

        // find the leader (individual with the lowest cost value)
        xmin = 99999999;
        for (i=0; i<pop_size; i++) {
            if (cost_values[i] < xmin) {
                xmin = cost_values[i];
                index_of_leader = i;
            }
        }

        global_error_history.push(cost_values[index_of_leader]);

        // check and conditions
        var mig_check = 20;
        if (mig > mig_check + 1) {
            var decrease = 0;
            for (i=0; i<mig_check; i++) {
                decrease = decrease + Math.abs(global_error_history[mig - i - 1] - global_error_history[mig - i]);
                if (decrease < min_div) {
                    go = false;
                }
            }
        }
        mig = mig + 1;

        console.log('mig = ' + mig + 'of ' + migrations + ' : ' + Math.min(cost_values));
    }



    var global_error_history_for_saving = [];
    for (i=0; i<mig; i++) {
        global_error_history_for_saving.push(global_error_history[i]);
    }

    return {'position': individuals[index_of_leader],
        'cost': objective_function(individuals[index_of_leader]),
        'history': global_error_history_for_saving};

}

function run () {
    // problem configuration
    var problem_size = 100;
    var search_space = generate_array([-20, +20], problem_size);
    // algorithm configuration
    var step = 0.21;
    var pathLength = 2.1;
    var prt = 0.1;
    var minDiv = 0;
    var migrations = 50;
    var pop_size = 2 * problem_size;
    //
    var best = soma_all_to_one(search_space, step, pathLength, prt, minDiv, migrations, pop_size);
    //
    console.log("Done. Best Solution: " + util.inspect(best));
}

exports.objective_function = objective_function;
exports.random_vector = random_vector;
exports.generate_array = generate_array;
exports.soma_all_to_one = soma_all_to_one;
exports.run = run;
