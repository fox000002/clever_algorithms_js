random_search = require('../../lib/stochastic/random_search')

# Disable console output
console.log = ->


exports['objective'] = (test) ->
  test.equal random_search.objective_function([1, 2]), 5
  test.done()
  return


exports['random_vector'] = (test) ->
  rv = random_search.random_vector [[1, 2], [2, 3]]
  test.equal rv.length, 2
  test.ok 1<=rv[0]<=2
  test.ok 2<=rv[1]<=3
  test.done()
  return

exports['generate_array'] = (test) ->
  a = random_search.generate_array [-5, 5], 2
  test.equal a.length, 2
  test.deepEqual a, [[-5,5], [-5,5]]
  test.done()
  return

exports['search'] = (test) ->
  problem_size = 2
  search_space = random_search.generate_array [-5, 5], problem_size
  max_iter = 100
  best = random_search.search search_space, max_iter
  test.notEqual(best, {})
  test.ok -5 <= best['cost'] <= 5
  test.done()
  return