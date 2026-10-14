
var backgrounds = {
	'none': function(){ $('.background').css({background:''}); },

	'temples': function(){
		temple = temples[Math.floor(Math.random()*temples.length)];
		$('.background').css({backgroundImage:'url('+temple+')'});
	},

	'Temple Square at Christmas': function(){
		var backgrounds = [
			'slc_christmas1.png',
			'slc_christmas2.png',
			'slc_christmas3.png',
			'slc_christmas4.png',
			'slc_christmas5.png',
			'slc_christmas6.png',
			'slc_christmas7.png',
		];
		temple = backgrounds[Math.floor(Math.random()*backgrounds.length)];
		$('.background').css({backgroundImage:'url(./backgrounds/'+temple+')'});
	},

	'gradients':function() {
		colors = [
			{ red: Math.floor(Math.random()*256), green: Math.floor(Math.random()*256), blue: Math.floor(Math.random()*256), percent: Math.floor(Math.random()*30) },
			{ red: Math.floor(Math.random()*256), green: Math.floor(Math.random()*256), blue: Math.floor(Math.random()*256), percent: Math.floor(Math.random()*30)+33 },
			{ red: Math.floor(Math.random()*256), green: Math.floor(Math.random()*256), blue: Math.floor(Math.random()*256), percent: Math.floor(Math.random()*30)+66 }
		];
		position = [Math.floor(Math.random()*361), Math.floor(Math.random()*4)];
		$('.background').css({backgroundImage: '-webkit-linear-gradient('+Math.floor(Math.random()*361)+'deg, rgb('+colors[0].red+','+colors[0].green+','+colors[0].blue+') '+colors[0].percent+'%, rgb('+colors[1].red+','+colors[1].green+','+colors[1].blue+') '+colors[1].percent+'%, rgb('+colors[2].red+','+colors[2].green+','+colors[2].blue+') '+colors[2].percent+'%)'});
	},

};

document.title = 'Word Search';

var dictionary_link = 'http://www.thefreedictionary.com/_/search.aspx?tab=1&Word=';

var translate = {
	'New Puzzle':'',
	'Puzzle Settings':'',
	'settings':'',
	'print':'',
	'words left':'',
	'color scheme':'',
	'background':'',
	'new puzzle settings':'',
	'hide word list (harder)':'',
	'gray out non-word letters (easier)':'',
	'puzzle size': '',
	'timed puzzle': '',
	' best ':'',
	' last ':'',
	'start new puzzle':'',
	'close':'',
	'All Done!':'',
	'light on dark':'',
	'dark on light':'',
	'Click for a Hint':'',
	'Click a Word for a Hint':'Click a Word for a Hint',
	'Ready?':'',
	'Set?':'',
	'Go!':'',
	'Paused':'',
	'help':'How to Play',
	'instruction_text':'<p>Search the grid of letters for the words in the list. The words may be hidden in any direction. After you find one, highlight the word by selecting the first letter and drag to the last letter (or last to first). Continue until all words have been found.</p><p>Search Suggestions <ul><li>Look for obvious, rarely used or double letters in words.</li><li>Search each row for a letter and when found, look at the surrounding letters for the next letter in the word.</li> </ul> </p><p>Need a hint?  Tap a word in the list to see where the first letter of the word is in the grid.</p>'


};

for(var i in translate) if (translate[i] === '') translate[i] = i;
