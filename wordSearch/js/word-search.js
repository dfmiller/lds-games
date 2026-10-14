var version = 10;

window.oncontextmenu = function() { return false }

function $(selector) {
	if (typeof selector == 'string') {
		return enpower(document.querySelector(selector));
	} else {
		return enpower(selector);
	}
}

function element(tag, props) { return enpower(document.createElement(tag), props); }

function enpower(e, props) {
	if (!e) { e = document.createElement('i'); }
	e.css = function(props) {
		if (typeof props == 'object') {
			for(var i in props) e.style[i] = props[i];
			return this;
		} else {
			return this.style[props];
		}
	};
	e.show = function() { e.css({display:''}); return this; };
	e.hide = function() { e.css({display:'none'}); return this; };
	e.hasClass = function(props) { return e.classList.contains(props); };
	e.addClass = function(props) { e.classList.add(props); return e; };
	e.removeClass = function(props) { e.classList.remove(props); return e; };
	e.isHidden = function() { return (window.getComputedStyle(e).display === 'none') };
	e.toggle = function() {
		if (e.isHidden()) {
			e.css({display:''}); return this;
		} else {
			e.css({display:'none'}); return this;
		}
	};

	e.bind = function(props) {
		for(var i in props) e.addEventListener(i, props[i], false);
		return this;
	};
	e.attr = function(a,b) {
		this.setAttribute(a, b);
		return this;
	};
	for(var i in props) {
		switch(i) {
			case 'style': e.css(props[i]); break;
			case 'events': e.bind(props[i]); break;
			case 'innerHTML': e[i] = props[i]; break;
			default: e.setAttribute(i, props[i]); break;
		}
	}
	e.adopt = function() {
		for(var i in arguments) this.appendChild(arguments[i]);
		return this;
	};
	return e;
}


Math.rnd = function(max, min) {
	min = (!min ? 0 : min);
	return Math.floor(Math.random()*(max-min+1)+min);
}
Math.sign = function(n) { return(n<0?-1:(n>0?1:0)); }

var filter = /[^a-záéíóúñü]/ig;

compare = function(a,b){
	if (a.word) a = a.word;
	if (b.word) b = b.word;
	return a.toLowerCase().replace(filter,'').localeCompare(b.toLowerCase().replace(filter,''));
};

var Trunk = {};

try {
	var mod = 'localstoragetest';
	localStorage.setItem(mod, mod);
	localStorage.removeItem(mod);
	var useLocalStorage = true;
} catch(e) {
	var useLocalStorage = false;
}

if (useLocalStorage) {
	Trunk.load = function(varname, defaultValue) {
		if (typeof localStorage[varname] == 'undefined') {
			return defaultValue;
		}
		try {
			return JSON.parse(localStorage[varname])
		} catch(e) {
			return localStorage[varname];
		}
	},
	Trunk.save = function(varname, value) {
		if (typeof value == 'object') {
			value = JSON.stringify(value);
		}
		Trunk[varname] = localStorage[varname] = value;
	};
	init();
} else if (chrome && chrome.storage && chrome.storage.sync) {
	chrome.storage.sync.get(null, function(trunk) {
		Trunk = JSON.parse(JSON.stringify(trunk));
		Trunk.load = function(varname, defaultValue) {
			if (typeof Trunk[varname] == 'undefined') {
				return defaultValue;
			}
			return Trunk[varname];
		};
		Trunk.save = function(varname, value) {
			Trunk[varname] = value;
			var values = {};
			values[varname] = value
			chrome.storage.sync.set(values);
		};
		init();
	})
} else {
	Trunk.load = function(varname, value) { return value; };
	Trunk.save = function() {};
	Trunk.remove = function() {};
	console.log('unsupported device');
	init();
}


