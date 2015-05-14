/**
 * Create RobotGenome
 * @constructor
 * @param {number} chassisLength
 * @param {number} chassisWidth
 * @param {number} hue
 * @param {KlannGenome} frontGenome
 * @param {KlannGenome} rearGenome
 */
function RobotGenome(chassisLength, chassisWidth, hue, frontGenome,
                     rearGenome) {
  this.chassisLength = chassisLength;
  this.chassisWidth = chassisWidth;
  this.hue = hue;
  this.frontGenome = frontGenome;
  this.rearGenome = rearGenome;
}

/**
 * @param {Function} mutator
 * @return {RobotGenome} Single-parent mutated genome
 */
RobotGenome.prototype.mutateWith = function(mutator) {
  var newHue = this.hue + (mutator(400) - 400);
  newHue = newHue % 360;

  return new RobotGenome(
      mutator(this.chassisLength),
      mutator(this.chassisWidth),
      newHue,
      this.frontGenome.mutateWith(mutator),
      this.rearGenome.mutateWith(mutator)
  );
};
