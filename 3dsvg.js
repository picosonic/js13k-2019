// 3D to SVG engine

class svg3d
{
  constructor()
  {
    this.svg=null;
    this.svgobj=null;
    this.svghud=null;
  }

  init()
  {
    this.svg=document.getElementById("svg");
    this.svgobj=document.getElementById("playfield");
    this.svghud=document.getElementById("hud");
  }

  render()
  {
  }
}
