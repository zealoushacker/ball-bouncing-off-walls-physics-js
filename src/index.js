var Physics = require('../vendor/physicsjs/physicsjs-full');

Physics(function(world){
  var viewWidth = 500;
  var viewHeight = 500;

  var renderer = Physics.renderer('canvas', {
    el: 'viewport',
    width: viewWidth,
    height: viewHeight,
    meta: false, // don't display meta data
    styles: {
        // set colors for the circle bodies
        'circle' : {
            strokeStyle: '#351024',
            lineWidth: 1,
            fillStyle: 'black',
            angleIndicator: '#351024'
        },
        'rectangle' : {
          fillStyle: '#ccc'
        }
    }
  });

  // add the renderer
  world.add( renderer );
  // render on each step
  world.on('step', function(){
    world.render();
  });

  // bounds of the window
  var viewportBounds = Physics.aabb(0, 0, viewWidth, viewHeight);

  // constrain objects to these bounds
  world.add(Physics.behavior('edge-collision-detection', {
      aabb: viewportBounds,
      restitution: 1,
      cof: 0
  }));

  // add a circle
  world.add(
      Physics.body('circle', {
        x: 250, // x-coordinate
        y: 480, // y-coordinate
        vx: 1, // velocity in x-direction
        vy: 1, // velocity in y-direction
        radius: 10
      })
  );

  world.add(
    Physics.body('rectangle', {
      x: 250,
      y: 500,
      width: 75,
      height: 10
    })
  );

  // ensure objects bounce when edge collision is detected
  world.add( Physics.behavior('body-impulse-response') );

  world.add(Physics.behavior('body-collision-detection'));

  world.add( Physics.behavior('sweep-prune') );

  // add some gravity
  // world.add( Physics.behavior('constant-acceleration') );

  // subscribe to ticker to advance the simulation
  Physics.util.ticker.on(function( time, dt ){
      world.step( time );
  });

  // start the ticker
  Physics.util.ticker.start();

});
