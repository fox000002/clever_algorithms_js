genetic_algorithm = require('../../lib/evolutionary/genetic_algorithm')

# Disable console output
console.log = ->

exports['onemax'] = (test) ->
  test.equal genetic_algorithm.onemax('1'), 1
  test.equal genetic_algorithm.onemax('10'), 1
  test.equal genetic_algorithm.onemax('11'), 2
  test.equal genetic_algorithm.onemax('111'), 3
  test.done()
  return


exports['random_bitstring'] = (test) ->
  str = genetic_algorithm.random_bitstring(1)
  test.equal str.length, 1
  test.ok str == '0' || str == '1'
  str = genetic_algorithm.random_bitstring(2)
  test.equal str.length, 2
  for x in str.split('')
    test.ok x == '0' || x == '1'
  test.done()
  return
