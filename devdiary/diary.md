# Dev Diary / Postmortem

![BACKSPACE - Return to planet Figadore](../image-big.jpg?raw=true "BACKSPACE - Return to planet Figadore")

This was my second game jam entry, also my second HTML5/JS game. My first from JS13k 2018 is available here [Planet Figadore has gone OFFLINE](https://github.com/picosonic/js13k-2018)

First of all just before the theme was announced I created a new project template with updated build and minify steps from my entry last year.

Once the theme was announced I had a bit of a thought about the kind of game I could create to fit the theme, these are some of my initial ideas ..

* Back to the moon - A moon lander game to celebrate 50 years since humans visited the moon.
* Return to planet Figadore - A continuation of my entry from last year where the player has to go back to their home planet.
* Don't turn back/Don't look back - A game where you're being chased by demons which you can't look into the eyes of.
* Get back on - A riding game where enemies try to knock you off your horse or bike.
* Back to basics - Using simple tools to solve complex problems.
* Back at the ranch - You're out of town when animals escape from your ranch (various reasons from careless postie to lightning) and have to race to get them back in.
* Back on track - A racing game where you can drive off the track for shortcuts but loose points for doing so.
* Back seat driver - A driving game where you play from the back seat.
* Back to square one - A puzzle where you start on a numbered square then are teleported to a random other square and have to get back to square one.
* Back door Bertie - A maze/chase game where you're being chased and enter various properties at the front door and need to navigate the maze of rooms to get to the back door to escape.
* Get back alive - Flight simulator to drop emergency aid in a warzone and you have to get back to your base in one piece.
* Send it back - Restaurant where you run the pass and have to decide if food can go out or has to be sent back to the kitchen.
* Back in my day - Time travel for present day character back to a "better" time, which of course has the same problems.
* Back of the bus/Back of the class - You play the part of a mischief maker where you sit at the back and have to play tricks on the teacher/driver whilst their back is turned.
* Get back in time for breakfast - Exploring some woods behind a summer camp where you see strange lights (aliens) and have to go find them and return before you're noticed missing.
* Back of the net - Football game where you aim to score in a major tournament.
* Back in the hole - A whack-a-mole type game with aliens in disguises which you hit and others which you don't.

I decided on the second option with a tie-in to my previous game jam entry. Although I did toy with the idea of mixing multiple ideas into a string of randomly selected mini games.

My main goals were :

* 3D space game
* Desktop browser as a target
* All visual elements vector based
* Sound effects
* Gamepad support

Here is a rough diary of progress as posted on [Twitter](https://twitter.com/) and taken from notes and [commit logs](https://github.com/picosonic/js13k-2019/commits/)..

13th August
-----------
I enjoyed playing 3D space simulation games like [Elite](https://en.wikipedia.org/wiki/Elite_(video_game)) from the [BBC Micro](https://en.wikipedia.org/wiki/BBC_Micro) and [Zarch](https://en.wikipedia.org/wiki/Zarch) on the [Acorn Archimedes](https://en.wikipedia.org/wiki/Acorn_Archimedes) and decided to create a 3D engine which renders to SVG.

19th August
-----------
![14-segment font coding](aug19.png?raw=true "14-segment font coding")

I liked the look of [14-segment font displays](https://en.wikipedia.org/wiki/Fourteen-segment_display) and wanted to add one as the main font for the game. So set about creating one using [SVG](https://en.wikipedia.org/wiki/Scalable_Vector_Graphics), first I had to number the segments, then work out the 4 hex codes for each character.

![First test of 3D SVG engine](aug19b.png?raw=true "First test of 3D SVG engine")

I have a reasonable amount of code now to display 3D models within the browser as SVG and wanted to push the limits of what it would do. The above screenshot shows a 3D model with 6556 vertices and 10030 faces - just a few more than I'd ever use in the game.

20th August
-----------
![14-segment font test](aug20.png?raw=true "14-segment font test")

I added a small writer function to test I'd encoded the characters to hex correctly, to my amazement it was correct first time! Although it did take much longer than expected.

22nd August
-----------
Bringing some of the various JS experiments together now to see how they work together. Up to 23% used now including SVG font, 3D to SVG render engine and single 3D model. The gold clock reminds me of the TV series 24.



# Libraries used
* [jsfxr](https://github.com/mneubrand/jsfxr) JS sound effects

# Tools used
* [Ubuntu OS](https://www.ubuntu.com/)
* [vim](https://github.com/vim) text editor (also [gedit](https://github.com/GNOME/gedit) a bit)
* [meld](https://github.com/GNOME/meld) visual diff/merge
* [Inkscape](https://github.com/inkscape/inkscape) SVG editor
* [MeshLab](https://github.com/cnr-isti-vclab/meshlab) 3D model viewer
* [YUI Compressor](https://github.com/yui/yuicompressor) JS/CSS compressor
* [Google closure compiler](https://closure-compiler.appspot.com/home)
* [advzip](https://github.com/amadvance/advancecomp) (uses [7-Zip](https://sourceforge.net/projects/sevenzip/files/7-Zip/) deflate to compress further)

