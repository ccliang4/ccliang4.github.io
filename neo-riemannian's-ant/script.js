const Front = 0, Right = 1, Back = 2, Left = 3;
const WaveTypeList = ['sine', 'triangle', 'sawtooth', 'square'];
const ColorDirList = [];
const PosMatrix = [
	[[0, -1],[1, 0],[0, 1],[-1, 0]],
	[[2, -1],[1, 0],[-1, 0],[0, -1]],
	[[2, 1],[0, 1],[-1, 0],[1, 0]],
	[[0, 1],[-1, 0],[0, -1],[1, 0]],
	[[-2, 1],[-1, 0],[1, 0],[0, 1]],
	[[-2, -1],[0, -1],[1, 0],[-1, 0]]
];
const VerMatrix = [3, 1, 3, 5];
const AntMatrix = [0, 1, 3, -1];

const NFArray = [
	27.500, 29.135, 30.868,
	32.703, 34.648, 36.708, 38.891, 41.203, 43.654, 46.249, 48.999, 51.913, 55.000, 58.270, 61.735,
	65.406, 69.296, 73.416, 77.782, 82.407, 87.307, 92.499, 97.999, 103.826, 110.000, 116.541, 123.471,
	130.813, 138.591, 146.832, 155.563, 164.814, 174.614, 184.997, 195.998, 207.652, 220.000, 233.082, 246.942,
	261.626, 277.183, 293.665, 311.127, 329.628, 349.228, 369.994, 391.995, 415.305, 440.000, 466.164, 493.883,
	523.251, 554.365, 587.330, 622.254, 659.255, 698.456, 739.989, 783.991, 830.609, 880.000, 932.328, 987.767,
	1046.502, 1108.730, 1174.659, 1244.508, 1318.510, 1396.913, 1479.978, 1567.982, 1661.219, 1760.000, 1864.655, 1975.533,
	2093.004, 2217.461, 2349.318, 2489.016, 2637.020, 2793.826, 2959.955, 3135.963, 3322.437, 3520.000, 3729.310, 3951.066,
	4186.009
];
const VerLenMatrix = [
	[-4, 0, 3],
	[-7, -4, 0],
	[-7, -3, 0],
	[-3, 0, 4],
	[0, 4, 7],
	[0, 3, 7]
];
const VerLenDirMatrix = [
	[[1, 0, 1, 0], [-1, 0, 0, 2], [0, -1, 0, 0], [0, 0, 2, 1]],
	[[-1, -1, 0, 1], [-2, 0, 0, 2], [0, 0, 1, 1], [0, 1, 0, 0]],
	[[-2, -2, 0, 1], [0, -1, 0, 0], [0, 0, 2, 1], [-1, 0, 0, 2]],
	[[-1, 0, -1, 0], [0, 0, 1, 1], [0, 1, 0, 0], [-2, 0, 0, 2]],
	[[0, 1, 1, 2], [0, 0, 2, 1], [-1, 0, 0, 2], [0, -1, 0, 0]],
	[[0, 2, 2, 2], [0, 1, 0, 0], [-2, 0, 0, 2], [0, 0, 1, 1]]
];
//const VerLenDirMatrix = [
//	[[1, 0, 1], [4, 3, 4], [0, -1, 0], [-3, -4, -3]],
//	[[7, 8, 7], [3, 4, 3], [-4, -3, -4], [0, 1, 0]],
//	[[7, 6, 7], [0, -1, 0], [-3, -4, -3], [4, 3, 4]],
//	[[-1, 0, -1], [-4, -3, -4], [0, 1, 0], [3, 4, 3]],
//	[[-7, -8, -7], [-3, -4, -3], [4, 3, 4], [0, -1, 0]],
//	[[-7, -6, -7], [0, 1, 0], [3, 4, 3], [-4, -3, -4]]
//];

var Run = -1, Delay = 500, Notes = [-4, 0, 3];
var Vertex, Reverse, Pos, posMap, ci, AntDir;

function update() {
	ci = posMap.get(Pos.toString());
	if (ci === undefined) {
		ci = 0;
	}
	$('#info').text(Notes.toString());
	sound();
	let d = ColorDirList[ci][1];
	AntDir += AntMatrix[d];
	if (Reverse) {
		if (d % 2) {
			AntDir += AntMatrix[d];
		}
		d = (d + 2) % 4;
	}

	let [x, y] = Pos.map((num, index) => num + PosMatrix[Vertex][d][index]);
	$('#ant').css({transform:'translate('+(x*20+18)+'px, '+(y*40+19)+'px) rotate('+(AntDir)*60+'deg)',transition:'transform '+(Delay/3000)+'s ease'});

	for(let i = 0; i < Notes.length; i++) {
		Notes[i] += VerLenDirMatrix[Vertex][d][i];
	}
	for(let i = 0; i < VerLenDirMatrix[Vertex][d][3]; i++) {
		let tnote = Notes.pop();
		Notes.unshift(tnote);
	}

	Vertex = (Vertex + VerMatrix[d]) % 6;
	if (ColorDirList[ci][1] === Front) {
		Reverse ^= 1;
	} else if (ColorDirList[ci][1] !== Back) {
		Reverse = 0;
	}
	ci = (ci + 1) % ColorDirList.length;
	posMap.set(Pos.toString(), ci);

	let pid = 'p_' + Pos[0] + '_' + Pos[1], $p = $('#'+pid);

	if ($p.length === 0) {
		$('#container').append("<div id='"+pid+"' class=triangle></div>");
		$p = $('#'+pid);
	}
	$p.css({transform:'translate('+Pos[0]*20+'px, '+Pos[1]*40+'px)'});
	if (Math.abs(Pos[0]+Pos[1])%2) {
		$p.css({'border-top': '38px solid '+ColorDirList[ci][0]});
	} else {
		$p.css({'border-bottom': '38px solid '+ColorDirList[ci][0]});
	}
	Pos[0] = x;
	Pos[1] = y;
}

