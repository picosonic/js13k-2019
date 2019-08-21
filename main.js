// JS 13k 2019 entry

// Game state
var gs={
  // animation frame of reference
  step:(1/60), // target step time @ 60 fps
  acc:0, // accumulated time since last frame
  lasttime:0, // time of last frame

  // SVG interface
  svg:new svg3d(),
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

    // Process "steps" since last call
    while (gs.acc>gs.step)
    {
      update();
      gs.acc-=gs.step;
    }

    // Render the game world
    gs.svg.render();
  }

  // Remember when we were last called
  gs.lasttime=timestamp;

  // Request we are called on the next frame
  window.requestAnimationFrame(rafcallback);
}

// Handle resize events
function playfieldsize()
{
}

// Entry point
function init()
{
  // Set up game state
  gs.svg.init();

  window.addEventListener("resize", function()
  {
    playfieldsize();
  });

  playfieldsize();

  setInterval(function(){ updatetime(); }, 1000);

  // Start the game running
  window.requestAnimationFrame(rafcallback);
}

// Run the init() once page has loaded
window.onload=function() { init(); };
