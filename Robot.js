function Robot(world, x, y, chassisLength, chassisWidth, frontGenome,
               rearGenome) {
  this.x = x;
  this.y = y;
  this.world = world;

  var chassisShape = new p2.Rectangle(chassisLength, chassisWidth);
  chassisShape.collisionMask = GROUND;
  this.chassis = new p2.Body({
    mass: chassisShape.width * chassisShape.height / 3000,
    position: [this.x, this.y]
  });

  this.chassis.addShape(chassisShape);
  this.world.addBody(this.chassis);

  var frontLinkage = new KlannLinkage(this.world,
                                      this.x + chassisLength / 2,
                                      this.y,
                                      frontGenome,
                                      false);
  frontLinkage.add();

  var rearLinkage = new KlannLinkage(this.world,
                                     this.x - rearGenome.baseWidth -
                                              chassisLength / 2,
                                     this.y,
                                     rearGenome,
                                     true);
  rearLinkage.add();

  var frontConstraint = new p2.LockConstraint(
      this.chassis,
      frontLinkage.baseBody,
      {localAngleB: frontGenome.baseAngle}
  );

  var rearConstraint = new p2.LockConstraint(
      this.chassis,
      rearLinkage.baseBody,
      {localAngleB: rearGenome.baseAngle}
  );

  this.world.addConstraint(frontConstraint);
  this.world.addConstraint(rearConstraint);
}
