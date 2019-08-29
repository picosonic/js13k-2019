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
  activemodels:[],
  terrain:{},

  // Characters
  player:null,

  randoms:new randomizer(3,6,6,4)
};

function updatetime()
{
  var d = new Date();

  writeseg(gs.svg.svghud, 250, 250, d.toLocaleTimeString(), "gold");
}

function updateposition()
{
  var dbg="";

  dbg+="X:"+Math.floor(gs.svg.tranx)+" Y:"+Math.floor(gs.svg.trany)+" Z:"+Math.floor(gs.svg.tranz)+"<br/>";
  dbg+="RX:"+Math.floor(gs.svg.rotx)+" RY:"+Math.floor(gs.svg.roty)+" RZ:"+Math.floor(gs.svg.rotz);

  document.getElementById("debug").innerHTML=dbg;
}

// Update the game world state
function update()
{
  updateposition();

  // Move object by velocity (if required)
  gs.activemodels.forEach(function (item, index) {
    if (item.vx!=0) item.x+=item.vx;
    if (item.vy!=0) item.y+=item.vy;
    if (item.vz!=0) item.z+=item.vz;
  });
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

function generateterrain(gridx, gridy, gridsize)
{
  var terrain={t:"terrain", w:gridx, d:gridy, tilesize:gridsize, heightmap:[], v:[], f:[], c:[], s:10, x:0, y:0, z:0};
  var maxheight=32;

  for (var y=0; y<gridy; y++)
    for (var x=0; x<gridx; x++)
    {
      if (x>0)
        terrain.heightmap[(y*gridx)+x]=terrain.heightmap[(y*gridx)+(x-1)]+(gs.randoms.rnd(maxheight/2)-(maxheight/4));
      else
        terrain.heightmap[(y*gridx)+x]=gs.randoms.rnd(maxheight);

      terrain.v.push([x*gridsize-((gridx*gridsize)/2), (terrain.heightmap[(y*gridx)+x]), 0-(y*gridsize)]);
    }

  for (y=1; y<gridy; y++)
    for (x=1; x<gridx; x++)
    {
      var offs=((y*gridx)+x)+1;

      terrain.f.push([
      offs,
      offs-1,
      offs-gridy-1
      ]);

      terrain.c.push(2);

      terrain.f.push([
      offs,
      offs-gridy-1,
      offs-gridy
      ]);

      terrain.c.push(2);
    }

  return terrain;
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

// Deep clone an object
function clone(obj)
{
  return JSON.parse(JSON.stringify(obj));
}

// Generate a UUID v4 as per RFC 4122
function uuidv4()
{
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Add models to active models
function addmodel(model, x, y, z, rotx, roty, rotz)
{
  var obj=clone(model);

  obj.id=uuidv4();

  // Translation
  obj.x=x;
  obj.y=y;
  obj.z=z;

  // Rotation
  obj.rotx=rotx;
  obj.roty=roty;
  obj.rotz=rotz;

  // Velocity
  obj.vx=0;
  obj.vy=0;
  obj.vz=0;

  gs.activemodels.push(obj);

  return (gs.activemodels.length-1);
}

// Add a model by name
function addnamedmodel(name, x, y, z, rotx, roty, rotz)
{
  for (var i=0; i<models.length; i++)
    if (models[i].t==name)
      return addmodel(models[i], x, y, z, rotx, roty, rotz);
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

  // Generate terrain model
  gs.terrain=generateterrain(10, 10, 100);

  gs.player=addnamedmodel("starship", 0, 0, 0, 0, 0, 0);
  addnamedmodel("chipcube", 200, 200, -200, 10, 10, 10);
  addmodel(gs.terrain, 0, 0, 0, 0, 0, 0);

  // Gamepad support
  if (!!(navigator.getGamepads))
    window.requestAnimationFrame(gamepadscan);

  // Start the game running
  window.requestAnimationFrame(rafcallback);
}

// Run the init() once page has loaded
window.onload=function() { init(); };
