function Robot(world, x, y, chassisLength, chassisWidth, frontGenome,
               rearGenome) {
  this.x = x;
  this.y = y;
  this.world = world;

  this.chassisLength = chassisLength;
  this.chassisWidth = chassisWidth;

  this.frontGenome = frontGenome;
  this.rearGenome = rearGenome;
}

/**
 * Add the robot to the world
 */
Robot.prototype.add = function() {
  var chassisShape = new p2.Rectangle(this.chassisLength, this.chassisWidth);
  chassisShape.collisionGroup = CONTACT_CHASSIS;
  chassisShape.collisionMask = GROUND;

  this.chassis = new p2.Body({
    mass: chassisShape.width * chassisShape.height / 3000,
    position: [this.x, this.y]
  });

  this.chassis.addShape(chassisShape);
  this.world.addBody(this.chassis);

  this.frontLinkage = new KlannLinkage(this.world,
                                      this.x + this.chassisLength / 2,
                                      this.y,
                                      this.frontGenome,
                                      false);
  this.frontLinkage.add();

  this.rearLinkage = new KlannLinkage(this.world,
                                     this.x - this.chassisLength / 2,
                                     this.y,
                                     this.rearGenome,
                                     true);
  this.rearLinkage.add();

  this.frontConstraint = new p2.LockConstraint(
      this.chassis,
      this.frontLinkage.baseBody,
      {localAngleB: this.frontGenome.baseAngle}
  );

  this.rearConstraint = new p2.LockConstraint(
      this.chassis,
      this.rearLinkage.baseBody,
      {localAngleB: -this.rearGenome.baseAngle}
  );

  this.driverConstraint = new p2.GearConstraint(
      this.frontLinkage.driverBody,
      this.rearLinkage.driverBody
  );

  this.world.addConstraint(this.frontConstraint);
  this.world.addConstraint(this.rearConstraint);
  this.world.addConstraint(this.driverConstraint);
};

/**
 * Remove the Robot from the world
 */
Robot.prototype.remove = function() {
  this.rearLinkage.remove();
  this.frontLinkage.remove();

  this.world.removeConstraint(this.frontConstraint);
  this.world.removeConstraint(this.rearConstraint);
  this.world.removeConstraint(this.driverConstraint);

  this.world.removeBody(this.chassis);
};
