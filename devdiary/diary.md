# Dev Diary / Postmortem

![BACKSPACE - Return to planet Figadore](../image-big.jpg?raw=true "BACKSPACE - Return to planet Figadore")

This was my second game jam entry, also my second HTML5/JS game. My first from JS13k 2018 is available here [Planet Figadore has gone OFFLINE](https://github.com/picosonic/js13k-2018)

First of all just before the theme was announced I created a new project template with updated build and minify steps from my entry last year. Which also made me want to fix some of the things about last year's entry, which I figured would be good to get some JS game coding practice in before the competion started.

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
![Wireframe 3D test](aug13.png?raw=true "Wireframe 3D test")

I enjoyed playing 3D space simulation games like [Elite](https://en.wikipedia.org/wiki/Elite_(video_game)) from the [BBC Micro](https://en.wikipedia.org/wiki/BBC_Micro) and [Zarch](https://en.wikipedia.org/wiki/Zarch) on the [Acorn Archimedes](https://en.wikipedia.org/wiki/Acorn_Archimedes) and decided to create a 3D engine which renders to SVG.

The image above shows a still from a 3D wireframe to SVG render test using a thargoid model from the Elite game.

15th to 19th August
-------------------
No development due to long weekend away.

However my initial thoughts on the game are to have it in 3 parts.

* The journey back to planet Figadore - a bit like Elite.
* Flying around the planet and [dog-fighting](https://en.wikipedia.org/wiki/Dogfight) against AI - a bit like Zarch.
* 3D platformer exploring the planet - a bit like [Ratchet and Clank](https://en.wikipedia.org/wiki/Ratchet_%26_Clank).

I decided to concentrate my initial efforts on the flying round the planet section.

19th August
-----------
![14-segment font coding](aug19.png?raw=true "14-segment font coding")

I liked the look of [14-segment font displays](https://en.wikipedia.org/wiki/Fourteen-segment_display) and wanted to add one as the main font for the game. So set about creating one using [SVG](https://en.wikipedia.org/wiki/Scalable_Vector_Graphics), first I had to number the segments, then work out the 4 hex codes for each character.

I later found somebody else who had done [something similar](https://github.com/dmadison/LED-Segment-ASCII) and a lot of the hex codes matched up! This could have saved a lot of time, still it was good to work through it from first principles.

![First test of 3D SVG engine](aug19b.png?raw=true "First test of 3D SVG engine")

I have a reasonable amount of code now to display 3D models within the browser as SVG and wanted to push the limits of what it would do. The above screenshot shows a 3D model of a netballer with 6556 vertices and 10030 faces - just a few more than I'd ever use in the game. At this point I had rudimentary [3D to 2D conversion](https://en.wikipedia.org/wiki/3D_projection#Weak_perspective_projection), face rendering and basic lighting.

20th August
-----------
![14-segment font test](aug20.png?raw=true "14-segment font test")

I added a small writer function to test I'd encoded the characters to hex correctly, to my amazement it was correct first time! Although it did take much longer than expected.

21st August
-----------
Added paramter to allow 14-segment font to be drawn in any colour.

Started pulling together some of the expirements I'd done with 3D SVG engine.

Settled on a name for the game - **BACKSPACE - Return to planet Figadore**.

Had to change my build script because [YUI compressor](https://github.com/yui/yuicompressor) didn't seem to work with JS classes.

Decided to try being more compact with the font data and reduced the SVG point accuracy by rounding to nearest decimal.

22nd August
-----------
![3D model with text overlay](aug22.png?raw=true "3D model with text overlay")

Bringing some of the various JS experiments together now to see how they work together. Up to 23% used now including SVG font, 3D to SVG render engine and single 3D model. The gold clock reminds me of the [TV series 24](https://en.wikipedia.org/wiki/24_(TV_series)).

Added gamepad support - taken mostly from the updates I'd done recently to last year's entry.

Noticed on slower machines that high polygon counts in the SVG could render slower so added shaperendering="optimizeSpeed" parameter.

Played about with various lighting methods to give a more solid structure to the 3D models.

Added seeded random number generator from last year's entry.

Added drawing of simple 3D models with HUD.

Fixed issue where 3D models had a property "n" for the name, however this was also used to store the face normals. So ended up renaming "n" to "t" for title.

23rd August
-----------
![SVG distortion test](aug23.png?raw=true "SVG distortion test")

Playing about with SVG distortion, gamepad control and rotating models, need to work on gameplay next.

Added [RFC4122 UUIDs](https://en.wikipedia.org/wiki/Universally_unique_identifier) to each model added to the active models array so they can be uniquely identified when dealing with hit detection.

Also added ability to transform 3D models before converting them from model coordinates into world coordinates.

24th August
-----------
Must resist the urge to tinker with my entry from last year. Although still keeping it within 13k by 85 bytes. :)

28th August
-----------
Now at the half way point.

Finally ... after much head scratching - got the trees to stick to the terrain.

Having weird issues with [Z draw order](https://en.wikipedia.org/wiki/Z-buffering), so decided to switch Z axis and use i[right-handed geometry](https://en.wikipedia.org/wiki/Cartesian_coordinate_system#In_three_dimensions). Also used average Z depth rather than furthest point of face.

Added model velocity vectors.

29th August
-----------
![Player 3D model source sketch](aug29.png?raw=true "Player 3D model source sketch")

![Player 3D model checking in Meshlab](aug29b.png?raw=true "Player 3D model checking in Meshlab")

Working on the player starship and added terrain generation with randomly placed trees.

Fixed gamepad controls.

Fixed another issue with Z draw order.

Increased ambient lighting as some models were getting a bit dark.

Changed to start in the centre of the generated terrain.

Testing model velocity vectors when placed in the world.

Changed the control method from navigate to fly.

I had a weird issue where the GamePad could cause the player to stutter on screen. I tracked this down to the GamePad update calls being in a different "thread" to the main update call.

Move the player model around to match the transformation of the view so that they are always visible and at the same relative position.

Feel like time is slipping away as I've got a family holiday planned for 9th to 13th September and don't want to take my laptop with me. Not best timing meaning I'll loose the last week of JS13k.

30% of 13k used.

30th August
-----------
Added starship leaning, gradient sky, support for keyboard and more gamepads.

37% of 13k used.

31st August
-----------
![Invader 3D model source sketch](aug31.png?raw=true "Invader 3D model source sketch")

Thought it was time to add some enemies.

Much easier. Should've made the player ship this simple.

2nd September
-------------
![Flight testing](sep2.png?raw=true "Flight testing")

Starting to feel more like a game ..

* Added Invaders
* Capability to fire spinning missiles
* Missile to Invader collision detection
* Sound effects (with [jsfxr](https://github.com/mneubrand/jsfxr))
* Multiple levels of difficulty
* Tilted camera down slightly
* Flashing boosters

3rd September
-------------
![HUD testing](sep3.png?raw=true "HUD testing")

Added moon, depth blur and score to [HUD](https://en.wikipedia.org/wiki/Head-up_display_(video_gaming)).

Improved SVG scale/crop when browser is resized, target size 1280x720 16:9.

Added level transition once completed.

Changed player to always be moving.

Added missile 3D object.

Made starship boosters flash.

More jsfxr sound effects added.

Allow 14-segment font to be scaled.

4th September
-------------
Allow player to fail level when all NPCs are infected.

Added mouse [strafing](https://en.wikipedia.org/wiki/Strafing_(gaming)).

Started the game state machine to transition between title screen, in-play and game WIN or LOOSE.

Found the infection radius size in the hit detection between invaders was a bit too large making the game a bit tricky.

Change strategy from killing invaders to disinfecting invaders. So the infected ones are shown in red.

Disinfection missiles were a bit small, so increased the size.

Fixed issue with Y coordinates being flipped when writing 14-segment text.

The face depth blur was slowing the [FPS](https://en.wikipedia.org/wiki/Frame_rate) down too much, so reduced it to use less levels of blur.

Allow shots to pass non-infected [NPCs](https://en.wikipedia.org/wiki/Non-player_character) to make the game a bit easier.

5th September
-------------
Added animation timelines using module from last year's entry.

More obvious level up with "LEVEL n" display.

7th September
-------------
![Title screen](sep7.png?raw=true "Title screen")

Added spinning invader model to title screen.

Added infection status bar to HUD.

8th September
-------------
Made the uninfected starships try to avoid the infected ones.

Submitted game early on the last day before my weeks holiday.

73% of 13k used with 3530 bytes left.

Go [play the game NOW](https://2019.js13kgames.com/entries/backspace-return-to-planet-figadore) if you haven't already :)

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

