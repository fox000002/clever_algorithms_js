# Random Search

util = require "util"

objective_function = (v) ->
  v.reduce (x,y) -> x*x + y*y

random_vector = (min_max) ->
  min_max.map (rx) -> rx[0] + (rx[1] - rx[0]) * Math.random()

generate_array = (element, repeat) ->
  (element for [1..repeat])

search = (search_space, max_iteration) ->
  best = {}
  for iteration in [0..max_iteration-1]
    candidate =
      'vector': random_vector search_space

    candidate['cost'] = objective_function candidate['vector']
    best = candidate if iteration == 0 || candidate['cost'] < best['cost']
    console.log ' > iteration=' + (iteration+1) + ' best=' + best['cost']
  best

run = () ->
  problem_size = 2
  search_space = generate_array [-5, 5], problem_size
  max_iteration = 100
  best = search search_space, max_iteration
  console.log "Done. Best Solution: " + util.inspect best;
  return

exports.objective_function = objective_function;
exports.random_vector = random_vector;
exports.generate_array = generate_array;
exports.search = search;
exports.run = run;
