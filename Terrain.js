/**
 * @constructor
 * @param {p2.World} world
 * @param {number} x - starting x coordinate
 * @param {number} y - starting y coordinate
 */
function Terrain(world, x, y) {
  this.world = world;
  this.lastX = x;
  this.lastY = y;

  this.minBlockWidth = 5;
  this.maxBlockWidth = 8;
  this.anglePerX = Math.PI / 400;
  this.maxAngle = Math.PI / 3;
  this.windowSize = 50;
  this.blockHeight = 2;
}

/**
 * @param {number} x - new maximum x value to grow for
 */
Terrain.prototype.update = function(x) {
  while (x + this.windowSize > this.lastX) {
    var blockWidth = this.randIn(this.minBlockWidth, this.maxBlockWidth);
    var maxAngle = this.lastX * this.anglePerX;
    if (maxAngle > this.maxAngle) {
      maxAngle = this.maxAngle;
    }
    var blockAngle = this.randIn(-maxAngle, maxAngle);
    var blockShape = new p2.Rectangle(blockWidth, this.blockHeight);
    blockShape.collisionGroup = GROUND;
    blockShape.collisionMask = CONTACT_LEG | CONTACT_CHASSIS;

    var blockOffsetX = Math.cos(blockAngle) * blockWidth;
    var blockOffsetY = Math.sin(blockAngle) * blockWidth;

    var blockBody = new p2.Body({
      mass: 0,
      position: [this.lastX + blockOffsetX / 2, this.lastY + blockOffsetY / 2],
      angle: blockAngle
    });
    this.lastX = this.lastX + blockOffsetX;
    this.lastY = this.lastY + blockOffsetY;
    blockBody.addShape(blockShape);
    this.world.addBody(blockBody);
  }
};

/**
 * @param {number} min
 * @param {number} max
 * @return {number} A random number between min and max
 */
Terrain.prototype.randIn = function(min, max) {
  return Math.random() * (max - min) + min;
};
