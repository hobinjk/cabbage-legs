function Robot(world, x, y, genome) {
  this.x = x;
  this.maxX = x;
  this.y = y;
  this.world = world;

  this.genome = genome;

  this.chassisLength = genome.chassisLength;
  this.chassisWidth = genome.chassisWidth;

  this.frontGenome = genome.frontGenome;
  this.rearGenome = genome.rearGenome;

  this.lastMovement = Date.now();
  this.alive = true;
  this.deathTime = 8000;

  // this.color = ColorUtils.fromHue(this.genome.hue);
  this.color = ColorUtils.randomPastel();

  this.add();
}

/**
 * Add the robot to the world
 */
Robot.prototype.add = function() {
  var chassisShape = new p2.Rectangle(this.chassisLength, this.chassisWidth);
  chassisShape.collisionGroup = CONTACT_ROBOT;
  chassisShape.collisionMask = GROUND;

  this.chassis = new p2.Body({
    mass: chassisShape.width * chassisShape.height / 3000,
    position: [this.x, this.y]
  });

  this.chassis.color = this.color;

  this.chassis.addShape(chassisShape);
  this.world.addBody(this.chassis);

  this.frontLinkage = new KlannLinkage(this.world,
                                      this.x + this.chassisLength / 2,
                                      this.y,
                                      this.color,
                                      this.frontGenome,
                                      false);
  this.frontLinkage.add();

  this.rearLinkage = new KlannLinkage(this.world,
                                     this.x - this.chassisLength / 2,
                                     this.y,
                                     this.color,
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

/**
 * Update the Robot's simulation
 */
Robot.prototype.update = function() {
  if (!this.alive) {
    return;
  }

  this.x = this.chassis.position[0];
  this.y = this.chassis.position[1];

  if (this.maxX + 0.2 < this.x) {
    this.maxX = this.x;
    this.lastMovement = Date.now();
  }

  if (this.lastMovement + this.deathTime < Date.now()) {
    this.die();
  }
};

/**
 * Murder the robot
 */
Robot.prototype.die = function() {
  this.remove();
  this.alive = false;
};
