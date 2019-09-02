var audio_url=window.URL || window.webkitURL;

function audio_playsound(params)
{
  try
  {
    var soundURL=jsfxr(params);
    var player=new Audio();

    player.src=soundURL;
    player.play();
    player.addEventListener('ended', function(e) {
      audio_url.revokeObjectURL(soundURL);
      }, false);
  }

  catch (e) {}
}

function audio_explosion()
{
  audio_playsound([3,,0.3708,0.5822,0.3851,0.0584,,-0.0268,,,,-0.0749,0.7624,,,,,,1,,,,,0.5]);
}

function audio_collect()
{
  audio_playsound([1,,0.0957,0.3189,0.3562,0.5325,,,,,,0.5407,0.6494,,,,,,1,,,,,0.5]);
}

function audio_laser()
{
  audio_playsound([,,0.2311,0,0.1885,0.5784,0.2,-0.2543,,,,,,0.1326,0.0283,,0.0899,-0.0316,1,,,0.2648,,0.5]);
}

function audio_missile()
{
  audio_playsound([3,0.0324,0.7427,0.2327,-0.3593,0.1788,,0.1083,-0.1552,-0.6967,0.9526,0.4280,-0.2025,-0.8107,-0.0003,0.9058,0.1206,0.1947,0.1594,-0.0476,-0.2936,0.2408,-0.0482,0.25]);
}

function audio_alien()
{
  audio_playsound([1,-0.3997,0.4534,0.4353,-0.3988,0.6939,,-0.2292,0.0213,0.5732,0.2278,0.7962,-0.8172,-0.3081,-0.9170,0.7628,-0.3341,0.0690,0.9999,-0.0474,-0.9969,,-0.1301,0.5]);
}
