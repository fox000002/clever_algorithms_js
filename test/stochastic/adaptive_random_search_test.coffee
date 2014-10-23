adaptive_random_search = require('../../lib/stochastic/adaptive_random_search')

# Disable console output
#console.log = ->

exports['objective'] = (test) ->
  test.equal adaptive_random_search.objective_function([1, 2]), 5
  test.done()
  return

exports['random_vector'] = (test) ->
  rv = adaptive_random_search.random_vector [[1, 2], [2, 3]]
  test.equal rv.length, 2
  test.ok 1<=rv[0]<=2
  test.ok 2<=rv[1]<=3
  test.done()
  return

exports['generate_array'] = (test) ->
  a = adaptive_random_search.generate_array [-5, 5], 2
  test.equal a.length, 2
  test.deepEqual a, [[-5,5], [-5,5]]
  test.done()
  return

exports['search'] = (test) ->
  #
  problem_size = 2
  bounds = adaptive_random_search.generate_array [-5, 5], problem_size
  #
  max_iteration = 1000
  init_factor = 0.05
  s_factor = 1.3
  l_factor = 3.0
  iteration_multiply = 10
  max_no_improve = 30
  #
  best = adaptive_random_search.search max_iteration, bounds, init_factor, s_factor, l_factor, iteration_multiply, max_no_improve
  test.notEqual(best, {})
  test.ok -5 <= best['cost'] <= 5
  test.done()
  return