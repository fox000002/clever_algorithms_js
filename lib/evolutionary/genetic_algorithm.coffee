util = require 'util'

onemax = (bitstring) ->
  bitstring.split('').map((x) -> parseInt x).reduce (x,y) -> x+y


random_bitstring = (num_bits) ->
  ((if Math.random() > 0.5 then '1' else '0') for i in [0..num_bits-1]).join('')


binary_tournament = (pop) ->
  i = Math.floor(Math.random() * pop)
  j = Math.floor(Math.random() * pop)
  while j == i
    j = Math.floor(Math.random() * pop)

  if pop[i]['fitness'] > pop[j]['fitness'] then i else j


point_mutation = (bitstring, rate) ->
  child = ''
  for i in [0..bitstring.length-1]
    bit = bitstring[i]
    child = child + if Math.random() < rate then (if bit=='1' then '0' else '1') else bit
  child


crossover = (parent1, parent2, rate) ->
  if Math.random() > rate
    parent1
  point = 1 + Math.floor Math.random() * (parent1.length-1)
  parent1[0..point-1] + parent2[point..parent1.length-1]


reproduce = (selected, pop_size, p_cross, p_mutation) ->
  children = []
  children


search = (max_gens, num_bits, pop_size, p_crossover, p_mutation)->
  population = []
  best = fitness:0, bitstring:""
  best


run = () ->
  # problem configuration
  num_bits = 64
  # algorithm configuration
  max_gens = 100
  pop_size = 100
  p_crossover = 0.98
  p_mutation = 1.0 / num_bits
  # execute the algorithm
  best = search max_gens, num_bits, pop_size, p_crossover, p_mutation
  console.log "done! Solution: f=#{best.fitness}, s=#{best.bitstring}"

exports.onemax = onemax
exports.random_bitstring = random_bitstring
exports.binary_tournament = binary_tournament
exports.point_mutation = point_mutation
exports.crossover = crossover
exports.reproduce = reproduce
exports.search = search
exports.run = run