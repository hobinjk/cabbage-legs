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
 * @param {number} legAttachment - Attachment point of spindly to leg
 */
function KlannGenome(baseWidth, baseHeight, baseAngle, driverLength,
                     topSpindlyLength, bottomSpindlyLength,
                     middleSpindlyLength, legLength, legAttachment) {
  this.baseWidth = baseWidth;
  this.baseHeight = baseHeight;
  this.baseAngle = baseAngle;
  this.driverLength = driverLength;
  this.topSpindlyLength = topSpindlyLength;
  this.bottomSpindlyLength = bottomSpindlyLength;
  this.middleSpindlyLength = middleSpindlyLength;
  this.legLength = legLength;
  this.legAttachment = Math.min(legAttachment, 1);
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
    mutator(this.legLength),
    mutator(this.legAttachment)
  );
};
