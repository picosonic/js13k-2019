// JS 13k 2019 entry

// Game state
var gs={
  // Animation frame of reference
  step:(1/60), // target step time @ 60 fps
  acc:0, // accumulated time since last frame
  lasttime:0, // time of last frame

  // Control state
  gamepad:-1,
  gamepadbuttons:[], // Button mapping
  gamepadaxes:[], // Axes mapping
  gamepadaxesval:[], // Axes values

  // SVG interface
  svg:new svg3d(),

  // Active 3D models
  activemodels:[],
  terrain:{},

  // Characters
  player:{id:null, keystate:0, padstate:0}, // input bitfield [action][down][right][up][left]
  leanx:0,
  leany:0,
  leanz:0,
  shottimeout:0,
  shots:[],
  npcs:[],

  level:1,
  blastradius:500,
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
  dbg+="RX:"+Math.floor(gs.svg.rotx)+" RY:"+Math.floor(gs.svg.roty)+" RZ:"+Math.floor(gs.svg.rotz)+"<br/>";
  dbg+="KEY:"+gs.player.keystate;
  if (gs.gamepad!=-1) dbg+=" PAD:"+gs.player.padstate;
  dbg+="<br/>INV "+gs.npcs.length;

  document.getElementById("debug").innerHTML=dbg;
}

// Clear both keyboard and gamepad input state
function clearinputstate(character)
{
  character.keystate=0;
  character.padstate=0;
}

// Check if an input is set in either keyboard or gamepad input state
function ispressed(character, keybit)
{
  return (((character.keystate&keybit)!=0) || ((character.padstate&keybit)!=0));
}

// Update the position of players/enemies
function updatemovements(character)
{
  // Move player when a key is pressed
  if ((character.keystate!=0) || (character.padstate!=0))
  {
    var val=0;

    // Left key
    if ((ispressed(character, 1)) && (!ispressed(character, 4)))
    {
      if ((character.padstate&1)!=0)
        val=gs.gamepadaxesval[0];
      else
        val=-1;

      // Yaw - Turn L/R
      gs.svg.roty+=val*2;
      gs.leanx=-val*50;
      gs.leany=-val*50;
    }

    // Right key
    if ((ispressed(character, 4)) && (!ispressed(character, 1)))
    {
      if ((character.padstate&4)!=0)
        val=gs.gamepadaxesval[0];
      else
        val=1;

      // Yaw - Turn L/R
      gs.svg.roty+=val*2;
      gs.leanx=-val*50;
      gs.leany=-val*50;
    }

    // Up key
    if ((ispressed(character, 2)) && (!ispressed(character, 8)))
    {
      if ((character.padstate&2)!=0)
        val=gs.gamepadaxesval[1];
      else
        val=-1;

      // Pitch - F/B
      gs.svg.tranx+=(val*36)*Math.sin(gs.svg.roty*PIOVER180);
      gs.svg.tranz+=(val*36)*Math.cos(gs.svg.roty*PIOVER180);
    }
    else
    {
      gs.svg.tranx-=15*Math.sin(gs.svg.roty*PIOVER180);
      gs.svg.tranz-=15*Math.cos(gs.svg.roty*PIOVER180);
    }

    // Down key
    if ((ispressed(character, 8)) && (!ispressed(character, 2)))
    {
      if ((character.padstate&8)!=0)
        val=gs.gamepadaxesval[1];
      else
        val=1;

      // Pitch - F/B
      gs.svg.tranx+=(val*24)*Math.sin(gs.svg.roty*PIOVER180);
      gs.svg.tranz+=(val*24)*Math.cos(gs.svg.roty*PIOVER180);
    }

/*
    // Roll - Sidestep L/R
    gs.svg.tranx-=(val*16)*Math.sin((gs.svg.roty+90)*PIOVER180);
    gs.svg.tranz-=(val*16)*Math.cos((gs.svg.roty+90)*PIOVER180);

    // Collective
    gs.svg.trany+=val*16;
*/

    // Prevent angle over/underflow
    if (gs.svg.rotx<0) gs.svg.rotx=360+gs.svg.rotx;
    if (gs.svg.roty<0) gs.svg.roty=360+gs.svg.roty;
    if (gs.svg.rotz<0) gs.svg.rotz=360+gs.svg.rotz;

    if (gs.svg.rotx>360) gs.svg.rotx-=360;
    if (gs.svg.roty>360) gs.svg.roty-=360;
    if (gs.svg.rotz>360) gs.svg.rotz-=360;

    // Action key
    if (ispressed(character, 16))
    {
      if ((gs.shottimeout==0) && (gs.shots.length<5))
      {
        var o=addnamedmodel("missile", -gs.svg.tranx, -gs.svg.trany, -gs.svg.tranz, gs.svg.rotx, gs.svg.roty, 0);

        gs.activemodels[o].vx=100*Math.sin(gs.activemodels[o].roty*PIOVER180);
        gs.activemodels[o].vz=100*Math.cos(gs.activemodels[o].roty*PIOVER180);
        gs.activemodels[o].decay=(3*60);
        gs.shots.push(gs.activemodels[o].id);

        audio_missile();

        gs.shottimeout=(0.5*60);
      }
    }
  }
  else
  {
    // Continue forwards if nothing pressed
    gs.svg.tranx-=15*Math.sin(gs.svg.roty*PIOVER180);
    gs.svg.tranz-=15*Math.cos(gs.svg.roty*PIOVER180);
  }

  // Do a dampened lean return
  if (gs.leanx>0) gs.leanx-=gs.leanx>2?2:1;
  if (gs.leanx<0) gs.leanx+=gs.leanx<-2?2:1;

  if (gs.leany>0) gs.leany-=gs.leany>2?2:1;
  if (gs.leany<0) gs.leany+=gs.leany<-2?2:1;

  // Rotate new level to flat
  if (gs.svg.rotz>5) gs.svg.rotz-=0.5;
}

