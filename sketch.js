const {
  Engine,
  Render,
  Events,
  Vector,
  Runner,
  Bodies,
  Body,
  Composite,
  Composites,
  Constraint,
  World,
} = Matter;

var options = {
  colorMode: "rainbow",
  pendulumCount: 100,
  angleModifier: 500
};

function changeValue(property, value) {
  options[property] = value;
}

var randomRotation = 0.05;
// var randomRotation = ((0.25 + 0.1 * Math.random()) * options.angleModifier);

  // create an engine
var engine = Engine.create(),
  world = engine.world;

var render;
var runner;

function reset() {
  World.clear(world);
  Engine.clear(engine);
  Render.stop(render);
  Runner.stop(runner);
  render.canvas.remove();
  render.canvas = null;
  render.context = null;
  render.textures = {};
  init();
}

function init() {
  // create a renderer
  render = Render.create({
    element: document.getElementById('canvas'),
    engine: engine,
    options: {
      // background: '#fff',
      width: 800,
      height: 600,
      wireframes: false,
      showPerformance: true,
    },
  });

  // run the renderer
  Render.run(render);

  // create runner
  runner = Runner.create();

  // run the engine
  Runner.run(runner, engine);

  var group = Body.nextGroup(true),
    length = 200,
    width = 10;

  var pendulums = [];

  let colors = [
    {
      r: 255,
      g: 0,
      b: 0,
    },
    {
      r: 255,
      g: 255,
      b: 0,
    },
    {
      r: 0,
      g: 255,
      b: 0,
    },
    {
      r: 0,
      g: 255,
      b: 255,
    },
    {
      r: 0,
      g: 0,
      b: 255,
    },
    {
      r: 255,
      g: 0,
      b: 255,
    },
  ];

  function getColor(color, step, i) {
    var percentageOne = (i / options.pendulumCount) * options.pendulumCount;
    var stepPart = percentageOne / (options.pendulumCount / 6);

    let nextStep = step === colors.length - 1 ? step : step + 1;
    let returnValue;
    if (colors[step][color] === 255 && colors[nextStep][color] === 255) {
      returnValue = 255;
    }
    if (colors[step][color] === 255 && colors[nextStep][color] === 0) {
      returnValue = 255 - stepPart * 255;
    }
    if (colors[step][color] === 0 && colors[nextStep][color] === 255) {
      returnValue = stepPart * 255;
    }
    if (colors[step][color] === 0 && colors[nextStep][color] === 0) {
      returnValue = 0;
    }
    return returnValue;
  }

  function getColors(step, i) {
    let finalColor;

    switch (options.colorMode) {
      case "rainbow":
        let r = getColor("r", step, i);
        let g = getColor("g", step, i);
        let b = getColor("b", step, i);
        finalColor = `rgba(${r}, ${g}, ${b}, 0.2)`;
        break;
      case "white":
        finalColor = `rgba(255, 255, 255, .1)`;
        break;
      case "red":
        finalColor = `rgba(255, 0, 0, .1)`;
        break;
      case "random":
        finalColor = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${
          Math.random() * 255
        }, ${Math.random()})`;
        break;
    }
    return finalColor;
  }

  for (let j = 0; j < options.pendulumCount; j++) {
    var angle = j / options.angleModifier;
    var percentage = (j / options.pendulumCount) * options.pendulumCount;
    var step = Math.floor(percentage / (options.pendulumCount / 6));

    pendulums[j] = Composites.stack(350, 160, 2, 1, -20, 0, function (x, y) {
      return Bodies.rectangle(x, y, length, width, {
        collisionFilter: {
          group: -1,
          category: 2,
          mask: 0,
        },
        frictionAir: 0,
        chamfer: 5,
        render: {
          fillStyle: getColors(step, j),
        },
      });
    });

    Composites.chain(pendulums[j], 0.48, 0, -0.48, 0, {
      stiffness: 0.9,
      length: 0,
      angularStiffness: 0.7,
      render: {
        strokeStyle: `rgba(0, 0, 0, 0)`,
      },
    });

    Composite.add(
      pendulums[j],
      Constraint.create({
        bodyB: pendulums[j].bodies[0],
        pointB: { x: -length * 0.48, y: 0 },
        pointA: {
          x: pendulums[j].bodies[0].position.x - length * 0.42,
          y: pendulums[j].bodies[0].position.y,
        },
        stiffness: 0.9,
        length: 0,
        render: {
          strokeStyle: `rgba(0, 0, 0, 0)`,
        },
      })
    );

    var lowerArm = pendulums[j].bodies[1];

    Body.rotate(lowerArm, -Math.PI * (randomRotation - angle), {
      x: lowerArm.position.x - 00,
      y: lowerArm.position.y,
    });

    Composite.add(world, pendulums[j]);
  }
}

init();
