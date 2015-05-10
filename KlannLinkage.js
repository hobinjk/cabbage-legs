/* @flow weak */

/**
 * @constructor
 * @param {p2.World} world
 * @param {number} x
 * @param {number} y
 * @param {KlannGenome} genome
 * @param {Boolean} mirror
 */
function KlannLinkage(world, x, y, genome, mirror) {
  this.world = world;
  this.offsetX = x;
  this.offsetY = y;
  this.stickWidth = 0.2;

  this.baseShape = new p2.Rectangle(genome.baseWidth, genome.baseHeight);
  this.driverShape = new p2.Rectangle(genome.driverLength, this.stickWidth);
  this.topSpindlyShape = new p2.Rectangle(genome.topSpindlyLength,
                                          this.stickWidth);
  this.bottomSpindlyShape = new p2.Rectangle(genome.bottomSpindlyLength,
                                             this.stickWidth);
  this.middleSpindlyShape = new p2.Rectangle(genome.middleSpindlyLength,
                                             this.stickWidth);
  this.legShape = new p2.Rectangle(genome.legLength, this.stickWidth);

  this.mirror = mirror;
}

/**
 * Add a rectangle with bottom left corner at (x, y) with angle
 * @param {p2.Rectangle} rectangle
 * @param {number} x
 * @param {number} y
 * @param {number} angle - Angle in radians
 * @return {p2.Body}
 */
KlannLinkage.prototype.addRectangle = function(rectangle, x, y, angle) {
  var body = null;
  if (!this.mirror) {
    body = new p2.Body({
      mass: rectangle.width * rectangle.height / 2000,
      position: [this.offsetX + x, this.offsetY + y],
      angle: angle
    });
  } else {
    body = new p2.Body({
      mass: rectangle.width * rectangle.height / 2000,
      position: [this.offsetX - x,
                 this.offsetY + y],
      angle: Math.PI - angle
    });
  }
  body.addShape(rectangle);
  this.world.addBody(body);

  return body;
};

/**
 * Add a pin between two bodies
 * @param {p2.Body} bodyA
 * @param {p2.Body} bodyB
 * @param {Array<number>} localPivotA
 * @param {Array<number>} localPivotB
 */
KlannLinkage.prototype.addPin = function(bodyA, bodyB, localPivotA,
                                         localPivotB) {
  var constraint = new p2.RevoluteConstraint(bodyA, bodyB, {
    localPivotA: localPivotA,
    localPivotB: localPivotB,
    collideConnected: false
  });
  constraint.setStiffness(1e12);
  constraint.setRelaxation(2);
  this.world.addConstraint(constraint);
};

/**
 * Add a rectangle centered at (x, y) with angle
 * @param {p2.Rectangle} rectangle
 * @param {number} x
 * @param {number} y
 * @param {number} angle - Angle in radians
 * @return {p2.Body}
 */
KlannLinkage.prototype.addCenteredRectangle = function(rectangle, x, y, angle) {
  var rotatedX = x + Math.cos(angle) * rectangle.width / 2 -
                      Math.sin(angle) * rectangle.height / 2;
  var rotatedY = y + Math.sin(angle) * rectangle.width / 2 +
                    Math.cos(angle) * rectangle.height / 2;
  return this.addRectangle(rectangle, rotatedX, rotatedY, angle);
};

/**
 * Add a linkage
 * @return {Map<String, p2.Body} Map from string to created bodies
 */
