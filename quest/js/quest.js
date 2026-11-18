
import churchHistoryTrivia from './churchHistoryTrivia.js';

// Pioneer Quest -- a "Who Wants to Be a Millionaire?"-style game

(function () {
  'use strict';

  // --------------------------------------------------------------- config

  var TOTAL = 15;

  var SEARCH_URL =
    'https://www.churchofjesuschrist.org/search?lang=eng&query=';

  var FRIENDS = [
    'Brother Johnson',
    'Sister Anderson',
    'Elder Taylor',
    'Aunt Marge',
    'Bishop Reynolds',
    'Grandpa Lewis'
  ];

  // ------------------------------------------------------------- utilities

  function rnd(n) {
    return Math.floor(Math.random() * n);
  }

  function pick(arr) {
    return arr[rnd(arr.length)];
  }

  function shuffle(a) {
    a = a.slice();

    for (var i = a.length - 1; i > 0; i--) {
      var j = rnd(i + 1);
      var t = a[i];
      a[i] = a[j];
      a[j] = t;
    }

    return a;
  }

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function $$(sel, root) {
    return Array.prototype.slice.call(
      (root || document).querySelectorAll(sel)
    );
  }

  function wait(ms) {
    return new Promise(function (resolve) {
      setTimeout(resolve, ms);
    });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;'
      }[c];
    });
  }

  // ---------------------------------------------------------- question bank

  var BANK = [];

  function loadQuestions(trivia) {
		var entries = [];

		Object.keys(trivia).forEach(function (category) {
			var questions = trivia[category];

			if (!Array.isArray(questions)) return;

			// Build an answer pool containing only answers from this category.
			var categoryAnswers = [];

			questions.forEach(function (item) {
				if (!item.answer) return;

				var answer = String(item.answer).trim();

				if (
					answer &&
					categoryAnswers.indexOf(answer) === -1
				) {
					categoryAnswers.push(answer);
				}
			});

			// Four distinct answers are needed for a multiple-choice question.
			if (categoryAnswers.length < 4) {
				console.warn(
					'Skipping category "' + category +
					'" because it has fewer than four distinct answers.'
				);
				return;
			}

			questions.forEach(function (item, index) {
				if (!item.question || !item.answer) return;

				var answer = String(item.answer).trim();

				entries.push({
					id: category + '-' + index,
					text: String(item.question).trim(),
					correct: answer,
					pool: categoryAnswers
				});
			});
		});

		BANK = entries;

		if (BANK.length < TOTAL) {
			throw new Error(
				'The trivia bank needs at least ' + TOTAL +
				' questions. Only ' + BANK.length + ' were loaded.'
			);
		}

		console.log('Loaded ' + BANK.length + ' trivia questions.');
	}

  // Load all categories from churchHistoryTrivia.
  loadQuestions(churchHistoryTrivia);

  // ------------------------------------------------------- journey flavour

  var starts = [
    'Harmony, Pennsylvania',
    'Manchester, New York',
    'Palmyra, New York',
    'Mendon, New York',
    'Fayette, New York',
    'Colesville, New York',
    'South Bainbridge, New York'
  ];

  var endings = [
    'Southern California',
    'Southern Utah',
    'Idaho',
    'Wyoming',
    'Arizona',
    'Nevada'
  ];

  var missions = [
    'Europe',
    'the British Isles',
    'the Eastern United States',
    'Hawaii',
    'the South Pacific'
  ];

  var start = pick(starts);
  var ending = pick(endings);
  var mission = pick(missions);

  var legs = [
    {
      from: 0,
      title: 'To Kirtland',
      map: 'tokirtland',
      text:
        'It is 1830 and you are a new convert to the church in ' +
        '<strong>' + start + '</strong>. The Lord has proclaimed ' +
        'through the Prophet Joseph Smith that the saints are to ' +
        'gather to Ohio. Answer the following questions to move ' +
        'towards Kirtland...'
    },
    {
      from: 2,
      title: 'To Missouri',
      map: 'tomissouri',
      text:
        'The Lord has called you to move to Missouri. Continue ' +
        'answering questions on your way...'
    },
    {
      from: 4,
      title: 'To Illinois',
      text:
        'Due to Lilburn W. Boggs’ Extermination Order you are ' +
        'forced to leave Missouri. Answer these questions on your ' +
        'way to Illinois...'
    },
    {
      from: 6,
      title: 'To Winter Quarters',
      map: 'tosaltlake',
      text:
        'Continuing persecution has forced the Saints to leave ' +
        'Nauvoo. Proceed to Winter Quarters...'
    },
    {
      from: 8,
      title: 'To the Rockies',
      map: 'tosaltlake',
      text:
        'You follow the leadership of the Church to the Salt Lake ' +
        'Valley...'
    },
    {
      from: 10,
      title: 'To ' + ending,
      map: 'tothewest',
      text:
        'Brigham Young has called you to settle in ' +
        '<strong>' + ending + '</strong>...'
    },
    {
      from: 12,
      title: 'To ' + mission,
      map: 'tothewest',
      text:
        'You have been called to serve a mission to ' +
        '<strong>' + mission + '</strong>...'
    },
    {
      from: 14,
      title: 'Returning Home',
      map: 'tothewest',
      text:
        'Answer this final question as you return back home again...'
    }
  ];

  var waypoints = [
    'Buffalo, New York',
    'Kirtland, Ohio',
    'Independence, Missouri',
    'Far West, Missouri',
    'Quincy, Illinois',
    'Nauvoo, Illinois',
    'Sugar Creek, Iowa',
    'Winter Quarters, Nebraska',
    'Fort Laramie, Wyoming',
    'Salt Lake Valley, Utah',
    'En route to ' + ending,
    'Settled in ' + ending,
    'En route to ' + mission,
    'Serving in ' + mission,
    'Home at last'
  ];

  function legFor(q) {
    var leg = legs[0];

    legs.forEach(function (l) {
      if (q >= l.from) leg = l;
    });

    return leg;
  }

  // --------------------------------------------------------------- state

  var g;

  function newGame() {
    g = {
      q: 0,
      used: {},
      lifelines: {
        fifty: true,
        phone: true,
        audience: true,
        switcher: true
      },
      cur: null,
      selected: -1,
      locked: false,
      over: false,
      audience: null,
      phone: null
    };
  }

  // Every unused question is eligible, regardless of category.
	function drawQuestion() {
		var cands = BANK.filter(function (b) {
			return !g.used[b.id];
		});

		// Reset only if every question has been used.
		if (!cands.length) {
			g.used = {};
			cands = BANK.slice();
		}

		// Questions can come from any category.
		var b = pick(cands);

		g.used[b.id] = true;

		// Incorrect answers come only from this question's category.
		var wrong = shuffle(
			b.pool.filter(function (a) {
				return a !== b.correct;
			})
		).slice(0, 3);

		var opts = shuffle([
			{
				text: b.correct,
				correct: true
			}
		].concat(
			wrong.map(function (w) {
				return {
					text: w,
					correct: false
				};
			})
		));

		opts.forEach(function (o) {
			o.gone = false;
		});

		g.cur = {
			text: b.text,
			options: opts
		};

		g.selected = -1;
		g.locked = false;
		g.audience = null;
		g.phone = null;
	}

  // ------------------------------------------------------------------ UI

  var el = {};

  var LETTERS = ['A', 'B', 'C', 'D'];

  function setMap(leg) {
    if (leg.map) {
      el.stage.className = 'stage ' + leg.map;
    }
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

      li.innerHTML =
        '<span class="mark">' +
        (i < g.q ? '\u2713' :
          i === g.q && !g.over ? '\u261E' : '') +
        '</span>' +
        '<span class="amt">' +
        escapeHtml(waypoints[i]) +
        '</span>';

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
      el.confirmText.textContent =
        'Is ' + LETTERS[g.selected] + ': “' +
        g.cur.options[g.selected].text +
        '” your final answer?';

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

    await wait(1800);

    btns[g.selected].classList.remove('pulse');

    var right = g.cur.options.findIndex(function (o) {
      return o.correct;
    });

    var ok = g.selected === right;

    btns[right].classList.add('correct');

    if (!ok) {
      btns[g.selected].classList.add('wrong');
    }

    await wait(900);

    if (ok) {
      g.q++;

      if (g.q >= TOTAL) {
        return finish('win');
      }

      showResult(
        'good',
        '<strong>Correct!</strong> You have reached ' +
        '<em>' + escapeHtml(waypoints[g.q - 1]) + '</em>.',
        'Press on',
        nextQuestion
      );

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
    var prevLeg = legFor(g.q - 1);
    var leg = legFor(g.q);

    var go = function () {
      drawQuestion();
      renderQuestion();
    };

    if (leg !== prevLeg) {
      setMap(leg);
      showCard(leg.title, leg.text, 'Continue', go);
    } else {
      go();
    }
  }

  // --------------------------------------------------------------- modals

  function showCard(title, html, btnLabel, fn, extra, cls) {
    el.modal.classList.toggle('wide', cls === 'wide');
    el.modalTitle.textContent = title;
    el.modalBody.innerHTML = html;
    el.modalButtons.innerHTML = '';

    var buttons = extra
      ? extra
      : [{ label: btnLabel, fn: fn, primary: true }];

    buttons.forEach(function (b) {
      var btn = document.createElement('button');

      btn.type = 'button';
      btn.className = 'btn';
      btn.textContent = b.label;

      if (b.primary) {
        btn.className = 'btn primary';
      }

      btn.onclick = function () {
        closeCard();
        b.fn && b.fn();
      };

      el.modalButtons.appendChild(btn);
    });

    el.modal.hidden = false;

    var first =
      el.modalButtons.querySelector('.primary') ||
      el.modalButtons.firstChild;

    first && first.focus();
  }

  function closeCard() {
    el.modal.hidden = true;
  }

  // ------------------------------------------------------------- lifelines

  function liveIdx() {
    var r = [];

    g.cur.options.forEach(function (o, i) {
      if (!o.gone) r.push(i);
    });

    return r;
  }

  function useFifty() {
    var wrong = [];

    g.cur.options.forEach(function (o, i) {
      if (!o.correct && !o.gone) wrong.push(i);
    });

    shuffle(wrong).slice(0, 2).forEach(function (i) {
      g.cur.options[i].gone = true;
    });

    g.lifelines.fifty = false;

    if (
      g.selected >= 0 &&
      g.cur.options[g.selected].gone
    ) {
      g.selected = -1;
    }

    renderQuestion();
    markSelected();
  }

  function usePhone() {
    g.lifelines.phone = false;
    renderLifelines();

    var friend = pick(FRIENDS);
    var live = liveIdx();

    var rightI = g.cur.options.findIndex(function (o) {
      return o.correct;
    });

    var guess = rightI;

    // The friend has a consistent 72% chance of being correct.
    if (Math.random() > 0.72) {
      guess = pick(
        live.filter(function (i) {
          return i !== rightI;
        })
      );
    }

    var tone = [
      'I think it is',
      'I am pretty sure it is',
      'My best guess is',
      'I believe the answer is',
      'I looked it up, and I think it is',
      'I am going with'
    ];

    var o = g.cur.options[guess];

    var query = g.cur.text.replace(/\?$/, '');
    var url = SEARCH_URL + encodeURIComponent(query);

    showCard(
      'Telegraph a Friend',

      '<p class="phone"><strong>' + friend +
      '</strong> is looking it up…</p>' +

      '<div class="lookup">' +
      '<iframe src="' + url +
      '" title="churchofjesuschrist.org search" ' +
      'referrerpolicy="no-referrer"></iframe>' +
      '</div>' +

      '<p class="hint">If the page above stays blank, the website ' +
      'may not allow itself to be shown here. ' +
      '<a href="' + url +
      '" target="_blank" rel="noopener">' +
      'Open the search in a new tab</a> instead.</p>' +

      '<p class="quote small">Or take ' + friend +
      '’s hunch: “' + pick(tone) + ' <strong>' +
      LETTERS[guess] + ': ' + escapeHtml(o.text) +
      '</strong>.”</p>',

      null,
      null,

      [{
        label: 'Back to the question',
        fn: function () {},
        primary: true
      }],

      'wide'
    );
  }

  function useAudience() {
    g.lifelines.audience = false;
    renderLifelines();

    // Audience votes are random and do not know the answer.
    var live = liveIdx();

    var weights = live.map(function () {
      return Math.random() + 0.1;
    });

    var wsum = weights.reduce(function (a, b) {
      return a + b;
    }, 0);

    var pct = {};
    var assigned = 0;

    live.forEach(function (i, k) {
      var v = k === live.length - 1
        ? 100 - assigned
        : Math.round(100 * weights[k] / wsum);

      pct[i] = v;
      assigned += v;
    });

    var html = '<div class="aud">';

    for (var i = 0; i < 4; i++) {
      var v = pct[i];

      html +=
        '<div class="bar' +
        (g.cur.options[i].gone ? ' gone' : '') +
        '">' +
        '<span class="pct">' +
        (v == null ? '' : v + '%') +
        '</span>' +
        '<span class="fill" style="height:' +
        (v || 0) + '%"></span>' +
        '<span class="lt">' + LETTERS[i] + '</span>' +
        '</div>';
    }

    html += '</div>' +
      '<p class="hint">A show of hands from the Company. ' +
      'Their votes are cast by chance alone.</p>';

    showCard('Ask the Company', html, 'Thank you');
  }

  function useSwitch() {
    g.lifelines.switcher = false;

    // The current question is already marked as used.
    // This draws a different, unused question.
    drawQuestion();
    renderQuestion();
  }

  // -------------------------------------------------------------- turn back

  function askWalk() {
    showCard(
      'Turn back?',

      '<p>Abandon the journey here? Turning back means the quest is ' +
      '<strong>failed</strong>.</p>',

      null,
      null,

      [
        {
          label: 'Press on',
          fn: function () {},
          primary: true
        },
        {
          label: 'Turn back',
          fn: function () {
            finish('walk');
          }
        }
      ]
    );
  }

  // ---------------------------------------------------------------- finish

  function finish(how) {
    g.over = true;
    g.locked = true;

    renderLadder();
    renderLifelines();

    var title, body;

    var reached = g.q > 0
      ? waypoints[g.q - 1]
      : 'the place you began';

    if (how === 'win') {
      title = 'Home at Last!';

      body =
        '<p class="big">Quest Complete</p>' +
        '<p>Congratulations — you answered all ' +
        TOTAL + ' questions and have completed the quest!</p>';

      el.result.hidden = true;

    } else if (how === 'walk') {
      title = 'You Turned Back';

      body =
        '<p class="big">Quest Failed</p>' +
        '<p>You abandoned the journey after reaching ' +
        '<strong>' + escapeHtml(reached) +
        '</strong>. The quest is lost.</p>';

    } else {
      var right = g.cur.options.find(function (o) {
        return o.correct;
      }).text;

      title = 'The Trail Ends';

      body =
        '<p class="big">Quest Failed</p>' +
        '<p>That answer was incorrect. The correct answer was ' +
        '<strong>' + escapeHtml(right) + '</strong>.</p>' +
        '<p>Your journey ended after <strong>' +
        escapeHtml(reached) + '</strong>.</p>';
    }

    showCard(
      title,
      body,
      null,
      null,
      [{
        label: 'Begin anew',
        fn: restart,
        primary: true
      }]
    );
  }

  // --------------------------------------------------------------- restart

  function restart() {
    newGame();

    var leg = legs[0];

    setMap(leg);

    showCard(
      'Pioneer Quest',

      leg.text +
      '<p class="hint">Answer the questions to reach your ' +
      'destination. You may use each lifeline once at any time.</p>',

      'Start',

      function () {
        drawQuestion();
        renderQuestion();
      }
    );

    // Blank the board behind the intro card.
    el.question.textContent = '…';

    $$('.answer', el.answers).forEach(function (b) {
      b.querySelector('.txt').textContent = '';
      b.disabled = true;
      b.className = 'answer';
      b.style.visibility = 'visible';
    });

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

      [
        'stage',
        'ladder',
        'qnum',
        'prize',
        'leg',
        'question',
        'answers',
        'confirm',
        'result',
        'walk',
        'modal'
      ].forEach(function (id) {
        el[id] = document.getElementById(id);
      });

      el.confirmText = $('#confirm .q');
      el.resultText = $('#result .msg');
      el.resultBtn = $('#result button');
      el.modalTitle = $('#modal h2');
      el.modalBody = $('#modal .body');
      el.modalButtons = $('#modal .buttons');

      $$('.answer', el.answers).forEach(function (btn, i) {
        btn.addEventListener('click', function () {
          onPick(i);
        });
      });

      $('#confirm .yes').addEventListener('click', lockIn);

      $('#confirm .no').addEventListener('click', function () {
        g.selected = -1;
        markSelected();

        $$('.answer', el.answers).forEach(function (b) {
          b.classList.remove('selected');
        });
      });

      $('[data-ll="fifty"]').addEventListener('click', function () {
        if (g.lifelines.fifty && !g.locked) useFifty();
      });

      $('[data-ll="phone"]').addEventListener('click', function () {
        if (g.lifelines.phone && !g.locked) usePhone();
      });

      $('[data-ll="audience"]').addEventListener('click', function () {
        if (g.lifelines.audience && !g.locked) useAudience();
      });

      $('[data-ll="switcher"]').addEventListener('click', function () {
        if (g.lifelines.switcher && !g.locked) useSwitch();
      });

      el.walk.addEventListener('click', function () {
        if (!g.locked && !g.over) askWalk();
      });

      $('#ladderToggle').addEventListener('click', function () {
        document.body.classList.toggle('ladder-open');
      });

      $('#ladderClose').addEventListener('click', function () {
        document.body.classList.remove('ladder-open');
      });

      document.addEventListener('keydown', function (e) {
        if (
          !el.modal.hidden ||
          !g ||
          g.over ||
          g.locked ||
          !g.cur
        ) {
          return;
        }

        var k = e.key.toUpperCase();
        var i = LETTERS.indexOf(k);

        if (i !== -1) {
          onPick(i);
        } else if (
          e.key === 'Enter' &&
          g.selected >= 0 &&
          !el.confirm.hidden
        ) {
          lockIn();
        } else if (e.key === 'Escape' && g.selected >= 0) {
          $('#confirm .no').click();
        }
      });

      restart();
    }
  };

  // The module script runs after the HTML has been parsed.
  window.Quest.init();

})();
