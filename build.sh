#!/bin/bash

zipfile="js13k.zip"
buildpath="tmpbuild"
jscat="${buildpath}/min.js"
indexcat="${buildpath}/index.html"

# Create clean build folder
rm -Rf "${buildpath}" >/dev/null 2>&1
rm -Rf "${zipfile}" >/dev/null 2>&1
mkdir "${buildpath}"

# Concatenate and minify the JS files
touch "${jscat}" >/dev/null 2>&1
for file in "main.js"
do
  yui-compressor "${file}" >> "${jscat}"
done

# Add the index header
echo -n '<!DOCTYPE html><html><head><meta charset="utf-8"/><meta http-equiv="Content-Type" content="text/html;charset=utf-8"/><title>TODO</title><style>' > "${indexcat}"

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
echo -n '</script><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/></head><body></body></html>' >> "${indexcat}"

# Remove the minified JS
rm "${jscat}" >/dev/null 2>&1

# Zip everything up
zip -j "${zipfile}" "${buildpath}"/*

# Re-Zip with advzip
advzip -k -z -4 "${zipfile}"

# Determine file sizes and compression
unzip -lv "${zipfile}"
stat "${zipfile}"
