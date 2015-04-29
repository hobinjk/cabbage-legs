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
