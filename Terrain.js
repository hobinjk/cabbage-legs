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
  this.lastBlockAngle = 0;

  this.startX = x;
  this.startY = y;

  this.minBlockWidth = 5;
  this.maxBlockWidth = 8;
  this.anglePerX = Math.PI / 400;
  this.maxAngle = Math.PI / 3;
  this.windowSize = 50;
  this.blockHeight = 2;

  this.blockBodies = [];
  this.onUpdate = null;
}

/**
 * @param {number} x - new maximum x value to grow for
 */
Terrain.prototype.update = function(x) {
  var changed = false;

  while (x + this.windowSize > this.lastX) {
    changed = true;
    var blockWidth = this.randIn(this.minBlockWidth, this.maxBlockWidth);
    var maxAngle = this.lastX * this.anglePerX;
    if (maxAngle > this.maxAngle) {
      maxAngle = this.maxAngle;
    }
    var blockAngle = this.randIn(-maxAngle, maxAngle);
    var blockShape = new p2.Rectangle(blockWidth, this.blockHeight);
    blockShape.collisionGroup = GROUND;
    blockShape.collisionMask = CONTACT_LEG | CONTACT_BASE |
                               CONTACT_TOP_SPINDLY | CONTACT_ROBOT;

    var coveringWidth = 0;
    if (blockAngle - this.lastBlockAngle > 0) {
      coveringWidth = blockWidth / 4;
    }

    blockShape.width += coveringWidth;

    var cosAngle = Math.cos(blockAngle);
    var sinAngle = Math.sin(blockAngle);

    var baseOffsetX = cosAngle * blockWidth;
    var midOffsetX = (baseOffsetX - cosAngle * coveringWidth +
                      sinAngle * this.blockHeight) / 2;
    var baseOffsetY = sinAngle * blockWidth;
    var midOffsetY = (baseOffsetY - sinAngle * coveringWidth -
                      cosAngle * this.blockHeight) / 2;

    var blockBody = new p2.Body({
      mass: 0,
      position: [this.lastX + midOffsetX, this.lastY + midOffsetY],
      angle: blockAngle
    });
    this.lastX = this.lastX + baseOffsetX;
    this.lastY = this.lastY + baseOffsetY;
    this.lastBlockAngle = blockAngle;

    blockBody.addShape(blockShape);
    this.world.addBody(blockBody);
    this.blockBodies.push(blockBody);
  }

  if (changed && this.onUpdate) {
    this.onUpdate();
  }
};

/**
 * Regenerate all terrain
 */
Terrain.prototype.regenerate = function() {
  for (var i = 0; i < this.blockBodies.length; i++) {
    this.world.removeBody(this.blockBodies[i]);
  }
  this.blockBodies = [];
  this.lastX = this.startX;
  this.lastY = this.startY;

  this.update(50);
};

/**
 * @param {number} min
 * @param {number} max
 * @return {number} A random number between min and max
 */
Terrain.prototype.randIn = function(min, max) {
  return Math.random() * (max - min) + min;
};
