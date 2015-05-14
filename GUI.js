function GUI(parentElement, world, terrain, population) {
  this.parentElement = parentElement;
  this.world = world;
  this.terrain = terrain;
  this.terrain.onUpdate = this.onTerrainUpdate.bind(this);

  this.population = population;

  this.eliteClonesElement = new NumberInput('Elite/breeding clones', 0,
                                            4,
                                            population, 'eliteClones', true);
  this.baseMutationRateElement = new NumberInput('Base mutation rate', 0, 1,
                                                 population,
                                                 'baseMutationRate', false);
  this.mutationChanceElement = new NumberInput('Chance of simple mutation', 0,
                                               1, population, 'mutationChance',
                                               false);
  this.mutationRateElement = new NumberInput('Simple mutation rate', 0, 1,
                                             population, 'mutationRate',
                                             false);
  this.extremeMutationRateElement = new NumberInput('Extreme mutation rate', 0,
                                                    1, population,
                                                    'extremeMutationRate',
                                                    false);
  this.crossoverRateElement = new NumberInput('Crossover rate', 0, 1,
                                              population, 'crossoverRate',
                                              false);
  this.selfCrossoverRateElement = new NumberInput('Self crossover rate', 0, 1,
                                                  population,
                                                  'selfCrossoverRate', false);

  this.extremeMutationChanceElement = new NumberInput(
      'Chance of extreme mutation', 0, 1, population, 'extremeMutationChance',
      false);

  this.robotCountElement = new NumberInput('Robot count', 5, 20, population,
                                           'robotCount', true);

  this.regenerateTerrainElement = document.createElement('input');
  this.regenerateTerrainElement.type = 'button';
  this.regenerateTerrainElement.value = 'Regenerate Terrain';
  this.regenerateTerrainElement.addEventListener('click', function() {
    terrain.regenerate();
  });

  this.killAllRobotsElement = document.createElement('input');
  this.killAllRobotsElement.type = 'button';
  this.killAllRobotsElement.value = 'Kill All Robots';
  this.killAllRobotsElement.addEventListener('click', function() {
    var robots = population.robots;
    for (var i = 0; i < robots.length; i++) {
      robots[i].die();
    }
  });

  this.parentElement.classList.add('gui');

  var numberInputContainer = document.createElement('table');
  numberInputContainer.classList.add('number-input-container');

  this.robotCountElement.add(numberInputContainer);
  this.eliteClonesElement.add(numberInputContainer);
  this.baseMutationRateElement.add(numberInputContainer);
  this.mutationRateElement.add(numberInputContainer);
  this.mutationChanceElement.add(numberInputContainer);
  this.extremeMutationRateElement.add(numberInputContainer);
  this.extremeMutationChanceElement.add(numberInputContainer);
  this.crossoverRateElement.add(numberInputContainer);
  this.selfCrossoverRateElement.add(numberInputContainer);

  this.parentElement.appendChild(numberInputContainer);
  this.parentElement.appendChild(this.regenerateTerrainElement);
  this.parentElement.appendChild(this.killAllRobotsElement);

  this.distanceGraphContainer = c3.generate({
    bindto: '#distance-graph-container',
    data: {
      columns: [
        ['best distance', 0],
        ['average distance', 0]
      ]
    }
  });

  this.terrainGraphContainer = c3.generate({
    bindto: '#terrain-graph-container',
    data: {
      xs: {
        'terrain': 'x'
      },
      columns: [
        ['terrain', 0],
        ['x', 0]
      ]
    }
  });

  this.bestDistances = [];
  this.averageDistances = [];

  document.body.appendChild(this.parentElement);
}

/**
 * Updates chart for new data
 * @param {Array<Robot>} deadRobots
 */
GUI.prototype.addGenerationResults = function(deadRobots) {
  deadRobots = deadRobots.sort(function(robotA, robotB) {
    return robotB.maxX - robotA.maxX;
  });
  var maxX = deadRobots[0].maxX;
  var averageX = 0;
  for (var i = 0; i < deadRobots.length; i++) {
    averageX += deadRobots[i].maxX / deadRobots.length;
  }

  this.bestDistances.push(maxX);
  this.averageDistances.push(averageX);

  var bestDistanceColumn = ['best distance'].concat(this.bestDistances);
  var averageDistanceColumn = ['average distance']
                                  .concat(this.averageDistances);

  this.distanceGraphContainer.load({
    columns: [
      bestDistanceColumn,
      averageDistanceColumn
    ]
  });
};

/**
 * Called by terrain when terrain is updated
 */
GUI.prototype.onTerrainUpdate = function() {
  var ys = ['terrain'];
  var xs = ['x'];

  for (var i = 0; i < this.terrain.blockBodies.length; i++) {
    var position = this.terrain.blockBodies[i].position;
    xs.push(position[0]);
    ys.push(position[1]);
  }

  this.terrainGraphContainer.load({
    xs: {
      'terrain': 'x'
    },
    columns: [
      xs,
      ys
    ]
  });
};
