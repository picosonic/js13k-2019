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
for file in "font.js" "writer.js" "models.js" "3dsvg.js" "main.js"
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
echo -n '</script><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/></head><body><svg id="svg" style="position:absolute; top:0px; left:0px; width:100%; height:100%;" xmlns="http://www.w3.org/2000/svg"><filter id="segblur"><feGaussianBlur stdDeviation="4" /></filter><g id="playfield"></g><g id="hud"></g></svg></body></html>' >> "${indexcat}"

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
