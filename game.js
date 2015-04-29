/* @flow weak */

var renderer = null;
var frameWidth = 30;
var frameHeight = 30;

var currentFrameX = 0;
var currentFrameY = 0;

function startLinkages() {
  renderer = new p2.WebGLRenderer(function() {
    var world = new p2.World({
      gravity: [0, -10],
      broadphase: new p2.SAPBroadphase()
    });

    this.setWorld(world);

    world.defaultContactMaterial.friction = 500;

    var planeShape = new p2.Plane();
    planeShape.collisionGroup = GROUND;
    planeShape.collisionMask = CONTACT_LEG;

    var planeBody = new p2.Body({
      mass: 0
    });
    planeBody.addShape(planeShape);
    world.addBody(planeBody);

    window.robots = [];
    for (var i = 0; i < 2; i++) {
      // baseWidth, baseHeight, baseAngle, driverLength, topSpindlyLength,
      // bottomSpindlyLength, middleSpindlyLength, legLength
      var klannGenome = new KlannGenome(2.5, 2, Math.PI / 6,
                                        1.8, 1.8, 0.9, 3.25, 5.5 - 0.5 * i);

      window.robots[i] = new Robot(world, 0, 6, 4, 2, klannGenome, klannGenome);
    }

    updateFrame(this, window.robots);

    this.frame(0, 0, frameWidth, frameHeight);
  }, {
    hideGUI: true
  });
  // renderer.paused = true;
}

function smooth(oldVal, newVal) {
  var alpha = 0.04;
  return oldVal * (1 - alpha) + newVal * alpha;
}

function updateFrame(renderer, robots) {
  var maxX = 0;
  var maxY = 0;
  for (var i = 0; i < robots.length; i++) {
    var robotX = robots[i].chassis.position[0];
    var robotY = robots[i].chassis.position[1];
    if (robotX > maxX) {
      maxX = robotX;
    }

    if (robotY > maxY) {
      maxY = robotY;
    }
  }
  currentFrameX = smooth(currentFrameX, maxX);
  currentFrameY = smooth(currentFrameY, maxY);

  renderer.frame(currentFrameX + frameWidth / 4, currentFrameY,
                 frameWidth, frameHeight);
  window.setTimeout(function() {
    updateFrame(renderer, robots);
  }, 33);
}

startLinkages();