KlannLinkage.prototype.addLinkage = function() {
  var bodies = {};

  this.topSpindlyShape.collisionGroup = CONTACT_CHASSIS;
  this.topSpindlyShape.collisionMask = GROUND;
  bodies.topSpindlyBody = this.addCenteredRectangle(
                                this.topSpindlyShape,
                                2.5, 1 + this.topSpindlyShape.height / 2,
                                Math.PI / 2);

  this.bottomSpindlyShape.collisionGroup = CONTACT_CHASSIS;
  this.bottomSpindlyShape.collisionMask = GROUND;
  bodies.bottomSpindlyBody = this.addRectangle(
                                this.bottomSpindlyShape,
                                2.5 + this.bottomSpindlyShape.width / 2, -1, 0);

  this.legShape.collisionGroup = CONTACT_LEG;
  this.legShape.collisionMask = GROUND;
  bodies.bigLegBody = this.addCenteredRectangle(this.legShape, 3.5, 1,
                                             -Math.PI / 3);

  this.middleSpindlyShape.collisionGroup = CONTACT_CHASSIS;
  this.middleSpindlyShape.collisionMask = GROUND;
  bodies.middleSpindlyBody = this.addCenteredRectangle(this.middleSpindlyShape,
                                           1, 0, -Math.PI / 7);

  if (!this.mirror) {
    this.addPin(this.baseBody, bodies.topSpindlyBody,
           [this.baseShape.width / 2, this.baseShape.height / 2],
           [-this.topSpindlyShape.width / 2, 0]);

    this.addPin(this.baseBody, bodies.bottomSpindlyBody,
           [this.baseShape.width / 2, -this.baseShape.height / 2],
           [-this.bottomSpindlyShape.width / 2, 0]);
  } else {
    this.addPin(this.baseBody, bodies.topSpindlyBody,
           [-this.baseShape.width / 2, this.baseShape.height / 2],
           [-this.topSpindlyShape.width / 2, 0]);

    this.addPin(this.baseBody, bodies.bottomSpindlyBody,
           [-this.baseShape.width / 2, -this.baseShape.height / 2],
           [-this.bottomSpindlyShape.width / 2, 0]);
  }

  this.addPin(bodies.topSpindlyBody, bodies.bigLegBody,
         [this.topSpindlyShape.width / 2, 0],
         [-this.legShape.width / 2, 0]);

  this.addPin(bodies.bottomSpindlyBody, bodies.middleSpindlyBody,
         [this.bottomSpindlyShape.width / 2, 0],
         [this.middleSpindlyShape.width / 6, 0]);

  this.addPin(bodies.middleSpindlyBody, bodies.bigLegBody,
         [this.middleSpindlyShape.width / 2, 0],
         [-this.legShape.width / 6, this.legShape.height / 2]);

  return bodies;
};

/**
 * Place the klann linkage in the world.
 */
KlannLinkage.prototype.add = function() {
  this.baseShape.collisionMask = GROUND;
  this.baseBody = this.addRectangle(this.baseShape,
                                    this.baseShape.width / 2, 0, 0);

  this.driverShape.collisionMask = GROUND;
  this.driverBody = this.addRectangle(this.driverShape,
                                 0,
                                 -this.driverShape.height / 2, 0);
  var driverMotorX = -this.baseShape.width / 2;
  if (this.mirror) {
    driverMotorX = this.baseShape.width / 2;
  }
  this.driverMotor = new p2.RevoluteConstraint(this.driverBody, this.baseBody, {
    localPivotA: [0, 0],
    localPivotB: [driverMotorX, 0],
    collideConnected: false,
    maxForce: 10000000
  });

  this.driverMotor.setStiffness(1e12);
  this.driverMotor.setRelaxation(3);
  this.driverMotor.enableMotor();
  this.driverMotor.setMotorSpeed(8);

  this.world.addConstraint(this.driverMotor);

  var leftBodies = this.addLinkage();
  var rightBodies = this.addLinkage();

  this.addPin(this.driverBody, leftBodies.middleSpindlyBody,
         [this.driverShape.width / 2, 0],
         [-this.middleSpindlyShape.width / 2, 0]);

  this.addPin(this.driverBody, rightBodies.middleSpindlyBody,
         [-this.driverShape.width / 2, 0],
         [-this.middleSpindlyShape.width / 2, 0]);
};
