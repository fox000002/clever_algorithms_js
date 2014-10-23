# Adaptive Random Search
util = require "util"

objective_function = (v) ->
  v.reduce (x,y) -> x*x + y*y

rand_in_bounds = (min_value, max_value) ->
  min_value + (max_value - min_value) * Math.random()

random_vector = (min_max) ->
  min_max.map (rx) -> rx[0] + (rx[1] - rx[0]) * Math.random()

generate_array = (element, repeat) ->
  (element for [1..repeat])

take_step = (min_max, current, step_size) ->
  rand_in_bounds Math.max(min_max[i][0], current[i]-step_size)
    , Math.min(min_max[i][1], current[i] + step_size) for i in [0..current.length-1]

large_step_size = (iteration, step_size, s_factor, l_factor, iteration_multiply) ->
  if iteration%iteration_multiply == 0 then step_size * l_factor else step_size * s_factor

take_steps = (bounds, current, step_size, big_step_size) ->
  step = vector: take_step bounds, current['vector'], step_size
  step['cost'] = objective_function step['vector']
  big_step = vector: take_step bounds, current['vector'], big_step_size
  big_step['cost'] = objective_function(big_step['vector'])
  [step, big_step]

search = (max_iteration, bounds, init_factor, s_factor, l_factor, iteration_multiply, max_no_impr) ->
  step_size = (bounds[0][1] - bounds[0][0]) * init_factor
  count = 0
  current = vector: random_vector bounds
  current['cost'] = objective_function current['vector']
  for iteration in [0..max_iteration-1]
    big_step_size = large_step_size iteration, step_size, s_factor, l_factor, iteration_multiply
    [step, big_step] = take_steps bounds, current, step_size, big_step_size
    if step['cost'] <= current['cost'] || big_step['cost'] <= current['cost']
      if big_step['cost'] <= step['cost']
        [step_size, current] = [big_step_size, big_step]
      else
        current = step
      count = 0
    else
      count += 1
      if count >= max_no_impr
        [count, step_size] = [0, step_size/s_factor]
    console.log ' > iteration=#{iteration+1}, best=#{current.cost}'
  current

run = () ->
  #
  problem_size = 2
  bounds = generate_array [-5, 5], problem_size
  #
  max_iteration = 1000
  init_factor = 0.05
  s_factor = 1.3
  l_factor = 3.0
  iteration_multiply = 10
  max_no_improve = 30
  #
  best = search max_iteration, bounds, init_factor, s_factor, l_factor, iteration_multiply, max_no_improve
  console.log 'Done. Best Solution: c=#{best.cost}, v=#{best.vector}'


exports.objective_function = objective_function
exports.rand_in_bounds = rand_in_bounds
exports.random_vector = random_vector
exports.generate_array = generate_array
exports.take_step = take_step
exports.large_step_size = large_step_size
exports.take_steps = take_steps
exports.search = search
exports.run = run
