function RobotGenome(chassisLength, chassisWidth, frontGenome, rearGenome) {
  this.chassisLength = chassisLength;
  this.chassisWidth = chassisWidth;
  this.frontGenome = frontGenome;
  this.rearGenome = rearGenome;
}

/**
 * @param {Function} mutator
 * @return {RobotGenome} Single-parent mutated genome
 */
RobotGenome.prototype.mutateWith = function(mutator) {
  return new RobotGenome(
      mutator(this.chassisLength),
      mutator(this.chassisWidth),
      this.frontGenome.mutateWith(mutator),
      this.rearGenome.mutateWith(mutator)
  );
};
