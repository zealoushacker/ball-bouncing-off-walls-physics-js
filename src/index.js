var Physics = require('../vendor/physicsjs/dist/physicsjs-full');

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

  // add a "ball"
  var ball = Physics.body('circle', {
    x: 250, // x-coordinate
    y: 480, // y-coordinate
    radius: 10
  });

  world.add(ball);

  var another_ball = Physics.body('rectangle', {
    x: 260, // x-coordinate
    y: 420, // y-coordinate
    width: 10,
    height: 10,
    treatment: 'static'
  });

  world.add(ball);

  world.add(another_ball);

  // add the platform
  var platform = Physics.body('rectangle', {
    x: 250,
    y: 495,
    width: 75,
    height: 10,
    treatment: 'static'
  });

  world.add(platform);

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

  window.addEventListener('keyup', function(event) {
    if (event.keyCode === 13) {
      world.emit('start-ball');
    } else if (event.keyCode === 37) {
      world.emit('move', 'left');
    } else if (event.keyCode === 39) {
      world.emit('move', 'right');
    } else if (event.keyCode === 65) {
      world.emit('move-ball', 'left');
    } else if (event.keyCode === 68) {
      world.emit('move-ball', 'right');
    } else if (event.keyCode === 88) {
      world.emit('move-ball', 'top');
    } else if (event.keyCode === 83) {
      world.emit('move-ball', 'down');
    }
  });

  // start the ticker
  Physics.util.ticker.start();

  world.one('start-ball', function(data, e) {
    ball.state.vel.set(0.33,-0.33);
    ball.sleep(false);
  });

  world.on('move', function(data, e) {
    platform.state.pos.set(platform.state.pos.x + (data === 'left' ? -20 : 20), platform.state.pos.y);
  });

  world.on('move-ball', function(data, e) {
    var pixels = (data === 'left' || data === 'top' ? -20 : 20);
    if (data === 'left' || data === 'right') {
      another_ball.state.pos.set(another_ball.state.pos.x + pixels, another_ball.state.pos.y);
    } else {
      another_ball.state.pos.set(another_ball.state.pos.x, another_ball.state.pos.y + pixels);
    }
  });

  world.on('collisions:detected', function(data, e) {
    console.log(data);
  });

});
