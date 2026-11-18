// Pioneer Quest -- a "Who Wants to Be a Millionaire?"-style game, 1800s edition
//
// Rules:
//  * 15 questions, one per waypoint on the trail from New York to home again.
//  * Questions get harder as you go (TIERS below).
//  * One wrong answer ends the journey. There are no safe havens.
//  * Every answer must be locked in with "Final answer".
//  * Turning back is allowed, but it counts as failing the quest.
//  * Four one-time lifelines: 50:50, Telegraph a Friend (looks it up on
//    churchofjesuschrist.org), Ask the Company (a random show of hands), Another Question.
//
// The question files (_*.js) call buildQuestions({prefix, qs}) exactly as before.

(function () {
	'use strict';

	// ---------------------------------------------------------------- config

	var TOTAL = 15;                          // questions in a full journey

	// Difficulty of each question category, by prefix. 1 = easiest, 3 = hardest.
	// Questions 1-5 come from tier 1, 6-10 from tier 2, 11-15 from tier 3.
	var TIERS = {
		'Which leader ': 1,
		'Which Standard Work contains ': 1,
		'Eternal dwelling place for those who ': 1,
		'Where ': 1,

		'When ': 2,
		'Which Article of Faith is about ': 2,
		'Which of the 10 commandments says ': 2,
		'Who was ': 2,
		'Which Latter-day prophet ': 2,

		'What ': 3,
		'Who ': 3,
		'Which hymn contains the words ': 3,
		'Which temple ': 3
	};

	// Chance that the audience / a friend picks the right answer, easy -> hard.
	function accuracy(qIndex) { return 0.92 - (qIndex / 14) * 0.45; }   // 92% .. 47%

	var SEARCH_URL = 'https://www.churchofjesuschrist.org/search?lang=eng&query=';

	var FRIENDS = ['Brother Johnson', 'Sister Anderson', 'Elder Taylor', 'Aunt Marge', 'Bishop Reynolds', 'Grandpa Lewis'];

	// ------------------------------------------------------------ utilities

	function rnd(n) { return Math.floor(Math.random() * n); }
	function pick(arr) { return arr[rnd(arr.length)]; }
	function shuffle(a) {
		a = a.slice();
		for (var i = a.length - 1; i > 0; i--) {
			var j = rnd(i + 1), t = a[i]; a[i] = a[j]; a[j] = t;
		}
		return a;
	}
	function $(sel, root) { return (root || document).querySelector(sel); }
	function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
	function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

	// ------------------------------------------------------- question bank

	var BANK = [];   // { text, correct, pool, tier, id }

	// Called by every _*.js data file.
	window.buildQuestions = function (cat) {
		var qs = cat.qs, entries = [], pool = [];
		Object.keys(qs).forEach(function (k) {
			var a = String(typeof qs[k] === 'string' ? qs[k] : qs[k][0]).trim();
			entries.push([k, a]);
			if (pool.indexOf(a) === -1) pool.push(a);
		});
		var tier = TIERS[cat.prefix] || 2;
		entries.forEach(function (e) {
			BANK.push({
				id: cat.prefix + e[0],
				text: cat.prefix + e[0] + '?',
				correct: e[1],
				pool: pool,
				tier: tier
			});
		});
	};

	// ---------------------------------------------------------- journey flavour

	var starts = ['Harmony, Pennsylvania', 'Manchester, New York', 'Palmyra, New York', 'Mendon, New York',
		'Fayette, New York', 'Colesville, New York', 'South Bainbridge, New York'];
	var endings = ['Southern California', 'Southern Utah', 'Idaho', 'Wyoming', 'Arizona', 'New Mexico', 'Oregon', 'Nevada'];
	var missions = ['Europe', 'the British Isles', 'the Eastern United States', 'Hawaii', 'the South Pacific'];

	var start = pick(starts), ending = pick(endings), mission = pick(missions);

	// Each leg of the journey covers a few questions. Entering a leg shows its story card.
	var legs = [
		{ from: 0,  title: 'To Kirtland', map: 'tokirtland',
		  text: 'It is 1830 and you are a new convert to the church in <strong>' + start + '</strong>. The Lord has proclaimed through the Prophet Joseph Smith that the saints are to gather to Ohio. Answer the following questions to move towards Kirtland...' },
		{ from: 2,  title: 'To Missouri', map: 'tomissouri',
		  text: 'The Lord has called you to move to Missouri. Continue answering questions on your way...' },
		{ from: 4,  title: 'To Illinois',
		  text: 'Due to Lilburn W. Boggs’ Extermination Order you are forced to leave Missouri. Answer these questions on your way to Illinois...' },
		{ from: 6,  title: 'To Winter Quarters', map: 'tosaltlake',
		  text: 'Continuing persecution has forced the Saints to leave Nauvoo. Proceed to Winter Quarters...' },
		{ from: 8,  title: 'To the Rockies', map: 'tosaltlake',
		  text: 'You follow the leadership of the Church to the Salt Lake Valley...' },
		{ from: 10, title: 'To ' + ending, map: 'tothewest',
		  text: 'Brigham Young has called you to settle in <strong>' + ending + '</strong>...' },
		{ from: 12, title: 'To ' + mission, map: 'tothewest',
		  text: 'You have been called to serve a mission to <strong>' + mission + '</strong>...' },
		{ from: 14, title: 'Returning Home', map: 'tothewest',
		  text: 'Answer this final question as you return back home again...' }
	];

	// One waypoint per question: reaching it means you answered that question correctly.
	var waypoints = [
		'Buffalo, New York', 'Kirtland, Ohio',
		'Independence, Missouri', 'Far West, Missouri',
		'Quincy, Illinois', 'Nauvoo, Illinois',
		'Sugar Creek, Iowa', 'Winter Quarters, Nebraska',
		'Fort Laramie, Wyoming', 'Salt Lake Valley, Utah',
		'En route to ' + ending, 'Settled in ' + ending,
		'En route to ' + mission, 'Serving in ' + mission,
		'Home at last'
	];

	function legFor(q) {
		var leg = legs[0];
		legs.forEach(function (l) { if (q >= l.from) leg = l; });
		return leg;
	}

	// ------------------------------------------------------------------ state

	var g;   // game state

	function newGame() {
		g = {
			q: 0,                 // 0-based index of current question
			used: {},             // ids already asked
			lifelines: { fifty: true, phone: true, audience: true, switcher: true },
			cur: null,            // { text, options:[{text, correct, gone}], tier }
			selected: -1,
			locked: false,
			over: false,
			// per-question cache so a lifeline can't be re-rolled
			audience: null,
			phone: null
		};
	}

	function drawQuestion(qIndex) {
		var tier = qIndex < 5 ? 1 : qIndex < 10 ? 2 : 3;
		var cands = BANK.filter(function (b) { return b.tier === tier && !g.used[b.id]; });
		if (!cands.length) cands = BANK.filter(function (b) { return !g.used[b.id]; });
		if (!cands.length) { g.used = {}; cands = BANK.slice(); }
		var b = pick(cands);
		g.used[b.id] = true;
		var wrong = shuffle(b.pool.filter(function (a) { return a !== b.correct; })).slice(0, 3);
		var opts = shuffle([{ text: b.correct, correct: true }].concat(wrong.map(function (w) { return { text: w, correct: false }; })));
		opts.forEach(function (o) { o.gone = false; });
		g.cur = { text: b.text, options: opts };
		g.selected = -1;
		g.locked = false;
		g.audience = null;
		g.phone = null;
	}

	// --------------------------------------------------------------------- UI

	var el = {};
	var LETTERS = ['A', 'B', 'C', 'D'];

	function setMap(leg) {
		if (leg.map) el.stage.className = 'stage ' + leg.map;
	}

	function renderLadder() {
		el.ladder.innerHTML = '';
		for (var i = TOTAL - 1; i >= 0; i--) {
			var li = document.createElement('li');
			var cls = [];
			if (i === TOTAL - 1) cls.push('milestone');
			if (i === g.q && !g.over) cls.push('current');
			if (i < g.q) cls.push('done');
			li.className = cls.join(' ');
			li.innerHTML = '<span class="mark">' + (i < g.q ? '\u2713' : i === g.q && !g.over ? '\u261E' : '') + '</span><span class="amt">' + escapeHtml(waypoints[i]) + '</span>';
			el.ladder.appendChild(li);
		}
	}

	function renderLifelines() {
		Object.keys(g.lifelines).forEach(function (k) {
			var b = $('[data-ll="' + k + '"]');
			var avail = g.lifelines[k] && !g.locked && !g.over;
			b.disabled = !avail;
			b.classList.toggle('used', !g.lifelines[k]);
		});
		el.walk.disabled = g.locked || g.over;
	}

	function renderQuestion() {
		var qn = g.q + 1;
		el.qnum.textContent = 'Question ' + qn + ' of ' + TOTAL;
		el.prize.textContent = 'Next stop: ' + waypoints[g.q];
		el.leg.textContent = legFor(g.q).title;
		el.question.textContent = g.cur.text;
		el.confirm.hidden = true;
		el.result.hidden = true;
		el.result.className = 'result';
		el.answers.classList.remove('locked');
		$$('.answer', el.answers).forEach(function (btn, i) {
			var o = g.cur.options[i];
			btn.className = 'answer';
			btn.disabled = false;
			btn.style.visibility = o.gone ? 'hidden' : 'visible';
			btn.querySelector('.txt').textContent = o ? o.text : '';
		});
		renderLadder();
		renderLifelines();
	}

	function markSelected() {
		$$('.answer', el.answers).forEach(function (btn, i) {
			btn.classList.toggle('selected', i === g.selected);
		});
		if (g.selected >= 0) {
			el.confirmText.textContent = 'Is ' + LETTERS[g.selected] + ': “' + g.cur.options[g.selected].text + '” your final answer?';
			el.confirm.hidden = false;
		} else {
			el.confirm.hidden = true;
		}
	}

	function onPick(i) {
		if (g.locked || g.over || g.cur.options[i].gone) return;
		g.selected = i;
		markSelected();
	}

	async function lockIn() {
		if (g.selected < 0 || g.locked) return;
		g.locked = true;
		el.confirm.hidden = true;
		el.answers.classList.add('locked');
		renderLifelines();
		var btns = $$('.answer', el.answers);
		btns[g.selected].classList.add('selected', 'pulse');
		await wait(1800);                      // the suspense
		btns[g.selected].classList.remove('pulse');

		var right = g.cur.options.findIndex(function (o) { return o.correct; });
		var ok = g.selected === right;
		btns[right].classList.add('correct');
		if (!ok) btns[g.selected].classList.add('wrong');
		await wait(900);

		if (ok) {
			g.q++;
			if (g.q >= TOTAL) { return finish('win'); }
			showResult('good',
				'<strong>Correct!</strong> You have reached <em>' + escapeHtml(waypoints[g.q - 1]) + '</em>.',
				'Press on', nextQuestion);
			renderLadder();
			renderLifelines();
		} else {
			finish('lose');
		}
	}

	function showResult(kind, html, btnLabel, fn) {
		el.result.className = 'result ' + kind;
		el.resultText.innerHTML = html;
		el.resultBtn.textContent = btnLabel;
		el.resultBtn.onclick = fn;
		el.result.hidden = false;
		el.resultBtn.focus();
	}

	function nextQuestion() {
		var prevLeg = legFor(g.q - 1), leg = legFor(g.q);
		var go = function () { drawQuestion(g.q); renderQuestion(); };
		if (leg !== prevLeg) {
			setMap(leg);
			showCard(leg.title, leg.text, 'Continue', go);
		} else {
			go();
		}
	}

	// ---------------------------------------------------------------- modals

	function showCard(title, html, btnLabel, fn, extra, cls) {
		el.modal.classList.toggle('wide', cls === 'wide');
		el.modalTitle.textContent = title;
		el.modalBody.innerHTML = html;
		el.modalButtons.innerHTML = '';
		var buttons = extra ? extra : [{ label: btnLabel, fn: fn, primary: true }];
		buttons.forEach(function (b) {
			var btn = document.createElement('button');
			btn.type = 'button';
			btn.className = 'btn';
			btn.textContent = b.label;
			if (b.primary) btn.className = 'btn primary';
			btn.onclick = function () { closeCard(); b.fn && b.fn(); };
			el.modalButtons.appendChild(btn);
		});
		el.modal.hidden = false;
		var first = el.modalButtons.querySelector('.primary') || el.modalButtons.firstChild;
		first && first.focus();
	}

	function closeCard() { el.modal.hidden = true; }

	// ------------------------------------------------------------- lifelines

	function liveIdx() {
		var r = [];
		g.cur.options.forEach(function (o, i) { if (!o.gone) r.push(i); });
		return r;
	}

	function useFifty() {
		var wrong = [];
		g.cur.options.forEach(function (o, i) { if (!o.correct && !o.gone) wrong.push(i); });
		shuffle(wrong).slice(0, 2).forEach(function (i) { g.cur.options[i].gone = true; });
		g.lifelines.fifty = false;
		if (g.selected >= 0 && g.cur.options[g.selected].gone) g.selected = -1;
		renderQuestion();
		markSelected();
	}

	function usePhone() {
		g.lifelines.phone = false;
		renderLifelines();
		var friend = pick(FRIENDS);
		var live = liveIdx();
		var rightI = g.cur.options.findIndex(function (o) { return o.correct; });
		var guess = rightI;
		if (Math.random() > accuracy(g.q)) {
			guess = pick(live.filter(function (i) { return i !== rightI; }));
		}
		var tone = g.q < 5 ? ['Oh, easy \u2014 that\u2019s', 'I\u2019m positive it\u2019s', 'I know this one, it\u2019s']
			: g.q < 10 ? ['I\u2019m fairly sure it\u2019s', 'I think it\u2019s', 'My gut says']
			: ['Hmm\u2026 I\u2019m not certain, but I\u2019d guess', 'I\u2019m honestly torn, but maybe', 'That\u2019s a tough one. If I had to pick, I\u2019d say'];
		var o = g.cur.options[guess];

		// The friend "looks it up" on the Church's website: a search for the question
		// is opened in a new tab so you can read what they found.
		var query = g.cur.text.replace(/\?$/, '');
		var url = SEARCH_URL + encodeURIComponent(query);

		showCard('Telegraph a Friend',
			'<p class="phone"><strong>' + friend + '</strong> is looking it up\u2026</p>' +
			'<div class="lookup"><iframe src="' + url + '" title="churchofjesuschrist.org search" referrerpolicy="no-referrer"></iframe></div>' +
			'<p class="hint">If the page above stays blank, the website may not allow itself to be shown here. ' +
			'<a href="' + url + '" target="_blank" rel="noopener">Open the search in a new tab</a> instead.</p>' +
			'<p class="quote small">Or take ' + friend + '\u2019s hunch:<br>\u201C' + pick(tone) + ' <strong>' + LETTERS[guess] + ': ' + escapeHtml(o.text) + '</strong>.\u201D</p>',
			null, null,
			[{ label: 'Back to the question', fn: function () {}, primary: true }], 'wide');
	}

	function useAudience() {
		g.lifelines.audience = false;
		renderLifelines();
		// A show of hands is pure chance: the votes know nothing about the answer.
		var live = liveIdx();
		var weights = live.map(function () { return Math.random() + 0.1; });
		var wsum = weights.reduce(function (a, b) { return a + b; }, 0);
		var pct = {}, assigned = 0;
		live.forEach(function (i, k) {
			var v = k === live.length - 1 ? 100 - assigned : Math.round(100 * weights[k] / wsum);
			pct[i] = v; assigned += v;
		});
		var html = '<div class="aud">';
		for (var i = 0; i < 4; i++) {
			var v = pct[i];
			html += '<div class="bar' + (g.cur.options[i].gone ? ' gone' : '') + '"><span class="pct">' + (v == null ? '' : v + '%') + '</span>' +
				'<span class="fill" style="height:' + (v || 0) + '%"></span><span class="lt">' + LETTERS[i] + '</span></div>';
		}
		html += '</div><p class="hint">A show of hands from the Company. Their votes are cast by chance alone.</p>';
		showCard('Ask the Company', html, 'Thank you');
	}

	function useSwitch() {
		g.lifelines.switcher = false;
		drawQuestion(g.q);
		renderQuestion();
	}

	function escapeHtml(s) {
		return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
	}

	// -------------------------------------------------------------- turn back

	function askWalk() {
		showCard('Turn back?',
			'<p>Abandon the journey here? Turning back means the quest is <strong>failed</strong>.</p>',
			null, null,
			[{ label: 'Press on', fn: function () {}, primary: true },
			 { label: 'Turn back', fn: function () { finish('walk'); } }]);
	}

	// ----------------------------------------------------------------- finish

	function finish(how) {
		g.over = true;
		g.locked = true;
		renderLadder();
		renderLifelines();
		var title, body;
		var reached = g.q > 0 ? waypoints[g.q - 1] : 'the place you began';
		if (how === 'win') {
			title = 'Home at Last!';
			body = '<p class="big">Quest Complete</p><p>Congratulations \u2014 you answered all ' + TOTAL + ' questions and have completed the quest!</p>';
			el.result.hidden = true;
		} else if (how === 'walk') {
			title = 'You Turned Back';
			body = '<p class="big">Quest Failed</p><p>You abandoned the journey after reaching <strong>' + escapeHtml(reached) + '</strong>. The quest is lost.</p>';
		} else {
			var right = g.cur.options.find(function (o) { return o.correct; }).text;
			title = 'The Trail Ends';
			body = '<p class="big">Quest Failed</p><p>That answer was incorrect. The correct answer was <strong>' + escapeHtml(right) + '</strong>.</p>' +
				'<p>Your journey ended after <strong>' + escapeHtml(reached) + '</strong>.</p>';
		}
		showCard(title, body, null, null,
			[{ label: 'Begin anew', fn: restart, primary: true }]);
	}

	function restart() {
		newGame();
		var leg = legs[0];
		setMap(leg);
		showCard('Pioneer Quest', leg.text +
			'<p class="hint">Answer the questions to reach your destination. You may use each lifeline once at any time.</p>',
			'Start', function () { drawQuestion(0); renderQuestion(); });
		// blank the board behind the intro card
		el.question.textContent = '…';
		$$('.answer', el.answers).forEach(function (b) { b.querySelector('.txt').textContent = ''; b.disabled = true; b.className = 'answer'; b.style.visibility = 'visible'; });
		el.confirm.hidden = true;
		el.result.hidden = true;
		el.qnum.textContent = 'Question 1 of ' + TOTAL;
		el.prize.textContent = 'Next stop: ' + waypoints[0];
		el.leg.textContent = leg.title;
		renderLadder();
		renderLifelines();
	}

	// ------------------------------------------------------------------- init

	window.Quest = {
		initialized: false,
		init: function () {
			if (this.initialized) return;
			this.initialized = true;

			['stage', 'ladder', 'qnum', 'prize', 'leg', 'question', 'answers', 'confirm', 'result', 'walk', 'modal'].forEach(function (id) {
				el[id] = document.getElementById(id);
			});
			el.confirmText = $('#confirm .q');
			el.resultText = $('#result .msg');
			el.resultBtn = $('#result button');
			el.modalTitle = $('#modal h2');
			el.modalBody = $('#modal .body');
			el.modalButtons = $('#modal .buttons');

			$$('.answer', el.answers).forEach(function (btn, i) {
				btn.addEventListener('click', function () { onPick(i); });
			});
			$('#confirm .yes').addEventListener('click', lockIn);
			$('#confirm .no').addEventListener('click', function () { g.selected = -1; markSelected(); $$('.answer', el.answers).forEach(function (b) { b.classList.remove('selected'); }); });
			$('[data-ll="fifty"]').addEventListener('click', function () { if (g.lifelines.fifty && !g.locked) useFifty(); });
			$('[data-ll="phone"]').addEventListener('click', function () { if (g.lifelines.phone && !g.locked) usePhone(); });
			$('[data-ll="audience"]').addEventListener('click', function () { if (g.lifelines.audience && !g.locked) useAudience(); });
			$('[data-ll="switcher"]').addEventListener('click', function () { if (g.lifelines.switcher && !g.locked) useSwitch(); });
			el.walk.addEventListener('click', function () { if (!g.locked && !g.over) askWalk(); });
			$('#ladderToggle').addEventListener('click', function () { document.body.classList.toggle('ladder-open'); });
			$('#ladderClose').addEventListener('click', function () { document.body.classList.remove('ladder-open'); });

			document.addEventListener('keydown', function (e) {
				if (!el.modal.hidden || !g || g.over || g.locked || !g.cur) return;
				var k = e.key.toUpperCase(), i = LETTERS.indexOf(k);
				if (i !== -1) { onPick(i); }
				else if (e.key === 'Enter' && g.selected >= 0 && !el.confirm.hidden) { lockIn(); }
				else if (e.key === 'Escape' && g.selected >= 0) { $('#confirm .no').click(); }
			});

			restart();
		}
	};

})();
