util = require 'util'

objective_function = (v) ->
  v.reduce (x,y) -> x*x + y*y

random_vector = (min_max) ->
  min_max.map (rx) -> rx[0] + (rx[1] - rx[0]) * Math.random()

generate_array = (element, repeat) ->
  (element for [1..repeat])

randInt = (min, max) ->
  range = max - min
  min + Math.floor Math.random() * (range + 1)


de_rand_1_bin = (p0, p1, p2, p3, f, cr, search_space) ->
  sample =
    'vector' : generate_array(0, p0["vector"].length)
  cut = 1 + randInt 0, sample['vector'].length-1
  for i in [0...sample['vector'].length]
    if i == cut || Math.random() < cr
      v = p3['vector'][i] + f * (p1['vector'][i] - p2['vector'][i])
      v = search_space[i][0] if v < search_space[i][0]
      v = search_space[i][1] if v > search_space[i][1]
      sample['vector'][i] = v
  sample

select_parents = (pop, current) ->
  p1 = randInt(0, pop.length-1)
  p2 = randInt(0, pop.length-1)
  p3 = randInt(0, pop.length-1)
  while p1 == current
    p1 = randInt(0, pop.length-1)
  while p2 == current || p2 == p1
    p2 = randInt(0, pop.length-1)
  while p3 == current || p3 == p1 || p3 == p2
    p3 = randInt(0, pop.length-1)
  [p1, p2, p3]


create_children = (pop, minmax, f, cr) ->
  children = []
  for i in [0...pop.length]
    p0 = pop[i]
    pp = select_parents(pop, i)
    p1 = pp[0]
    p2 = pp[1]
    p3 = pp[2]
    children.push(de_rand_1_bin(p0, pop[p1], pop[p2], pop[p3], f, cr, minmax))
  children

select_population = (parents, children) ->
    temp = []
    for i in [0...parents.length]
      temp.push(if children[i]['cost'] <= parents[i]['cost'] then children[i] else parents[i])
    temp

search = (max_gens, search_space, pop_size, f, cr) ->
    pop = []
    for i in [0...pop_size]
      pop.push vector: random_vector(search_space)
      pop[i]['cost'] = objective_function pop[i]['vector']

    pop.sort (a, b) ->
        a['cost'] - b['cost']
    best = pop[0]

    compareTo = (a, b) ->
      a['cost'] - b['cost']

    for gen in [0...max_gens]
      children = create_children pop, search_space, f, cr
      for j in [0...children.length]
        c = children[j]
        c['cost'] = objective_function c['vector']
        pop = select_population pop, children
        pop.sort compareTo
        best = pop[0] if pop[0]['cost'] < best['cost']
      console.log "> gen #" + (gen+1) + ", fitness=" + best['cost']
    best

run = () ->
  # problem configuration
  problem_size = 3
  search_space = generate_array [-5, 5], problem_size
  #  algorithm configuration
  max_gens = 200
  pop_size = 10 * problem_size
  weightf = 0.8
  crossf = 0.9
  #  execute the algorithm
  best = search max_gens, search_space, pop_size, weightf, crossf
  console.log "Done. Best Solution: " + util.inspect(best)


exports.objective_function = objective_function
exports.random_vector = random_vector
exports.generate_array = generate_array
exports.de_rand_1_bin = de_rand_1_bin
exports.select_parents = select_parents
exports.create_children = create_children
exports.select_population = select_population
exports.randInt = randInt
exports.search = search
exports.run = run
