// 3D to SVG engine

// OpenGL default palette
var palette=[
  [102, 102, 102], // 0 "darkgrey"
  [255, 0, 0], // 1 "red"
  [0, 255, 0], // 2 "green"
  [0, 0, 255], // 3 "blue"
  [0, 255, 255], // 4 "cyan"
  [255, 0, 255], // 5 "magenta"
  [255, 255, 0], // 6 "yellow"
  [255, 255, 255], // 7 "white"
  [0, 0, 0], // 8 "black"
  [127, 0, 0], // 9 "darkred"
  [0, 127, 0], // 10 "darkgreen"
  [0, 0, 127], // 11 "darkblue"
  [0, 127, 127], // 12 "darkcyan"
  [127, 0, 127], // 13 "darkmagenta"
  [127, 127, 0], // 14 "darkyellow"
  [204, 204, 204] // 15 "lightgrey"
];

const PIOVER180=(Math.PI/180); // lookup for converting degrees to radians

// Class for rendering 3D to SVG
class svg3d
{
  constructor()
  {
    // Initialise SVG objects
    this.svg=null;
    this.svgobj=null;
    this.svghud=null;

    // World rotation in degrees
    this.rotx=0;
    this.roty=0;
    this.rotz=0;

    // World translation in pixels
    this.tranx=0;
    this.trany=0;
    this.tranz=0;

    // 3D to 2D coord cache
    this.d=[]; // Conversion matrix
    this.x=0;
    this.y=0;
    this.z=0;

    // Viewport reference
    this.f=800; // focal length (viewer to image plane)
    this.xmax=800;
    this.ymax=600;
    this.vscale=1;

    // 2D cursor
    this.cx=0;
    this.cy=0;
  }

  // Generate 3D translation matrix from x/y/z rotation values
  initrotation(aa, bb, cc)
  {
    var a=PIOVER180*(aa);
    this.d[4]=Math.cos(a);
    this.d[5]=Math.sin(a);
    this.d[6]=-this.d[5];
    this.d[7]=this.d[4];

    var b=PIOVER180*(bb);
    this.d[8]=Math.cos(b);
    this.d[9]=Math.sin(b);
    this.d[10]=-this.d[9];
    this.d[11]=this.d[8];

    var c=PIOVER180*(cc);
    this.d[0]=Math.cos(c);
    this.d[1]=Math.sin(c);
    this.d[2]=-this.d[1];
    this.d[3]=this.d[0];
  }

  // Convert 3d x,y,z into 2d x,y
  rotate()
  {
    // Apply viewport scale factor
    this.x*=this.vscale; this.y*=this.vscale; this.z*=this.vscale;

    this.y*=-1; // flip y
    this.z*=-1; // flip z

    // roll - longitudinal axis (Z)
    var xs=this.x; // Save x
    this.x=(xs*this.d[4])+(this.y*this.d[6]);
    this.y=(xs*this.d[5])+(this.y*this.d[7]);

    // yaw - vertical axis (Y)
    xs=this.x; // Save x
    this.x=(xs*this.d[8])+(this.z*this.d[10]);
    this.z=(xs*this.d[9])+(this.z*this.d[11]);

    // pitch - transverse axis (X)
    var ys=this.y; // Save y
    this.y=(ys*this.d[0])+(this.z*this.d[2]);
    this.z=(ys*this.d[1])+(this.z*this.d[3]);

    // weak perspective projection, convert 3d to 2d
    this.x=(this.f*this.x)/(this.f+this.z);
    this.y=(this.f*this.y)/(this.f+this.z);

    // move 2d origin to centre of screen
    this.y+=(this.ymax/2); this.x+=(this.xmax/2);
  }

  // Move 2d cursor to 3d coordinate
  move3d(x1, y1, z1)
  {
    this.x=x1; this.y=y1; this.z=z1;
    this.rotate();

    this.cx=Math.floor(this.x);
    this.cy=Math.floor(this.y);
  }

  render()
  {
  }

  init()
  {
    // Find DOM objects
    this.svg=document.getElementById("svg");
    this.svgobj=document.getElementById("playfield");
    this.svghud=document.getElementById("hud");
  }
}