function angle2d(x1, y1, x2, y2)
{
  var result=(Math.atan2(y2-y1,x2-x1)*(180/Math.PI));

  return result;
}

// Distance between 2 [x,y,z] points
function distance3d(x1, y1, z1, x2, y2, z2)
{
  return (
    Math.sqrt(
      Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2) + Math.pow(z2-z1, 2)
    )
  );
}

// Roughly see if two points have overlap
function overlap3d(x1, y1, z1, x2, y2, z2, overlap)
{
  var dx=Math.abs(Math.max(x1, x2)-Math.min(x1, x2));
  var dy=Math.abs(Math.max(y1, y2)-Math.min(y1, y2));
  var dz=Math.abs(Math.max(z1, z2)-Math.min(z1, z2));

  return ((dx<overlap) && (dy<overlap) && (dz<overlap));
}

// Find a model with matching id
function findmodelbyid(id)
{
  for (var i=0; i<gs.activemodels.length; i++)
  {
    if (gs.activemodels[i].id==id)
      return i;
  }

  return -1;
}

// Determine if level completed
function levelcompleted()
{
  return (gs.npcs.length==0);
}

// Update the game world state
function update()
{
  if (levelcompleted())
  {
    gs.level++;
    if (gs.level==5) gs.level=1;

    gs.blastradius=500-(gs.level*50);
    gs.svg.rotz=45;

    audio_collect();

    // Add some new invaders
    for (var n=0; n<(5*gs.level); n++)
    {
      var o=addnamedmodel("invader", gs.randoms.rnd(10000)-5000, 400, 0-gs.randoms.rnd(10000), 0, gs.randoms.rnd(360), 0);

      gs.npcs.push(gs.activemodels[o].id);

      gs.activemodels[o].vx=25*Math.sin(gs.activemodels[o].roty*PIOVER180);
      gs.activemodels[o].vz=-25*Math.cos(gs.activemodels[o].roty*PIOVER180);
    }

    return;
  }

  // Weapon timeouts
  if (gs.shottimeout>0)
    gs.shottimeout--;

  if (gs.shots.length==0) gs.shottimeout=0;

  for (var h=0; h<gs.shots.length; h++)
  {
    var shotid=findmodelbyid(gs.shots[h]);

    gs.activemodels[shotid].decay--;
    if (gs.activemodels[shotid].decay<=0)
    {
      gs.activemodels.splice(shotid, 1);
      gs.shots.splice(h, 1);
      break;
    }
  }

  // Weapon hit detection
  for (var g=0; g<gs.shots.length; g++)
  {
    var shotid=findmodelbyid(gs.shots[g]);
    if (shotid==-1) continue;
    gs.activemodels[shotid].roty=gs.lasttime%360;

    for (var i=0; i<gs.npcs.length; i++)
    {
      var npcid=findmodelbyid(gs.npcs[i]);
      if (npcid==-1) continue;

      var shot=gs.activemodels[shotid];
      var nme=gs.activemodels[npcid];

      if (overlap3d(shot.x, shot.y, shot.z, nme.x, nme.y, nme.z, gs.blastradius))
      {
        // Remove shot
        gs.activemodels.splice(shotid, 1);
        gs.shots.splice(g, 1);

        // Remove npc
        gs.activemodels.splice(npcid, 1);
        gs.npcs.splice(i, 1);

        audio_explosion();

        shotid=-1;
        break;
      }
    }

    if (shotid==-1) break;
  }

  // Apply keystate to player
  updatemovements(gs.player);

  // If player out of bounds, then reset
  if ((gs.svg.tranx<-5000) ||
   (gs.svg.tranx>5000) ||
   (gs.svg.tranz<0) ||
   (gs.svg.tranz>10000))
  {
    gs.svg.tranx=0;
    gs.svg.tranz=5000;
  }

  // Keep player in view
  gs.activemodels[gs.player.id].x=-gs.svg.tranx;
  gs.activemodels[gs.player.id].y=-gs.svg.trany;
  gs.activemodels[gs.player.id].z=-gs.svg.tranz;

  gs.activemodels[gs.player.id].rotx=-gs.svg.rotx;
  gs.activemodels[gs.player.id].roty=-gs.svg.roty;
  gs.activemodels[gs.player.id].rotz=0;

  // Update player angle
  gs.activemodels[gs.player.id].rotx+=gs.leanx;
  gs.activemodels[gs.player.id].roty+=gs.leany;
  gs.activemodels[gs.player.id].rotz+=gs.leanz;

  updateposition();

  // Move object by velocity (if required)
  gs.activemodels.forEach(function (item, index) {
    item.x+=item.vx;
    item.y+=item.vy;
    item.z+=item.vz;
  });

  // Move enemies around
  for (var i=0; i<gs.npcs.length; i++)
  {
    var npcid=findmodelbyid(gs.npcs[i]);
    if (npcid==-1) continue;
    var angle=gs.activemodels[npcid].roty;

    // If out of bounds, then set on a new random course
    if ((gs.activemodels[npcid].x<-5000) ||
       (gs.activemodels[npcid].z<-10000) ||
       (gs.activemodels[npcid].x>5000) ||
       (gs.activemodels[npcid].z>0))
    {
      angle=(gs.activemodels[npcid].roty+180+gs.randoms.rnd(45))%360;
      gs.activemodels[npcid].roty=angle;

      gs.activemodels[npcid].vx=25*Math.sin(angle*PIOVER180);
      gs.activemodels[npcid].vz=-25*Math.cos(angle*PIOVER180);

      gs.activemodels[npcid].x+=gs.activemodels[npcid].vx;
      gs.activemodels[npcid].z+=gs.activemodels[npcid].vz;
    }
  }
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

    // Gamepad support
    if (!!(navigator.getGamepads))
      gamepadscan();

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
  var found=0;

  var gleft=false;
  var gright=false;
  var gup=false;
  var gdown=false;
  var gjump=false;

  for (var padid=0; padid<gamepads.length; padid++)
  {
    // Only support first found gamepad
    if ((found==0) && (gamepads[padid] && gamepads[padid].connected))
    {
      found++;

      // If we don't already have this one, add mapping for it
      if (gs.gamepad!=padid)
      {
        console.log("Found new gamepad "+padid+" '"+gamepads[padid].id+"'");

        gs.gamepad=padid;

        if (gamepads[padid].mapping==="standard")
        {
          gs.gamepadbuttons[0]=14; // left (left) d-left
          gs.gamepadbuttons[1]=15; // right (left) d-right
          gs.gamepadbuttons[2]=12; // top (left) d-up
          gs.gamepadbuttons[3]=13; // bottom (left) d-down
          gs.gamepadbuttons[4]=0;  // bottom button (right) x

          gs.gamepadaxes[0]=0; // left/right axis
          gs.gamepadaxes[1]=1; // up/down axis
          gs.gamepadaxes[2]=2; // cam left/right axis
          gs.gamepadaxes[3]=3; // cam up/down axis
        }
        else
        if (gamepads[padid].id=="054c-0268-Sony PLAYSTATION(R)3 Controller")
        {
          // PS3
          gs.gamepadbuttons[0]=15; // left (left) d-left
          gs.gamepadbuttons[1]=16; // right (left) d-right
          gs.gamepadbuttons[2]=13; // top (left) d-up
          gs.gamepadbuttons[3]=14; // bottom (left) d-down
          gs.gamepadbuttons[4]=0;  // bottom button (right) x

          gs.gamepadaxes[0]=0; // left/right axis
          gs.gamepadaxes[1]=1; // up/down axis
          gs.gamepadaxes[2]=3; // cam left/right axis
          gs.gamepadaxes[3]=4; // cam up/down axis
        }
        else
        if (gamepads[padid].id=="045e-028e-Microsoft X-Box 360 pad")
        {
          // XBOX 360
          gs.gamepadbuttons[0]=-1; // left (left) d-left
          gs.gamepadbuttons[1]=-1; // right (left) d-right
          gs.gamepadbuttons[2]=-1; // top (left) d-up
          gs.gamepadbuttons[3]=-1; // bottom (left) d-down
          gs.gamepadbuttons[4]=0;  // bottom button (right) x

          gs.gamepadaxes[0]=6; // left/right axis
          gs.gamepadaxes[1]=7; // up/down axis
          gs.gamepadaxes[2]=3; // cam left/right axis
          gs.gamepadaxes[3]=4; // cam up/down axis
        }
        else
        if (gamepads[padid].id=="0f0d-00c1-  Switch Controller")
        {
          // Nintendo Switch
          gs.gamepadbuttons[0]=-1; // left (left) d-left
          gs.gamepadbuttons[1]=-1; // right (left) d-right
          gs.gamepadbuttons[2]=-1; // top (left) d-up
          gs.gamepadbuttons[3]=-1; // bottom (left) d-down
          gs.gamepadbuttons[4]=1;  // bottom button (right) x

          gs.gamepadaxes[0]=4; // left/right axis
          gs.gamepadaxes[1]=5; // up/down axis
          gs.gamepadaxes[2]=2; // cam left/right axis
          gs.gamepadaxes[3]=3; // cam up/down axis
        }
        else
        if (gamepads[padid].id=="054c-05c4-Sony Computer Entertainment Wireless Controller")
        {
          // PS4
          gs.gamepadbuttons[0]=-1; // left (left) d-left
          gs.gamepadbuttons[1]=-1; // right (left) d-right
          gs.gamepadbuttons[2]=-1; // top (left) d-up
          gs.gamepadbuttons[3]=-1; // bottom (left) d-down
          gs.gamepadbuttons[4]=0;  // bottom button (right) x

          gs.gamepadaxes[0]=0; // left/right axis
          gs.gamepadaxes[1]=1; // up/down axis
          gs.gamepadaxes[2]=3; // cam left/right axis
          gs.gamepadaxes[3]=4; // cam up/down axis
        }
        else
        {
          // Unknown non-"standard" mapping
          gs.gamepadbuttons[0]=-1; // left (left) d-left
          gs.gamepadbuttons[1]=-1; // right (left) d-right
          gs.gamepadbuttons[2]=-1; // top (left) d-up
          gs.gamepadbuttons[3]=-1; // bottom (left) d-down
          gs.gamepadbuttons[4]=-1;  // bottom button (right) x

          gs.gamepadaxes[0]=-1; // left/right axis
          gs.gamepadaxes[1]=-1; // up/down axis
          gs.gamepadaxes[2]=-1; // cam left/right axis
          gs.gamepadaxes[3]=-1; // cam up/down axis
        }
      }

      // Check analog axes
      for (var i=0; i<gamepads[padid].axes.length; i++)
      {
        var val=gamepads[padid].axes[i];

        if (i==gs.gamepadaxes[0])
        {
          gs.gamepadaxesval[0]=val;

          if (val<-0.5) // Left
            gleft=true;

          if (val>0.5) // Right
            gright=true;
        }

        if (i==gs.gamepadaxes[1])
        {
          gs.gamepadaxesval[1]=val;

          if (val<-0.5) // Up
            gup=true;

          if (val>0.5) // Down
            gdown=true;
        }

        if (i==gs.gamepadaxes[2])
          gs.gamepadaxesval[2]=val;

        if (i==gs.gamepadaxes[3])
          gs.gamepadaxesval[3]=val;
      }

      // Check buttons
      for (i=0; i<gamepads[padid].buttons.length; i++)
      {
        var val=gamepads[padid].buttons[i];
        var pressed=val==1.0;

        if (typeof(val)=="object")
        {
          pressed=val.pressed;
          val=val.value;
        }

        if (pressed)
        {
          switch (i)
          {
            case gs.gamepadbuttons[0]: gleft=true; break;
            case gs.gamepadbuttons[1]: gright=true; break;
            case gs.gamepadbuttons[2]: gup=true; break;
            case gs.gamepadbuttons[3]: gdown=true; break;
            case gs.gamepadbuttons[4]: gjump=true; break;
            default: break;
          }
        }
      }

      // Update padstate
      if (gup)
        gs.player.padstate|=2;
      else
        gs.player.padstate&=~2;

      if (gdown)
        gs.player.padstate|=8;
      else
        gs.player.padstate&=~8;

      if (gleft)
        gs.player.padstate|=1;
      else
        gs.player.padstate&=~1;

      if (gright)
        gs.player.padstate|=4;
      else
        gs.player.padstate&=~4;

      if (gjump)
        gs.player.padstate|=16;
      else
        gs.player.padstate&=~16;
    }
  }

  // Detect disconnect
  if ((found==0) && (gs.gamepad!=-1))
  {
    console.log("Disconnected gamepad "+padid);
    
    gs.gamepad=-1;
  }
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

// Update the player key state
function updatekeystate(e, dir)
{
  switch (e.which)
  {
    case 37: // cursor left
    case 65: // A
    case 90: // Z
      if (dir==1)
        gs.player.keystate|=1;
      else
        gs.player.keystate&=~1;
      e.preventDefault();
      break;

    case 38: // cursor up
    case 87: // W
    case 59: // semicolon
      if (dir==1)
        gs.player.keystate|=2;
      else
        gs.player.keystate&=~2;
      e.preventDefault();
      break;

    case 39: // cursor right
    case 68: // D
    case 88: // X
      if (dir==1)
        gs.player.keystate|=4;
      else
        gs.player.keystate&=~4;
      e.preventDefault();
      break;

    case 40: // cursor down
    case 83: // S
    case 190: // dot
      if (dir==1)
        gs.player.keystate|=8;
      else
        gs.player.keystate&=~8;
      e.preventDefault();
      break;

    case 13: // enter
    case 32: // space
      if (dir==1)
        gs.player.keystate|=16;
      else
        gs.player.keystate&=~16;
      e.preventDefault();
      break;

    case 27: // escape
      e.preventDefault();
      break;

    default:
      break;
  }
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
  // Initialise stuff
  document.onkeydown=function(e)
  {
    e = e || window.event;
    updatekeystate(e, 1);
  };

  document.onkeyup=function(e)
  {
    e = e || window.event;
    updatekeystate(e, 0);
  };

  // Stop things from being dragged around
  window.ondragstart=function(e)
  {
    e = e || window.event;
    e.preventDefault();
  };

  // Set up game state
  gs.svg.init();

  window.addEventListener("resize", function() { playfieldsize(); });

  playfieldsize();

  // Temporary clock
//  setInterval(function(){ updatetime(); }, 1000);

  // Generate terrain model
  var terrainx=10, terrainy=10;
  gs.terrain=generateterrain(terrainx, terrainy, 100);

  gs.player.id=addnamedmodel("starship", 0, 0, 0, 0, 0, 0);
  addnamedmodel("chipcube", 200, 200, -200, 10, 10, 10);
  addmodel(gs.terrain, 0, 0, 0, 0, 0, 0);

  for (var y=0; y<terrainy; y++)
    for (var x=0; x<terrainx; x++)
    {
      if (gs.randoms.rnd(10)<5)
        addnamedmodel("tree",
          ((x-5)*gs.terrain.tilesize)*gs.terrain.s,
          (((4+gs.terrain.heightmap[(y*gs.terrain.w)+x])*gs.terrain.s)),
          0-(((y)*gs.terrain.tilesize)*gs.terrain.s),
          0,
          gs.randoms.rnd(90),
          0);
    }

  for (var n=0; n<10; n++)
  {
    var o=addnamedmodel("invader", 0, 400, -3000, 0, gs.randoms.rnd(360), 0);

    gs.npcs.push(gs.activemodels[o].id);

    gs.activemodels[o].vx=25*Math.sin(gs.activemodels[o].roty*PIOVER180);
    gs.activemodels[o].vz=-25*Math.cos(gs.activemodels[o].roty*PIOVER180);
  }

  // Start the game running
  window.requestAnimationFrame(rafcallback);
}

// Run the init() once page has loaded
window.onload=function() { init(); };
