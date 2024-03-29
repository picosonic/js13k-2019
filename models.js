// 3D models
var models=[
{
  t:"chipcube",
  v:[[-8,10,-10],[-10,10,-8],[-10,10,8],[-8,10,10],[8,10,10],[10,10,8],[10,10,-8],[8,10,-10],[-8,-10,-10],[-10,-10,-8],[-10,-10,8],[-8,-10,10],[8,-10,10],[10,-10,8],[10,-10,-8],[8,-10,-10],[-10,8,-10],[-10,8,10],[10,8,10],[10,8,-10],[-10,-8,-10],[-10,-8,10],[10,-8,10],[10,-8,-10]],
  f:[[1,2,3,4,5,6,7,8],[16,15,14,13,12,11,10,9],[3,2,17,21,10,11,22,18],[7,6,19,23,14,15,24,20],[17,1,8,20,24,16,9,21],[4,18,22,12,13,23,19,5],[1,17,2],[3,18,4],[5,19,6],[7,20,8],[10,21,9],[12,22,11],[14,23,13],[16,24,15]],
  c:[1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  s:10
},
{
  t:"tree",
  v:[[-0.5,-4,-0.5],[-0.5,-4,0.5],[0.5,-4,0.5],[0.5,-4,-0.5],[-0.5,0,-0.5],[-0.5,0,0.5],[0.5,0,0.5],[0.5,0,-0.5],[-3,0,-3],[-3,0,3],[3,0,3],[3,0,-3],[0,8,0]],
  f:[[1,5,8,4],[4,8,7,3],[1,2,6,5],[7,6,2,3],[9,13,12],[12,13,11],[11,13,10],[10,13,9],[9,12,11,10]],
  c:[9,9,9,9,10,10,10,10,10],
  s:10
},
{
  t:"starship",
  v:[[-5,-1,-9],[-5,-2,-9],[-3,-2,-7],[-2,-1,-7],[2,-1,-7],[3,-2,-7],[5,-2,-9],[5,-1,-9],[-3,0,-7],[-1,0,-7],[1,0,-7],[3,0,-7],[-3,1,-7],[-1,1,-7],[1,1,-7],[3,1,-7],[-3,0,-8],[-1,0,-8],[-3,1,-8],[-1,1,-8],[1,0,-8],[3,0,-8],[1,1,-8],[3,1,-8],[-5,-2,-7],[5,-2,-7],[-4,-2,-3],[4,-2,-3],[-3,-2,-2],[3,-2,-2],[-3,0,2],[3,0,2],[0,0,9],[-2,1,1],[0,1,5],[2,1,1],[1,2,1],[-1,2,1],[-1,2,0],[1,2,0],[-1,2,-1],[1,2,-1],[-2,2,-3],[2,2,-3],[-2,2,-5],[2,2,-5],[-1,2,-6],[1,2,-6],[0,2,2],[-2,1,-7],[2,1,-7]],
  f:[[9,13,19,17],[19,20,18,17],[20,14,10,18],[13,14,20,19],[9,17,18,10],[11,15,23,21],[15,16,24,23],[21,23,24,22],[11,21,22,12],[24,16,12,22],[2,25,27,29,4,3],[1,2,25],[1,25,2],[30,28,26,7,6,5],[8,7,26],
[8,26,7],[34,35,49,38],[35,36,37,49],[49,37,40,39,38],[35,34,31,33],[32,36,35,33],[33,31,29],[33,30,32],[39,40,42,44,46,48,47,45,43,41],[38,41,29],[38,29,34],[31,34,29],[37,30,42],[37,36,30],[32,30,36],[4,5,33],[4,33,29],[5,30,33],[4,9,13,16,12,5],[50,47,48,51],[45,47,50],[46,51,48],[9,4,29],[12,30,5],[13,9,29],[12,16,30],[29,41,43],[44,42,30],[29,43,45],[46,44,30],[29,45,50],[30,51,46],[29,50,13],[30,16,51]],
  c:[0,33,0,0,0,0,0,33,0,0,0,0,0,0,0,0,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0],
  s:20
},
{
  t:"missile",
  v:[[-5,5,-25],[5,5,-25],[5,-5,-25],[-5,-5,-25],[0,0,25]],
  f:[[1,2,3],[3,4,1],[1,5,2],[2,5,3],[3,5,4],[4,5,1]],
  c:[14,14,14,14,14,14],
  s:5
},
{
  t:"invader",
  v:[[0,-1,-3],[-2,0,2],[-1,1,3],[1,1,3],[2,0,2],[0,0,-1],[-1,1,2],[0,1,1],[1,1,2],[-1,-1,3],[1,-1,3]],
  f:[[6,7,8],[9,6,8],[4,3,10,11],[5,4,11],[3,2,10],[5,11,1],[2,1,10],[11,10,1],[3,8,7],[4,9,8],[3,4,8],[4,5,9],[3,7,2],[9,5,6],[2,7,6],[6,5,1],[2,6,1]],
  c:[4,4,0,38,38,0,0,0,0,0,0,0,0,0,0,0,0],
  s:50
},
{
  t:"moon",
  v:[[0,0,0]],
  f:[[1]],
  c:[15],
  s:50
}
];
