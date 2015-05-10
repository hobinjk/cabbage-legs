/* @flow weak */

var renderer = null;
var frameWidth = 30;
var frameHeight = 30;

var currentFrameX = 0;
var currentFrameY = 0;

var alphaX = 0.04;
var alphaY = 0.007;

var robots = [];
var terrain = null;

function startLinkages() {
  renderer = new p2.WebGLRenderer(function() {
    var world = new p2.World({
      gravity: [0, -10],
      broadphase: new p2.SAPBroadphase()
    });

    this.setWorld(world);

    world.defaultContactMaterial.friction = 500;

    terrain = new Terrain(world, -10, 0);

    for (var i = 0; i < 3; i++) {
      // baseWidth, baseHeight, baseAngle, driverLength, topSpindlyLength,
      // bottomSpindlyLength, middleSpindlyLength, legLength
      var klannGenome = new KlannGenome(2.5, 2, Math.PI / 6 + 0.12 * i,
                                        1.8, 1.8 + 0.4, 0.9, 3.25, 5.5);

      robots[i] = new Robot(world, 5, 12, 3, 2, klannGenome, klannGenome);
    }

    updateFrame(this);

    this.frame(0, 0, frameWidth, frameHeight);
  }, {
    hideGUI: true
  });
  // renderer.paused = true;
}

function smooth(oldVal, newVal, alpha) {
  return oldVal * (1 - alpha) + newVal * alpha;
}

function updateFrame(renderer) {
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
  if (maxX < currentFrameX) {
    maxX = currentFrameX;
  }
  currentFrameX = smooth(currentFrameX, maxX, alphaX);
  currentFrameY = smooth(currentFrameY, maxY, alphaY);

  terrain.update(maxX);

  renderer.frame(currentFrameX + frameWidth / 4, currentFrameY,
                 frameWidth, frameHeight);
  window.setTimeout(function() {
    updateFrame(renderer, robots);
  }, 33);
}

startLinkages();
