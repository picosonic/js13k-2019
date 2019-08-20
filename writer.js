function writeseg(id, x, y, text)
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

    svgtext+="<g style='transform:scale(1,-1); transform-origin:center;' filter='url(#segblur)'>";
    for (var j=0; j<16; j++)
    { 
      if (segcode&(1<<j))
        svgtext+=font_14segment_cell[j].replace('PARAMS', 'style="fill:#ff0000;stroke:none;" transform="translate('+(x+(i*charwidth))+' '+y+')"');
    }
    svgtext+="</g>";

    svgtext+="<g style='transform:scale(1,-1); transform-origin:center;'>";
    for (var j=0; j<16; j++)
    { 
      if (segcode&(1<<j))
        svgtext+=font_14segment_cell[j].replace('PARAMS', 'style="fill:#ff0000;stroke:none;" transform="translate('+(x+(i*charwidth))+' '+y+')"');
    }
    svgtext+="</g>";
  }

  id.innerHTML=svgtext;
}
