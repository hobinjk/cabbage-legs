/* @flow weak */

var renderer = null;
var frameWidth = 30;
var frameHeight = 20;

var currentFrameX = 0;
var currentFrameY = 0;

var alphaX = 0.04;
var alphaY = 0.01;

var robots = [];
var terrain = null;
var population = null;
var gui = null;

function startLinkages() {
  renderer = new p2.WebGLRenderer(function() {
    var world = new p2.World({
      gravity: [0, -10],
      broadphase: new p2.SAPBroadphase()
    });

    this.setWorld(world);

    world.defaultContactMaterial.friction = 1000;

    terrain = new Terrain(world, -10, 0);
    population = new Population(world, 8, 1, 5, 7);

    var guiParent = document.getElementById('gui-parent');
    gui = new GUI(guiParent, world, terrain, population);

    // baseWidth, baseHeight, baseAngle, driverLength, topSpindlyLength,
    // bottomSpindlyLength, middleSpindlyLength, legLength
    var klannGenome = new KlannGenome(2.5, 2, Math.PI / 6 + 0.3,
                                      1.8, 1.8 + 0.4, 0.9, 3.25, 5.5, 1 / 3);
    var baseRobotGenome = new RobotGenome(3, 2, 40, klannGenome, klannGenome);
    robots = population.synthesize(baseRobotGenome);

    terrain.update(50);

    updateFrame(this);
    addHackyResizer();

    this.frame(0, 0, frameWidth, frameHeight);
  }, {
    hideGUI: true
  });
  // renderer.paused = true;
  updateRendererDimensions();
}

function smooth(oldVal, newVal, alphaBase) {
  if (isNaN(oldVal)) {
    return newVal;
  }
  var alpha = alphaBase * Math.max(Math.abs((oldVal - newVal) / 4), 1);
  return oldVal * (1 - alpha) + newVal * alpha;
}

function updateFrame(renderer) {
  var maxX = 0;
  var maxY = 0;

  var anyAlive = false;
  for (var i = 0; i < robots.length; i++) {
    robots[i].update();

    if (!robots[i].alive) {
      continue;
    }

    var robotX = robots[i].maxX;
    var robotY = robots[i].y;
    if (robotX > maxX) {
      maxX = robotX;
      maxY = robotY;
    }

    anyAlive = true;
  }

  currentFrameX = smooth(currentFrameX, maxX, alphaX);
  currentFrameY = smooth(currentFrameY, maxY, alphaY);

  terrain.update(maxX);

  renderer.frame(currentFrameX + frameWidth / 8, currentFrameY,
                 frameWidth, frameHeight);

  if (!anyAlive) {
    gui.addGenerationResults(robots);

    robots = population.spawn(robots);
  }
  window.requestAnimationFrame(function() {
    updateFrame(renderer, robots);
  });
}

function updateRendererDimensions() {
  if (!renderer) {
    return;
  }
  var width = window.innerWidth;
  var height = window.innerHeight * 3 / 5;
  var dpr = window.devicePixelRatio || 1;

  renderer.resize(width * dpr, height * dpr);
}

function addHackyResizer() {
  window.addEventListener('resize', updateRendererDimensions);
}

startLinkages();
