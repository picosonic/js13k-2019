#!/bin/bash

zipfile="js13k.zip"
buildpath="tmpbuild"
jscat="${buildpath}/min.js"
indexcat="${buildpath}/index.html"

# Create clean build folder
rm -Rf "${buildpath}" >/dev/null 2>&1
rm -Rf "${zipfile}" >/dev/null 2>&1
mkdir "${buildpath}"

# Concatenate the JS files
touch "${jscat}" >/dev/null 2>&1
for file in "lib/jsfxr.js" "random.js" "timeline.js" "audio.js" "font.js" "writer.js" "models.js" "3dsvg.js" "main.js"
do
  cat "${file}" >> "${jscat}"
done

# Add the index header
echo -n '<!DOCTYPE html><html><head><meta charset="utf-8"/><meta http-equiv="Content-Type" content="text/html;charset=utf-8"/><title>BACKSPACE - Return to planet Figadore</title><style>' > "${indexcat}"

# Inject the concatenated and minified CSS files
for file in "main.css"
do
  yui-compressor "${file}" >> "${indexcat}"
done

# Add on the rest of the index file
echo -n '</style><script type="text/javascript">' >> "${indexcat}"

# Inject the closure-ised and minified JS
./closeyoureyes.sh "${jscat}" >> "${indexcat}"

# Add on the rest of the index file
echo -n '</script><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/></head><body><div id="wrapper"><svg id="svg" style="position:absolute; top:0px; left:0px; width:1280px; height:720px;" viewbox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg"><defs><filter id="dblur1"><feGaussianBlur stdDeviation="1" /></filter><filter id="dblur2"><feGaussianBlur stdDeviation="2" /></filter><filter id="dblur3"><feGaussianBlur stdDeviation="3" /></filter><filter id="dblur4"><feGaussianBlur stdDeviation="4" /></filter><clipPath id="crop"><rect x="0" y="0" width="1280" height="720" /></clipPath><linearGradient id="skygradient" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:rgb(0,0,0);stop-opacity:1" /><stop offset="100%" style="stop-color:rgb(42,82,152);stop-opacity:1" /></linearGradient></defs><rect width="1280" height="720" fill="url(#skygradient)" /><g id="playfield" shaperendering="optimizeSpeed" clip-path="url(#crop)"></g><g id="hud" shaperendering="optimizeSpeed" clip-path="url(#crop)"></g></svg></div></body></html>' >> "${indexcat}"

# Remove the minified JS
rm "${jscat}" >/dev/null 2>&1

# Zip everything up
zip -j "${zipfile}" "${buildpath}"/*

# Re-Zip with advzip to save a bit more
advzip -i 20 -k -z -4 "${zipfile}"

# Determine file sizes and compression
unzip -lv "${zipfile}"
stat "${zipfile}"

zipsize=`stat -c %s "${zipfile}"`
maxsize=$((13*1024))
bytesleft=$((${maxsize}-${zipsize}))
percent=$((200*${zipsize}/${maxsize} % 2 + 100*${zipsize}/${maxsize}))

if [ ${bytesleft} -ge 0 ]
then
  echo "YAY ${percent}% used - it fits with ${bytesleft} bytes spare"
else
  echo "OH NO ${percent}% used - it's gone ovey by "$((0-${bytesleft}))" bytes"
fi
