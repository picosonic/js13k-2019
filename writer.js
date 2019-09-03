function writeseg(id, x, y, text, colour)
{
  var svgtext="";
  var charwidth=52;

  for (var i=0; i<text.length; i++)
  {
    var offs=(text.charCodeAt(i)-32);

    // Don't try to draw characters outside our font set
    if ((offs<0) || (offs>94))
      continue;

    var segcode=font_14segment[offs]||0;

    for (var k=0; k<2; k++)
    {
      svgtext+="<g style='transform:scale(1,-1); transform-origin:center;'";
      if (k==0) svgtext+=" filter='url(#dblur4)'";
      svgtext+=">";

      for (var j=0; j<16; j++)
        if (segcode&(1<<j))
        {
          if (j==14) // DP
          {
            svgtext+='<circle cx="'+font_14segment_cell[j][0]+'" cy="'+font_14segment_cell[j][1]+'" r="'+font_14segment_cell[j][2];
          }
          else
          {
            svgtext+='<polygon points="';
            for (var l=0; l<font_14segment_cell[j].length/2; l++)
            {
              svgtext+=' '+font_14segment_cell[j][l*2];
              svgtext+=','+font_14segment_cell[j][l*2+1];
            }
          }

          svgtext+='" style="fill:'+(colour||'#ff0000')+';stroke:none;" transform="translate('+(x+(i*charwidth))+' '+y+')"/>';
        }

      svgtext+="</g>";
    }

  }

  id.innerHTML=svgtext;
}