function init() {

	var board = [], SIZE, MAX_WORDS, hilites = [], wordStart = {}, wordEnd = {}, hilite = null, w = 1024, h = 768, SCALE = 0, current_word = 0, interval = null, dblclick = 0, pos = false, holidayTitle = '', puzzleTitle = ''

	achievements = Trunk.load('achievements', {
		total_completed: 0,
		hidden_list: 0,
		timed: 0,
		grayed: 0,
		largest: 0,
		max_words: 0,
		all_themes: 0,
		all_sizes: 0,
		all_backgrounds: 0,
	}),

	selections = Trunk.load('selections', []),
	usedWords = Trunk.load('usedWords', []),
	secs = Trunk.load('secs', 0),

	backgroundColor = Trunk.load('backgroundColor', ''),
	layout = Trunk.load('layout', false),
	showSelectedLetter = Trunk.load('showSelectedLetter', 1),
	colorScheme = Trunk.load('colorScheme', 'white-on-black'),
	newScale = Trunk.load('newScale', 1.5),
	grayOut = Trunk.load('grayOut', 0),
	hideList = Trunk.load('hideList', 0),
	hideVowels = Trunk.load('hideVowels', 0),
	limitWords = Trunk.load('limitWords', 0),
	useTimer = Trunk.load('useTimer', 0),
	hiliteStyle = Trunk.load('hiliteStyle', 'multi'),
	times = Trunk.load('times', {
		0:5999,1:5999,2:5999,3:5999,4:5999,5:5999,6:5999,7:5999,
		8:5999,9:5999,10:5999,11:5999,12:5999,13:5999,14:5999,15:5999,
		'best':5999,'last':5999
	});

	var currentList = Trunk.load('currentList', []);
	var pastList = Trunk.load('pastList', []);

	var futureList = JSON.parse(JSON.stringify(masterList));

	var wordGrid = Trunk.load('wordGrid', []);
	var wordsLeft = Trunk.load('wordsLeft', 0);
	var words = Trunk.load('words', []);
	var letters = Trunk.load('letters', []);
	var useRandom = Trunk.load('useRandom', 0);

	var loading = element('div', {id:'loading',class:'loader'}).hide();

	$('#wrapper').adopt(loading);

	var dialog = {
		dialog: null,
		show: function(content, opts) {
			if (this.dialog) this.hide();
			if (typeof(content) == 'string') content = element('div', {innerHTML:content});
			buttons = element('div', {id:'dialog-buttons'});
			var title = opts.title ? opts.title : '';
			className = opts.class ? opts.class : '';
			events = opts.events ? opts.events : {};
			if (opts) {
				opts.title += '';
				for(var i in opts.buttons) {
					buttons.adopt(element('button', { type: 'button', class: 'button', innerHTML : translate[i], events: { click: opts.buttons[i] }}));
				}
			}
			this.dialog = element('div', {id:'dialog'}).adopt(
				element('div', { id:'dialog-content', class:className, events:events }).adopt(
					element('div').adopt(element('div', {id:'dialog-title',innerHTML:title}), content, buttons)
				)
			);
			$('#body').adopt(this.dialog);
			document.getElementById('dialog').onclick=function(e) { e.stopPropagation(); }
			this.dialog.show();
		},
		hide: function() {
			this.dialog.style.display = 'none';
			this.dialog.parentNode.removeChild(this.dialog);
			this.dialog = null;
		}
	};

	function od(t) {
		t = t.replace(/[́!.:?,;"]/g, '').replace(/[\n\t ]/g, ' ').replace(/^\s+|\s+$/, '');
		if (t) {
			window.open(
				dictionary_link+encodeURIComponent(t),
				'dict',
				'width=700,height=500,resizable=1,menubar=1,scrollbars=1,status=1,titlebar=1,toolbar=1,location=1,personalbar=1'
			);
		}
	}

	var help = element('div', { id:'help_dialog'}).adopt(
		element('div', { id:'help-text', innerHTML: translate['instruction_text']})
	);

	var feedback = $('#feedbackContent');
	var new_game = $('#newGameContent');
	var settings = $('#settingsContent');
	var menu = $('#menuContent');

	//events
	$('#layout').bind({ change: function() { Trunk.save('layout', this.value); $('#control').attr('class', this.value); $('#board').attr('class', this.value); } });
	$('#show-selected-letter').bind({ change: function() { Trunk.save('showSelectedLetter', showSelectedLetter = (this.checked?1:0)); } });
	$('#color-scheme').bind({ change: function() { Trunk.save('colorScheme', this.value); $('#edge').attr('class',this.value); $('#c2').attr('class',this.value); $('#menu').attr('class',this.value); } });
	$('#background-color').bind({ change:function() { Trunk.save('backgroundColor', backgroundColor = this.value); backgrounds[this.value](); } });
	$('#hide-word-list').bind({ click:function() { Trunk.save('hideList', hideList = (this.checked?1:0)); showBestTime(); }});
	$('#hide-vowels').bind({ click:function() { Trunk.save('hideVowels', hideVowels = (this.checked?1:0)); showBestTime(); }});
	$('#limit-word-count').bind({ click:function() { Trunk.save('limitWords', limitWords = (this.checked?1:0)); showBestTime(); }});
	$('#gray-out-non-word-letters').bind({ click:function() { Trunk.save('grayOut', grayOut = (this.checked?1:0)); showBestTime(); }});
	$('#use-random').bind({ change:function() { Trunk.save('useRandom', useRandom = this.value); }});
	$('#board-size').bind({ change:function() { Trunk.save('newScale', newScale = this.value); showBestTime(); }});
	$('#use-timer').bind({ click:function() { Trunk.save('useTimer', useTimer = (this.checked?1:0)); }});
	$('#hilite-style').bind({ change:function() {
		hiliteStyle = this.value;
		var hilites = document.querySelectorAll('.hilite');
		for (var i=0;i<hilites.length;++i) {
			setHilite(hilites[i], hiliteStyle)
		};
		Trunk.save('hiliteStyle', hiliteStyle);
	}});


	function setHilite(hilite, style) {
		switch(style) {
			default:
				hilite.css({
					background: '',
					border: '',
					boxShadow: ''
				});
			break;
			case 'silver':
				hilite.css({
					background: '',
					border: 'none',
					boxShadow: ''
				});
			break;
			case 'multi':
				hilite.css({
					background: 'rgba('+Math.rnd(255,128)+','+Math.rnd(255,128)+','+Math.rnd(255,128)+',.5)',
					border: 'none',
					boxShadow: 'none'
				});
			break;
		}
	}


	function dialogHide() {
		dialog.hide();
		if (currentList.length == 0) {
			dialog.show(menu, { title:'' });
		}
	}


	function resize() {
		let innerHeight = (window.innerHeight - 50)
		ratio = (Math.max(100, (window.innerWidth > innerHeight) ? Math.min(window.innerWidth/4, innerHeight/3) : Math.min(innerHeight/4, window.innerWidth/3)))/256;
		if (window.innerWidth > innerHeight) {
			//landscape
			l = (window.innerWidth - (ratio*1024))/2 - (1-ratio)*1024/2;
			t = (innerHeight - (ratio*768))/2 - (1-ratio)*768/2;

			$('#wrapper').css({ webkitTransform:'scale('+ratio+')', left: l+'px', top:t+'px' });

		} else {
			//portarait
			l = (window.innerWidth - (ratio*768))/2 - (1-ratio)*768/2;
			t = (innerHeight - (ratio*1024))/2 - (1-ratio)*1024/2;

			$('#wrapper').css({ webkitTransform:'scale('+ratio+')', top: t+'px', left:l+'px' });
		}
	}


	function n() {
		if (backgroundColor == '') {
			for (i in backgrounds) {
				if (i != 'none') {
					backgroundColor = i;
					break;
				}
			}
		}

		window.addEventListener('resize', function() { setTimeout(function() { resize(); }, 500) },false);

		document.body.id = 'body';

		var lastTouch, lastX, lastY;

		touchElement = function(e) {
			e.preventDefault();
			e = e.originalEvent || e;
			var x = e.changedTouches[0].pageX;
			var y = e.changedTouches[0].pageY;
			var el = document.elementFromPoint(x, y);
			if (el && el.tagName == 'SPAN') {
				return el;
			} else {
				return null;
			}
		}

		$('#board').bind({
			touchstart: function(e) { startSelect(e, touchElement(e)); },
			touchmove : function(e) {
				el = touchElement(e);
				if (el == lastTouch || !el) return;
				lastTouch = el;
				moveSelect(e, el);
				endSelect(e, el, false);
			},
			touchend: function(e) {
				endSelect(e, touchElement(e), true);
			}
		});

		$('#wL').bind({
			click: function(e) {
				if (hideList) {
					$('#wL span.hide').removeClass('hide');
				}
			}
		});


		$('#control').css({ fontSize: Math.floor(w/36)+'px', lineHeight: Math.floor(w/35)+'px'});

		$('.menu_button').bind({ click: function() { dialog.show(menu, {title:'',buttons:{'close':function(){ dialogHide(); }}}); }});

		$('.settings').bind({ click: function() { dialog.show(settings, {title:'<i class="sm fa fa-tasks"></i> '+translate['Puzzle Settings'],buttons:{'close':function(){ dialogHide(); }}}); }});

		$('.new_game').bind({ click: function() { dialog.show(new_game, {title:'<i class="sm fa fa-refresh"></i> '+translate['New Puzzle'],buttons:{'start new puzzle':function(){ dialog.hide(); loading.show(); setTimeout(function() { new_puzzle(1); }, 500) },'close':function(){ dialogHide();}}}); }});

		$('.new_game2').bind({ click: function() { dialog.show(new_game, {title:'<i class="sm fa fa-refresh"></i> '+translate['New Puzzle'],buttons:{'start new puzzle':function(){ dialog.hide(); loading.show(); setTimeout(function() { new_puzzle(1); }, 500) },'close':function(){dialogHide();}}}); }});

		$('.print').bind({ click: function() { dialogHide(); window.print(); } });

		$('#timer').bind({ click:function() { pauseTimer(); }});

		$('.feedback').bind({click: function() { dialog.show( feedback, {title:'<i class="sm fa fa-bullhorn"></i> Feedback', buttons:{'close':function(){dialogHide();}}}); }});

		$('.help').bind({click: function() { dialog.show( help, {title:'<i class="sm fa fa-question-circle"></i> '+translate['help'], buttons:{'close':function(){dialogHide();}}}); }});

		$('#words-left').attr('title', translate['Click for a Hint']).bind({click:function() {
			evt = document.createEvent('HTMLEvents');
			evt.initEvent('click',true,true);
			$('#'+words[current_word].id).dispatchEvent(evt);
		}});

		try { backgrounds[backgroundColor](); } catch(e) {}

		resize();
		setTimeout(function() { resize(); }, 1000);

		if (!layout) {

			Trunk.save('layout', layout = 'right-handed');
			$('#show-selected-letter').checked = true;

			dialog.show(settings, {title:'<i class="sm fa fa-sliders"></i> '+translate['Puzzle Settings'],buttons:{'close':function(){
				dialogHide();
				dialog.show(menu, { title:'' });
			}}});

		} else {

			if (currentList.length == 0) {
				dialog.show(menu, { title:'' });
			} else {
				new_puzzle();
			}
		}

		if (/android/i.test(navigator.userAgent)) {
			$('.print').hide();
		}

		for(i in backgrounds) {
			$('#background-color').adopt(element('option', { value:i, innerHTML:i, selected:'selected' } ));
		}

		if (Trunk.load('grayOut', 0)) $('#gray-out-non-word-letters').setAttribute('checked', 'true');
		if (Trunk.load('hideList', 0)) $('#hide-word-list').setAttribute('checked', 'true');
		if (Trunk.load('hideVowels', 0)) $('#hide-vowels').setAttribute('checked', 'true');
		if (!Trunk.load('limitWords', 1)) $('#limit-word-count').removeAttribute('checked');
		if (Trunk.load('useTimer', 0)) $('#use-timer').setAttribute('checked', 'true');
		if (Trunk.load('showSelectedLetter', 0)) $('#show-selected-letter').setAttribute('checked', 'true');

		$('#layout').value = layout;

		$('#use-random').value = useRandom;

		$('#board-size').value = newScale;

		$('#color-scheme').value = colorScheme;

		$('#background-color').value = backgroundColor;

		$('#hilite-style').value = hiliteStyle;

		$('#edge').attr('class',colorScheme); $('#c2').attr('class',colorScheme); $('#menu').attr('class',colorScheme);

		$('#control').addClass(layout);
		$('#board').addClass(layout);

		puzzleIndex = (newScale-1)*2 + (grayOut ? 0 : 1) + (hideList ? 8 : 0);
		$('#best-time').innerHTML = formatTime(times[puzzleIndex]);
		$('#last-time').innerHTML = formatTime(times['last']);
	}

	function buildBoard(w,h) {
		ROWS = 8*SCALE;
		MAX_WORDS = 10 * SCALE;

		SIZE = Math.floor(h*(.12/SCALE));
		SIZE_A = Math.floor(SIZE * .7);
		SIZE_C = Math.floor(SIZE - SIZE_A);
		SIZE_D = Math.floor(SIZE_C/2)-2;
		SIZE_B = Math.floor(SIZE_A/2)+2;

		$('#wrapper').css({
			width: w+'px',
			height: h+'px',
			'font-size': Math.floor(w/(15*SCALE))+'px',
			'line-height': SIZE+'px'
		});

		$('#word-list').css({fontSize:Math.floor(w/(4+16*SCALE))+'px',lineHeight:Math.floor(w/(4+16*SCALE))+'px'});

		if (SCALE == 1) {
			$('#title').css({fontSize:Math.floor(w/(4+16*2))+'px',lineHeight:Math.floor(w/(4+16*2))+'px'});
		}

		//initialize
		$('#edge').innerHTML = '';
		for(j=0;j<ROWS;j++) {
			d = element('div', {style: { height: SIZE + 'px' } });
			for(i=0;i<ROWS;i++) {
				d.adopt(
					element('span', {id:'L-'+j+'-'+i, class:'letter', r:j, c:i,
						style: { width: SIZE + 'px', height: SIZE + 'px' },
						events: {
							mousedown: function(e) { startSelect(e, this); },
							mouseover: function(e) {
								moveSelect(e, this);
								endSelect(e, this, false);
							},
							mouseup: function(e) {
								endSelect(e, this, true);
							}
						}
					})
				);
			}
			$('#edge').adopt(d);
		}

		$('.background').bind({mouseup: function(e) {
			endSelect(e, this, true);
		}, touchend: function(e) {
			endSelect(e, this, true);
		}})

	}

	function new_puzzle(new_list) {

		try { backgrounds[backgroundColor]() } catch(e) {}

		if (dialog.dialog) {
			setTimeout(function() { dialog.hide(); }, 1);
		}

		current_word = 0;

		for(var i in hilites) {
			hilites[i].parentNode.removeChild(hilites[i]);
			hilites[i].delete;
		}
		hilites = [];
		if (SCALE != newScale) {
			SCALE = newScale;
			buildBoard(w, h);
		}

		var lettersObject = {};

		if (new_list == 1 || currentList.length == 0) {
			selections = [];
			words = [];
			wordsLeft = 0;
			letters = [];
			secs = 0;

			if (useRandom == 1) {
				title = 'random';
				wordList = randomList;
				currentList = {};
				currentList[title] = wordList;
			} else {

				var doLoops = 0
				do {
					if (futureList.length == 0) {
						futureList = JSON.parse(JSON.stringify(masterList));
						pastList = [];
					}

					var r = Math.floor(Math.random()*futureList.length);

					currentList = futureList.splice(r,1)[0];

					for(title in currentList) {
						wordList = currentList[title];
						break;
					}

				} while (pastList.indexOf(title) != -1 && ++doLoops < 50);

			}

			if (typeof pastList == 'string') {
				pastList = [pastList]
			}

			pastList.push(title);

			Trunk.save('title', title);
			Trunk.save('currentList', currentList);
			Trunk.save('pastList', pastList);
			Trunk.save('selections', selections);

		} else {

			for(title in currentList) {
				wordList = currentList[title];
				break;
			}

			selections.map(function(selection) {
				hilite = element('div', {id:'hilite',class:'hilite'});
				hilite.css({
					display: selection.display,
					minWidth: selection.minWidth,
					//height: selection.height,
					borderRadius: selection.borderRadius,
					webkitTransformOrigin: selection.webkitTransformOrigin,
					webkitTransform: selection.webkitTransform,
					top: selection.top,
					left: selection.left,
					width: selection.width
				});

				setHilite(hilite, hiliteStyle);

				$('#edge').adopt(hilite);

				hilite.setAttribute('class', 'hilite');
				hilite.removeAttribute('id');
				hilites[hilites.length] = hilite;

				hilite = null;
				return selection;
			});
		}

		$('#timer').innerHTML = formatTime(secs);

		if (wordGrid.length == 0 || words.length == 0) {

			//reset wordGrid
			for(var j=0;j<ROWS;j++){wordGrid[j]=[];for(var i=0;i<ROWS;i++)wordGrid[j][i]='';}

			//sort and remove duplicates
			wordList = wordList.sort(compare).filter(function(item, pos, ary) {
				return !pos || item.toLowerCase().replace(filter,'') != ary[pos - 1].toLowerCase().replace(filter,'');
			})

			var startTime = Date.now()

			//fill wordGrid
			for(var i=0;i<2000;i++) {

				if ((Date.now() - startTime) > 3000) {
					i = 9999
					break;
				}

				//pick word
				var r = Math.rnd(wordList.length-1);
				word = { word:wordList[r], id:wordList[r].toLowerCase().replace(filter,'') };

				//pick direction
				dx = dy = 0;
				while(dx==0 && dy==0) {
					dx = Math.rnd(1,-1);
					dy = Math.rnd(1,-1);
				}
				//find location
				L = word.id.length;
				fits = false;

				for(j=0; j<L; j++) {
					//if already on wordGrid...
					if (lettersObject[word.id[j]]) {
						letter = lettersObject[word.id[j]];
						for(k=0;k<letter.length;k++) {
							for(n=0;n<3;n++) {
								rx = letter[k].x - (j*dx);
								ry = letter[k].y - (j*dy);
								if (rx >=0 && rx < ROWS && ry >= 0 && ry < ROWS && (rx+dx*L) >= 0 && (rx+dx*L) < ROWS && (ry+dy*L) >= 0 && (ry+dy*L) < ROWS) {

									x=y=0;
									fits=true;
									for(m in word.id) {
										if (wordGrid[rx+x][ry+y] != '' && wordGrid[rx+x][ry+y] != word.id[m]) {
											fits = false;
											break;
										}
										x+=dx; y+=dy;
									}
								}
								if (!fits) {
									dz=-dx; dx=dy; dy=dz;
								} else {
									k = 9999; j = L; n = 4;
								}
							}
						}
					}
				}

				//
				if (!fits) {
					rx = Math.rnd(ROWS-(dx==0 ? 0 : L)-1) + (dx == -1 ? L : 0);
					ry = Math.rnd(ROWS-(dy==0 ? 0 : L)-1) + (dy == -1 ? L : 0);
					fits = true; x=y=0;
					for(n=0;n<3;n++) {
						for(m in word.id) {
							if (!wordGrid[rx+x] || wordGrid[rx+x][ry+y] || (wordGrid[rx+x][ry+y] != '' && wordGrid[rx+x][ry+y] != word.id[m])) {
								fits = false;
								break;
							}
							x+=dx; y+=dy;
						}
						if (!fits) {
							dz=-dx; dx=dy; dy=dz;
						} else {
							n = 4;
						}
					}
				}

				if (fits) {
					//put it in
					word.position = {x:rx,y:ry};
					for(m in word.id) {
						wordGrid[rx][ry] = word.id[m];
						letters[letters.length] = word.id[m];

						if (!lettersObject[word.id[m]]) lettersObject[word.id[m]] = [];
						lettersObject[word.id[m]][lettersObject[word.id[m]].length] = { x:rx, y:ry };
						rx += dx;
						ry += dy;

					}
					words.push(word);
					wordsLeft++;
					wordList.splice(r,1);
					word = '';
					if (wordsLeft >= (limitWords ? MAX_WORDS : 199) || wordList.length <= 0) {
						i = 9999
						break;
					}
				}
			}//end for i loop
		}

		//save board
		Trunk.save('wordGrid', wordGrid);
		Trunk.save('words', words);
		Trunk.save('wordsLeft', wordsLeft);
		Trunk.save('letters', letters);

		//fill screen
		for(j=0;j<ROWS;j++) {
			for(i=0;i<ROWS;i++) {
				var className = 'letter';
				if (!wordGrid[i][j] || wordGrid[i][j] == '' || wordGrid[i][j] == ' ' || wordGrid[i][j] == undefined) {
					wordGrid[i][j] = letters[Math.rnd(letters.length-1)];
					if (grayOut) {
						className += ' extra';
					}
				}

				if ('AEIOU'.indexOf(wordGrid[i][j].toUpperCase()) != -1) {
					className += ' vowel';
				}

				$('#L-'+j+'-'+i).innerHTML = wordGrid[i][j].toUpperCase();
				$('#L-'+j+'-'+i).attr('class', className).attr('data-letter', wordGrid[i][j].toUpperCase());
			}
		}

		//save random char if not grayed
		if (!grayOut) {
			Trunk.save('wordGrid', wordGrid);
		}

		//word list
		puzzleTitle = title

		if (holidayTitle && holidayTitle.toLowerCase() != puzzleTitle.toLowerCase()) {
			$('.holiday').innerHTML = (holidayTitle + ': ' + puzzleTitle)
		} else {
			$('.holiday').innerHTML = puzzleTitle
		}

		$('#wL').innerHTML = '';
		words.sort(compare);

		$('#wL').css({height:(words.length*1.1)+'em'});

		if (hideVowels) {
			$('#body').addClass('hide-vowels');
		} else {
			$('#body').removeClass('hide-vowels');
		}

		$('#words-left').innerHTML = '<em>'+translate['words left']+':</em> <span>'+wordsLeft+'</span>';
		for(i in words) {
			$('#wL').adopt(element('span', {id:'word-'+words[i].id,index:i,innerHTML:words[i].word,class:(hideList&&words[i].id!=''?'hide':'')+(words[i].id==''?' found':''), title:translate['Click a Word for a Hint'], events:{

				click: function() {
					if (pos) {
						$('#L-'+pos.y+'-'+pos.x).css({background:''});
						pos = null;
					}
					var that = this;
					dblclick++;
					setTimeout(function() {
						if (dblclick > 1) {
							dblclick = 0;
						} else {
							pos = words[that.getAttribute('index')].position;
							opacity = $('#L-'+pos.y+'-'+pos.x).css('opacity');
							$('#L-'+pos.y+'-'+pos.x).css({background:'orange',borderRadius:'100%',opacity:1});
							if (pos) {
								setTimeout(function() {
									if (pos) {
										$('#L-'+pos.y+'-'+pos.x).css({background:'',opacity:opacity});
										pos = null;
									}
								}, 2000);
							}
							dblclick = 0;
						}
					}, 300);
				},

			}}));
		}

		$('#wL').scrollTop = 0;
		var topWord = $('#wL :not(.found)');
		if (topWord) {
			$('#wL').scrollTop = Math.max((topWord.offsetTop - topWord.clientHeight), $('#wL').scrollTop);
		}

		setTimeout(function() { loading.hide(); }, 100);

		if (useTimer) {
			dialog.show(translate['Ready?'], {class:'big-message'});
			setTimeout(function() {

				dialog.show(translate['Set?'], {class:'big-message'});
				setTimeout(function() {

					dialog.show(translate['Go!'], {class:'big-message'});
					setTimeout(function() {
						dialog.hide();
						pauseTimer(true);
					}, 500);

				}, 500);

			}, 500);
		} else {
			pauseTimer(true);
		}

	}

	function formatTime(s) {
		if (s == 5999) return '--:--';
		return ('0' + Math.floor(s / 60)).substr(-2) + ':' + ('0' + (s % 60)).substr(-2);
	}

	function pauseTimer(reset) {
		clearInterval(interval);
		if (!interval || reset) {
			$('#board').css({ visibility:''});
			$('#word-list').css({ visibility:''});

			if (useTimer) {
				$('#timer').css({visibility:''});
				interval = setInterval(function() {
					secs++;
					$('#timer').innerHTML = formatTime(secs);
					if (secs >= 90*60) {
						//times up!
					}
					Trunk.save('secs', secs);
				}, 1000);
			} else {
				$('#timer').css({visibility:'hidden'});
			}
		} else {
			if (wordsLeft>0) {
				dialog.show(translate['Paused'], {'class':'big-message', events: { click: function() { dialog.hide(); pauseTimer(); }}});
				$('#board').css({ visibility:'hidden'});
				$('#word-list').css({ visibility:'hidden'});
			}
			interval = null;
		}
	}


	var onLetter = false;
	var firstLetter = false;

	function startSelect(e, t) {
		if (t && showSelectedLetter) {
			firstLetter = onLetter = t;
			$(onLetter).addClass('over');
			$(onLetter).addClass('first');
		}
		if (t) {
			wordStart['c'] = parseInt(t.getAttribute('c'));
			wordStart['r'] = parseInt(t.getAttribute('r'));
		}
		if (!hilite) hilite = element('div', {id:'hilite',class:'hilite'});
		hilite.css({
			display: 'block',
			minWidth: SIZE_A + 'px',
			borderRadius: SIZE_A + 'px',
			webkitTransformOrigin: SIZE_B+'px '+SIZE_B+'px',
			top: wordStart['r']*SIZE + SIZE_D + 'px',
			left: wordStart['c']*SIZE + SIZE_D + 'px',
			width: SIZE_A + 'px'
		});

		setHilite(hilite, hiliteStyle);

		$('#edge').adopt(hilite);
	}

	function moveSelect(e, t) {

		if (hilite) {

			c = parseInt(t.getAttribute('c'));
			r = parseInt(t.getAttribute('r'));

			var dc = Math.abs(wordStart.c-c), dr = Math.abs(wordStart.r-r);

			if (dc != 0 && dr != 0 && dc != dr) {
				if (dc > dr) {
					if (dr < dc/2) {
						r = wordStart.r;
					} else {
						if (wordStart.r < r) {
							r = wordStart.r + dc;
						} else {
							r = wordStart.r - dc;
						}
					}
				} else {
					if (dc < dr/2) {
						c = wordStart.c;
					} else {
						if (wordStart.c < c) {
							c = wordStart.c + dr;
						} else {
							c = wordStart.c - dr;
						}
					}
				}
			}

			if (onLetter) {
				$(onLetter).removeClass('over');
				if (onLetter == firstLetter) {
					$(onLetter).addClass('first');
				} else {
					$(onLetter).removeClass('first');
				}
				if (t && showSelectedLetter) {
					onLetter = $('#L-'+r+'-'+c)
					$(onLetter).addClass('over');
				}

				if ($(onLetter).hasClass('extra')) {
					return;
				}
			}

			d = Math.sqrt(Math.pow(c-wordStart.c,2) + Math.pow(r-wordStart.r,2)) +1;
			hilite.style.width = ((d*SIZE) - SIZE_C) + 'px';
			t = Math.atan2((r-wordStart.r)*SIZE, (c-wordStart.c)*SIZE) * (180/Math.PI);
			hilite.style.webkitTransform = 'rotate('+t+'deg)';
		}
	}


	function endSelect(e, t, hideHilite) {

		if (onLetter && t && t.tagName == 'BODY') {
			t = onLetter;
		}

		if (t) {
			wordEnd.c = parseInt(t.getAttribute('c'));
			wordEnd.r = parseInt(t.getAttribute('r'));
		}

		var dc = Math.abs(wordStart.c-wordEnd.c), dr = Math.abs(wordStart.r-wordEnd.r);

		if (dc != 0 && dr != 0 && dc != dr) {
			if (dc > dr) {
				if (dr < dc/2) {
					wordEnd.r = wordStart.r;
				} else {
					if (wordStart.r < wordEnd.r) {
						wordEnd.r = wordStart.r + dc;
					} else {
						wordEnd.r = wordStart.r - dc;
					}
				}
			} else {
				if (dc < dr/2) {
					wordEnd.c = wordStart.c;
				} else {
					if (wordStart.c < wordEnd.c) {
						wordEnd.c = wordStart.c + dr;
					} else {
						wordEnd.c = wordStart.c - dr;
					}
				}
			}
		}

		isDiag = (Math.abs(wordStart.c-wordEnd.c) == Math.abs(wordStart.r-wordEnd.r));
		isLine = (wordStart.c == wordEnd.c || wordStart.r == wordEnd.r);

		if (isLine || isDiag) {
			c = wordStart.c; r = wordStart.r;
			dc = Math.sign(wordEnd.c - wordStart.c);
			dr = Math.sign(wordEnd.r - wordStart.r);

			word = wordGrid[c][r];
			while(c != wordEnd.c || r != wordEnd.r) {
				c+=dc;
				r+=dr;

				onLetter = $('#L-'+r+'-'+c)
				if (!onLetter.hasClass('extra')) {
					try { word += wordGrid[c][r]; } catch(e) {}
				}
			}

			for(i=0; i<words.length; i++) {
				if (words[i].id == word || words[i].id == word.split('').reverse().join('')) {

					if (hilite) {

						if (onLetter) {
							$(onLetter).removeClass('over');
							onLetter = false;
						}

						hilite.setAttribute('class', 'hilite');
						hilite.removeAttribute('id');

						hilites.push(hilite);

						selections.push({
							display: hilite.css('display'),
							minWidth: hilite.css('minWidth'),
							borderRadius: hilite.css('border-radius'),
							webkitTransformOrigin: hilite.css('webkitTransformOrigin'),
							webkitTransform: hilite.css('webkitTransform'),
							top: hilite.css('top'),
							left: hilite.css('left'),
							width: hilite.css('width')
						});
						hilite = null;

						wordsLeft--;
						$('#words-left').innerHTML = '<em>'+translate['words left']+':</em> <span>'+wordsLeft+'</span>';
						$('#word-'+words[i].id).setAttribute('class', 'found');

						var topWord = $('#wL :not(.found)');
						if (topWord) {
							$('#wL').scrollTop = Math.max((topWord.offsetTop - topWord.clientHeight), $('#wL').scrollTop);
						}

						usedWords.push(words[i]);

						words[i].id = '';
						if (current_word==i) {
							for(j=(i+1); j<words.length; j++) {
								if (words[j] != '') {
									current_word = j;
									break;
								}
							}
						}

						Trunk.save('selections', selections);
						Trunk.save('words', words);
						Trunk.save('wordsLeft', wordsLeft);

						if (wordsLeft==0) {

							Trunk.save('currentList', []);

							pauseTimer();

							if (useTimer) {
								//save times
								if (times[puzzleIndex] == 0) times[puzzleIndex] = 5999;
								if (times['best'] == 0) times['best'] = 5999;
								times[puzzleIndex] = Math.min(secs, times[puzzleIndex]);
								times['last'] = secs;
								times['best'] = Math.min(secs, times['best']);
								Trunk.save('times', times);
								achievements['timed']++;
							}

							achievements['total_completed']++;

							if (hideList) {
								achievements['hidden_list']++;
							}
							if (grayOut) {
								achievements['grayed']++;
							}

							achievements['max_words'] = Math.max(achievements['max_words'], words.length);
							achievements['largest'] = Math.max(achievements['largest'], (newScale*8) );

							Trunk.save('achievements', achievements);

							setTimeout(function() {

								var delay = 1000
								loading.show();

								setTimeout(function() {
									loading.hide();
									dialog.show(new_game, {
										title:'<i class="sm fa fa-refresh"></i> '+translate['All Done!'],
										buttons:{
											'start new puzzle': function() { dialog.hide(); loading.show(); setTimeout(function() { new_puzzle(1); }, 500) },
											'close': function() { dialog.hide(); }
										}
									});
									showBestTime();
								}, delay);

							}, 1000);

						}
						return
					}
				}
			}
		}

		if (hideHilite) {
			setTimeout(function() {
				if (onLetter) {
					$(onLetter).removeClass('over');
					onLetter = false;
				}
				if (hilite) {
					hilite.style.display = 'none';
					hilite = null;
				}
			}, 250);
		}
	}


	function showBestTime() {
		puzzleIndex = (newScale-1)*2 + (grayOut ? 0 : 1) + (hideList ? 8 : 0);
		$('#best-time').innerHTML = formatTime(times[puzzleIndex]);
		$('#last-time').innerHTML = formatTime(times['last']);
	}


	n();

}
