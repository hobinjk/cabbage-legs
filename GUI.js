function GUI(parentElement, world, terrain, population) {
  this.parentElement = parentElement;
  this.world = world;
  this.terrain = terrain;
  this.population = population;

  this.eliteClonesElement = new NumberInput(0, population.robotCount,
                                            population, 'eliteClones', true);
  this.mutationRateElement = new NumberInput(0, 1, population, 'mutationRate',
                                             false);
  this.extremeMutationRateElement = new NumberInput(0, 1, population,
                                                    'extremeMutationRate',
                                                    false);
  this.extremeMutationChanceElement = new NumberInput(0, 1, population,
                                                     'extremeMutationChance',
                                                     false);

  this.parentElement.classList.add('gui');

  this.eliteClonesElement.add(this.parentElement);
  this.mutationRateElement.add(this.parentElement);
  this.extremeMutationRateElement.add(this.parentElement);
  this.extremeMutationChanceElement.add(this.parentElement);

  this.graphContainerChart = c3.generate({
    bindto: '#gui-graph-container',
    data: {
      columns: [
        ['best distance', 0],
        ['average distance', 0]
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
    averageX += deadRobots[0].maxX / deadRobots.length;
  }

  this.bestDistances.push(maxX);
  this.averageDistances.push(averageX);

  var bestDistanceColumn = ['best distance'].concat(this.bestDistances);
  var averageDistanceColumn = ['average distance']
                                  .concat(this.averageDistances);

  this.graphContainerChart.load({
    columns: [
      bestDistanceColumn,
      averageDistanceColumn
    ]
  });
};
