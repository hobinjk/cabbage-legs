/**
 * @constructor
 * @param {p2.World} world
 * @param {number} mutationRate
 * @param {number} eliteClones
 * @param {number} startX
 * @param {number} startY
 */
function Population(world, mutationRate, eliteClones, startX, startY) {
  this.world = world;
  this.mutationRate = mutationRate;
  this.startX = startX;
  this.startY = startY;
  this.eliteClones = eliteClones;
}

/**
 * Synthesize a new population from scratch
 * @param {RobotGenome} baseGenome
 * @param {number} robotCount
 * @return {Array<Robot>}
 */
Population.prototype.synthesize = function(baseGenome, robotCount) {
  var robots = [];
  for (var i = 0; i < robotCount; i++) {
    var robotGenome = this.mutateRobotGenome(baseGenome);
    robots.push(new Robot(this.world, this.startX, this.startY, robotGenome));
  }
  return robots;
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
  var bestRobot = deadRobots[0];
  var robots = [];
  for (var i = 0; i < this.eliteClones; i++) {
    var robotGenome = deadRobots[i].genome;
    var newRobot = new Robot(this.world, this.startX, this.startY, robotGenome);
    robots.push(newRobot);
  }

  for (var i = this.eliteClones; i < deadRobots.length; i++) {
    var robotGenome = this.mutateRobotGenome(bestRobot.genome);
    var newRobot = new Robot(this.world, this.startX, this.startY, robotGenome);
    robots.push(newRobot);
  }
  return robots;
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
  var mutationFactor = 1 + (Math.random() - 0.5) * 2 * this.mutationRate;
  return value * mutationFactor;
};