function sound() {
	const audioContext = new (window.AudioContext || window.webkitAudioContext)();
	let currentTime = audioContext.currentTime;
	let sortedNotes = Notes.toSorted((a, b) => a - b);

	function playTone(frequency, wtype, volume, ctime, duration) {
		const oscillator = audioContext.createOscillator();

		oscillator.type = wtype;
		oscillator.frequency.setValueAtTime(frequency, ctime);
		const gainNode = audioContext.createGain();
		gainNode.gain.setValueAtTime(volume, ctime);
		oscillator.connect(gainNode);
		gainNode.connect(audioContext.destination);
		oscillator.start(ctime);
		oscillator.stop(ctime + duration);
	}

	function playSine() {
		let time = currentTime, segmentDuration = Delay / 6000;
		for(let i = 0; i < 6; i++) {
			playTone(NFArray[(sortedNotes[i % 3] + 39 + 88) % 88], 'sine', 1, time, segmentDuration);
			time += segmentDuration;
		}
	}

	function playTriangle() {
		let time = currentTime, segmentDuration = Delay / 4000;
		for(let i = 2; i >= 0; i--) {
			playTone(NFArray[(sortedNotes[i] + 39 + 12 + 88) % 88], 'triangle', 0.5, time, segmentDuration);
			time += segmentDuration;
		}
		playTone(NFArray[(sortedNotes[2] + 39 + 88) % 88], 'triangle', 0.5, time, segmentDuration);
	}

	function playSawtooth() {
		let time = currentTime, segmentDuration = Delay / 8000;
		for(let i = 0; i < 8; i++) {
			playTone(NFArray[(sortedNotes[0] + 39 + 88) % 88], 'sawtooth', 0.4, time, segmentDuration);
			time += segmentDuration;
		}
	}

	function playSquare() {
		let time = currentTime, segmentDuration = Delay / 4000;
		for(let i = 0; i < 4; i++) {
			if (i % 2 === 0) {
				playTone(NFArray[(sortedNotes[2] + 39 + 12 + 88) % 88], 'square', 0.2, time, segmentDuration);
			}
			time += segmentDuration;
		}
	}

	playSine();
	if (ci > 0) {
		playTriangle();
	}
	if (ci > 1) {
		playSawtooth();
	}
	if (ci > 2) {
		playSquare();
	}
}

function initialize() {
	Run = 0;
	Vertex = parseInt($('#vertex').val(), 10);
	AntDir = Vertex;
	if (Vertex % 2) {
		Pos = [1, 0];
	} else {
		Pos = [0, 0];
	}
	Reverse = 0;
	if ($('#reverse').prop('checked')) {
		Reverse = 1;
		AntDir = (AntDir + 3) % 6;
	}
	let note = (parseInt($('#octave').val(), 10) - 4) * 12 + parseInt($('#note').val(), 10);
	ColorDirList.length = 0;
	$('#colordir .recorddiv').each(function() {
		ColorDirList.push([
			$(this).find('input').val(),
			parseInt($(this).find('select').val(), 10)
		]);
	});
	for(let i = 0; i < Notes.length; i++) {
		Notes[i] = note + VerLenMatrix[Vertex][i];
	}
	posMap = new Map();
	if ($('#setbg').prop('checked')) {
		$('body').css({'background-color':ColorDirList[0][0]});
	} else {
		$('body').css({'background-color':'#c0c0c0'});
	}
	if ($('#ant_w').prop('checked')) {
		$('body').css({'color':'white'});
		$('#ant').css({'background':'url(ant_w.png)'});
	} else {
		$('body').css({'color':'black'});
		$('#ant').css({'background':'url(ant.png)'});
	}
	
	$('#ant').css({display:'block',transform:'translate('+(Pos[0]*20+18)+'px, '+(Pos[1]*40+19)+'px) rotate('+AntDir*60+'deg)'});
}

function control() {
	if (Run === 1) {
		Delay = parseInt($('#delay').val(), 10);
		update();
	}
	setTimeout(control, Delay);
}

$(document).ready(function() {
	let recordCount = 1;
	$('#addRecord').click(function() {
		if (recordCount < 8) {
			const record = $(`
	    <div class=recorddiv>
		<input type=text placeholder=Color>
		<select>
		    <option value=0>Front</option>
		    <option value=1>Right</option>
		    <option value=2>Back</option>
		    <option value=3>Left</option>
		</select>
		<button class=removebutton>Remove</button>
	    </div>
			`);
			$('#colordir').append(record);
			recordCount++;
		}
	});
	$(document).on('click', '.removebutton', function() {
		$(this).parent('.recorddiv').remove();
		recordCount--;
	});
	$('#octave').change(function() {
		if ($('#octave').val() === '0') {
			$('#note option[value=9]').prop('selected', true);
		} else {
			$('#note option[value=0]').prop('selected', true);
		}
		for(let i = 0; i < 12; i++) {
			$('#note option[value='+i+']').prop('disabled',
				($('#octave').val() === '0' && i < 9) || ($('#octave').val() === '8' && i > 0) ? true : false);
		}
	});
	$('#start').click(function() {
		if (Run === -1) {
			initialize();
		}
		Run ^= 1;
		if (Run) {
			$('#start').val('Pause');
		} else {
			$('#start').val('Resume');
		}
	});
	$('#reset').click(function() {
		Run = -1;
		$('#container').empty();
		$('#start').val('Start');
	});
	control();
});
