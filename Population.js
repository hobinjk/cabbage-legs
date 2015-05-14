/**
 * @constructor
 * @param {p2.World} world
 * @param {number} robotCount
 * @param {number} eliteClones
 * @param {number} startX
 * @param {number} startY
 */
function Population(world, robotCount, eliteClones,
                    startX, startY) {
  this.world = world;
  this.startX = startX;
  this.startY = startY;
  this.eliteClones = eliteClones;
  this.robotCount = robotCount;

  this.baseMutationRate = 0.02;
  this.mutationChance = 0.4;
  this.mutationRate = 0.1;
  this.extremeMutationRate = 0.7;
  this.extremeMutationChance = 0;

  this.crossoverRate = 0.2;
  this.selfCrossoverRate = 0.1;

  this.robots = [];
}

/**
 * Synthesize a new population from scratch
 * @param {RobotGenome} baseGenome
 * @return {Array<Robot>}
 */
Population.prototype.synthesize = function(baseGenome) {
  this.robots = [];
  for (var i = 0; i < this.robotCount; i++) {
    var robotGenome = this.mutateRobotGenome(baseGenome);
    this.robots.push(
        new Robot(this.world, this.startX, this.startY, robotGenome));
  }
  return this.robots;
};

/**
 * Spawn a new population of robots based on the old one
 * @param {Array<Robot>} deadRobots
 * @return {Array<Robot>}
 */
Population.prototype.spawn = function(deadRobots) {
  deadRobots = deadRobots.sort(function(robotA, robotB) {
    return robotB.maxX - robotA.maxX;
  });
  var eliteRobots = deadRobots.slice(0, this.eliteClones);

  function getRandomElite() {
    return eliteRobots[Math.floor(Math.random() *
                                  eliteRobots.length)];
  }

  this.robots = [];
  for (var i = 0; i < this.eliteClones; i++) {
    var robotGenome = eliteRobots[i].genome;
    var newRobot = new Robot(this.world, this.startX, this.startY, robotGenome);
    this.robots.push(newRobot);
  }

  for (var i = this.eliteClones; i < this.robotCount; i++) {
    var randomElite = getRandomElite();
    var robotGenome = this.mutateRobotGenome(randomElite.genome);

    if (Math.random() < this.selfCrossoverRate) {
      if (Math.random() < 0.5) {
        robotGenome.frontGenome = robotGenome.rearGenome;
      } else {
        robotGenome.rearGenome = robotGenome.frontGenome;
      }
    }

    if (Math.random() < this.crossoverRate) {
      var otherRandomElite = getRandomElite();
      var otherRobotGenome = this.mutateRobotGenome(otherRandomElite.genome);
      if (Math.random() < 0.5) {
        robotGenome.frontGenome = otherRobotGenome.frontGenome;
      } else {
        robotGenome.rearGenome = otherRobotGenome.rearGenome;
      }
    }

    var newRobot = new Robot(this.world, this.startX, this.startY, robotGenome);
    this.robots.push(newRobot);
  }
  return this.robots;
};

/**
 * @param {RobotGenome} robotGenome  original genome
 * @return {RobotGenome} Single-parent mutated genome
 */
Population.prototype.mutateRobotGenome = function(robotGenome) {
  var newGenome = robotGenome.mutateWith(function(value) {
    return this.mutate(value);
  }.bind(this));
  return newGenome;
};

/**
 * @param {number} value - Original value
 * @return {number} Mutated value
 */
Population.prototype.mutate = function(value) {
  var mutationRate = this.baseMutationRate;
  if (Math.random() < this.mutationChance) {
    mutationRate = this.mutationRate;
  }
  if (Math.random() < this.extremeMutationChance) {
    mutationRate = this.extremeMutationRate;
  }
  var mutationFactor = 1 + (Math.random() - 0.5) * 2 * mutationRate;
  return value * mutationFactor;
};
