// JS 13k 2019 entry

// Game state
var gs={
  // animation frame of reference
  step:(1/60), // target step time @ 60 fps
  acc:0, // accumulated time since last frame
  lasttime:0, // time of last frame

  // SVG interface
  svg:new svg3d(),

  // Active 3D models
  activemodels:[]
};

function updatetime()
{
  var d = new Date();

  writeseg(gs.svg.svghud, 250, 250, d.toLocaleTimeString(), "gold");
}

// Update the game world state
function update()
{
}

// Request animation frame callback
function rafcallback(timestamp)
{
  // First time round, just save epoch
  if (gs.lasttime>0)
  {
    // Determine accumulated time since last call
    gs.acc+=((timestamp-gs.lasttime) / 1000);

    // If it's more than 15 seconds since last call, reset
    if ((gs.acc>gs.step) && ((gs.acc/gs.step)>(60*15)))
      gs.acc=gs.step*2;

    var progress=timestamp/100;

    // Process "steps" since last call
    while (gs.acc>gs.step)
    {
      update();
      gs.acc-=gs.step;
    }

    // Render the game world
    gs.svg.render(progress);
  }

  // Remember when we were last called
  gs.lasttime=timestamp;

  // Request we are called on the next frame
  window.requestAnimationFrame(rafcallback);
}

// Handle resize events
function playfieldsize()
{
  gs.svg.resize();
}

// Scan for any connected gamepads
function gamepadscan()
{
  var gamepads=navigator.getGamepads();

  for (var padid=0; padid<gamepads.length; padid++)
  {
    if (gamepads[padid] && gamepads[padid].connected)
    {
      if ((gamepads[padid].id=="054c-0268-Sony PLAYSTATION(R)3 Controller") || (gamepads[padid].id=="054c-05c4-Sony Computer Entertainment Wireless Controller"))
      {
        for (var i=0; i<gamepads[padid].axes.length; i++)
        {
          var val=gamepads[padid].axes[i];

          if (i==0)
            gs.svg.tranx-=val*4;

          if (i==1)
            gs.svg.tranz+=val*4;

          if (i==4)
            gs.svg.rotz+=val*4;

          if (i==3)
            gs.svg.trany+=val*4;

          if (gs.svg.rotx<0) gs.svg.rotx=360+gs.svg.rotx;
          if (gs.svg.roty<0) gs.svg.roty=360+gs.svg.roty;
          if (gs.svg.rotz<0) gs.svg.rotz=360+gs.svg.rotz;

          if (gs.svg.rotx>360) gs.svg.rotx-=360;
          if (gs.svg.roty>360) gs.svg.roty-=360;
          if (gs.svg.rotz>360) gs.svg.rotz-=360;
        }
      }
    }
  }

  window.requestAnimationFrame(gamepadscan);
}

function clone(obj)
{
  return JSON.parse(JSON.stringify(obj));
}

// Entry point
function init()
{
  // Set up game state
  gs.svg.init();

  window.addEventListener("resize", function() { playfieldsize(); });

  playfieldsize();

  // Temporary clock
//  setInterval(function(){ updatetime(); }, 1000);

  gs.activemodels[0]=clone(models[0]);
  gs.activemodels[0].x=0;
  gs.activemodels[0].y=0;
  gs.activemodels[0].z=0;

  gs.activemodels[1]=clone(models[0]);
  gs.activemodels[1].x=200;
  gs.activemodels[1].y=200;
  gs.activemodels[1].z=200;

  // Gamepad support
  if (!!(navigator.getGamepads))
    window.requestAnimationFrame(gamepadscan);

  // Start the game running
  window.requestAnimationFrame(rafcallback);
}

// Run the init() once page has loaded
window.onload=function() { init(); };
