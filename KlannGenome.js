/**
 * @constructor
 * @param {number} baseWidth
 * @param {number} baseHeight
 * @param {number} baseAngle
 * @param {number} driverLength
 * @param {number} topSpindlyLength
 * @param {number} bottomSpindlyLength
 * @param {number} middleSpindlyLength
 * @param {number} legLength
 */
function KlannGenome(baseWidth, baseHeight, baseAngle, driverLength,
                     topSpindlyLength, bottomSpindlyLength,
                     middleSpindlyLength, legLength) {
  this.baseWidth = baseWidth;
  this.baseHeight = baseHeight;
  this.baseAngle = baseAngle;
  this.driverLength = driverLength;
  this.topSpindlyLength = topSpindlyLength;
  this.bottomSpindlyLength = bottomSpindlyLength;
  this.middleSpindlyLength = middleSpindlyLength;
  this.legLength = legLength;
}

/**
 * @param {Function} mutator
 * @return {KlannGenome} Single-parent mutated genome
 */
KlannGenome.prototype.mutateWith = function(mutator) {
  return new KlannGenome(
    mutator(this.baseWidth),
    mutator(this.baseHeight),
    mutator(this.baseAngle),
    mutator(this.driverLength),
    mutator(this.topSpindlyLength),
    mutator(this.bottomSpindlyLength),
    mutator(this.middleSpindlyLength),
    mutator(this.legLength)
  );
};
