//FX
var loaded= false

// convolver.toMaster();
Tone.Buffer.onload = function(){
loaded = true;
};
Tone.Transport.bpm.value = 80;
var compressor = new Tone.Compressor(20, 3);
 compressor.knee.value = 10;
var delay = new Tone.PingPongDelay("4n", 0.2);
delay.wet = 0.2;

var tremolo = new Tone.Vibrato(5, 0.5);

var waveshaper = Tone.context.createWaveShaper();
 var gain = new Tone.Volume(-10);
 var boost = new Tone.Filter(1400, "peaking");
 waveshaper.oversample = "none";
 waveshaper.curve = makeDistortionCurve(0.2);
 boost.gain.value = 6;

 var feedbackDelay = new Tone.FeedbackDelay(0.1, 0.9);
 feedbackDelay.wet = 0.5;

var pitchShift = 7;




//REVERB
var reverb = new Tone.Freeverb(0.9, 20000);
var wet = 0.5;
reverb.wet.value = wet;

var synth = new Tone.PluckSynth().chain(compressor, waveshaper, tremolo, feedbackDelay, delay, reverb, Tone.Master);
var noiseSynth = new Tone.NoiseSynth()
synth.attackNoise.value = 2;
// synth.volume.value = -6;


var tune = [1000, 5000];

nx.onload = function (){
string1.setStrings(1);
nx.colorize("#fff");
nx.colorize('fill',"#000");
  string1.on('*', function(data) {
    var stringPos = nx.scale(data.x, 0, 1, 500, 10000);
    synth.dampening.value = stringPos;

    //console.log(data.on);
    switch (data.string) {
      case 0:
          synth.triggerAttack(tune[0]);
        break;
      case 1:
      synth.triggerAttack(tune[1]);

        break;
      case 2:
      synth.triggerAttack(tune[2]);

        break;
        case 3:
        synth.triggerAttack(tune[3]);

          break;
        case 4:
        synth.triggerAttack(tune[4]);

          break;
        case 5:
        synth.triggerAttack(tune[5]);

          break;
      default:
          break;




    }
  })
    dial1.on('*', function(data){
      waveshaper.curve = makeDistortionCurve(nx.scale(data.value, 0, 1, 0, 0.5));


    })

    dial2.on('*', function(data){
      synth.resonance.value = nx.scale(data.value, 0, 1, 0, 0.9);


    })

    dial3.on('*', function(data){
          tremolo.frequency.value = nx.scale(data.value, 0, 1, 0, 10000);


    })


        dial4.on('*', function(data){
               feedbackDelay.wet = data.value;
               delay.wet = data.value;


        })

}

function makeDistortionCurve(amount) {

  var sampleRate = Tone.context.sampleRate;
  var curve = new Float32Array(sampleRate);

  // algos borrowed from https://github.com/Theodeus/tuna/blob/master/tuna.js#L1224

  // var k = 2 * amount / (1 - amount);
  // for (var i = 0; i < sampleRate; i++) {
  //   var x = i * 2 / sampleRate - 1;
  //   curve[i] = (1 + k) * x / (1 + k * Math.abs(x));
  // }

  var a = 1 - amount;
  for (var i = 0; i < sampleRate; i++) {
    var x = i * 2 / sampleRate - 1;
    var y = x < 0 ? -Math.pow(Math.abs(x), a + 0.04) : Math.pow(x, a);
    curve[i] = Math.tanh(y * 2);
  }

  return curve;
}
