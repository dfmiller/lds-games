// JavaScript Document

/*
5 rounds:
	colesville to kirtland: 60 sec
	to missouri: 45 sec
	to nauvoo: 30 sec
	to winter quarters: 15 sec
	to slc: 10 sec
	to st george, arizona, : 5 sec
	to foreign lands: 0 sec
	final answer?

*/


try {

	function rnd(n) { return Math.floor(Math.random()*n) }

	var questions = {};
	var questionsBackup

	function buildQuestions(cat) {
		var qs = cat.qs;
		var answers = [];
		for(var i in qs) {
			var answer = (typeof qs[i] === 'string' ? qs[i] : qs[i][0])
			if (answers.indexOf(answer) === -1) {
				answers.push(answer)
			}
		}

		for(var i in qs) {
			var answer = (typeof qs[i] === 'string' ? qs[i] : qs[i][0]);
			answers.sort((a, b) => {
				switch(answer) {
					case a: return -1;
					case b: return 1;
					default: return rnd(2)-.5
				}
			})
			questions[cat.prefix+i+'?'] = answers.slice(0, 4)
		}
		questionsBackup = JSON.stringify(questions)
	}


var Quest = {

	initialized: false,

	init: function() {

		if (this.initialized) {
			return
		}

		this.initialized = true

		Dialog.alert(levels[level].description, 'Pioneer Quest', {
			Start: play
		})

		$('.buttonWrapper button').click(function() {
			clearInterval(interval)
			interval = false
			if ($(this).text() === answer) {
				let correct = ['That is correct!', 'Absolutely!', 'For sure!', 'Right you are!', 'Nice!', 'Alright!', 'You got it!', 'Excellent']
				Dialog.alert(correct[rnd(correct.length)], {
					'Next Question': function() {
						if (++turn > 10) {
							turn = 0
							level++
							$('.shell').removeAttr('open')
							if (level == levels.length-1) {
								Dialog.alert(levels[level].description, { Restart: Quest.reset })
							} else {
								Dialog.alert(levels[level].description, { Continue: play })
							}
						} else {
							play()
						}
					}
				})
			} else {
				let incorrect = ['That is incorrect', 'Nope', 'Failed', 'No way', 'Wrong answer', 'That is not right']
				Dialog.alert(incorrect[rnd(incorrect.length)], {
					Restart: Quest.reset,
					Retry: function() {
						turn = 0
						play()
					}
				})
			}
		})

		$('.help-skip').click(function() {
			if (helps.skip) {
				$('.help-skip').attr('disabled', true)
				helps.skip = false
				play()
			}
		})

		$('.help-eliminate').click(function() {
			if (helps.eliminate) {
				$('.help-eliminate').attr('disabled', true)
				helps.eliminate = false
				let eliminated = 0
				while (eliminated < 2) {
					let button = $('.buttonWrapper button').eq(rnd(4))
					if (button.text() !== answer && !button.attr('disabled')) {
						button.attr('disabled', true)
						eliminated++
					}
				}
			}
		})

		$('.help-add').click(function() {
			if (helps.add) {
				$('.help-add').attr('disabled', true)
				helps.add = false
				timePast += 15
				$('meter').attr('max', parseInt($('meter').attr('max')) + 15)
			}
		})

		$('.help-pause').click(function() {
			if (helps.pause) {
				$('.help-pause').attr('disabled', true)
				helps.pause = false
				clearInterval(interval)
				interval = false
			}
		})

	},

	reset: function() {
		questions = JSON.parse(questionsBackup)
		$('.shell').removeAttr('open')
		clearInterval(interval)
		interval = false
		level = 0
		turn = 0
		answer = ''
		timePast = 0
		for(let help in helps) {
			helps[help] = true
			$('.help-'+help).attr('disabled', false)
		}
		Dialog.alert(levels[level].description, 'Pioneer Quest', {
			Start: play
		})
	}

}

	var starts = [
		'Harmony, Pennsylvania',
		'Manchester, New York',
		'Palmyra, New York',
		'Mendon, New York',
		'Fayette, New York',
		'Colesville, New York',
		'South Bainbridge, New York'
	]

	var endings = [
		'Southern California',
		'Southern Utah',
		'Idaho',
		'Wyoming',
		'Arizona',
		'New Mexico',
		'Oregon',
		'Nevada'
	]

	var missions = ['Europe', 'the British Isles', 'the Eastern United States', 'Hawaii', 'the South Pacific']

	var ending = endings[rnd(endings.length)]
	var mission = missions[rnd(missions.length)]

	var level = 0,
		turn = 0,
		answer = '',
		timePast = 0,
		interval = false,
		helps = {
			skip: true,
			eliminate: true,
			add: true,
			pause: true
		},

		levels = [
			{
				description: 'It is 1830 and you are a new convert to the church in <strong>'+starts[rnd(starts.length)]+'</strong>.  The Lord has proclaimed through the Prophet Joseph Smith that the saints are to gather to Ohio.  Answer the following questions to move towards Kirtland...',
				title: 'To Kirtland',
				map: 'tokirtland',
				secs: 60
			},
			{
				description: 'The Lord has called you to move to Missouri. Continue answering questions on your way...',
				title: 'To Missouri',
				map: 'tomissouri',
				secs: 45
			},
			{
				description: 'Due to Lilburn W. Boggs\' Extermination Order you are forced to leave Missouri.  Answer these questions on your way to Illinois...',
				title: 'To Illinois',
				secs: 30
			},
			{
				description: 'Continuing persecution has forced the Saints to leave Nauvoo.  Proceed to Winter Quarters...',
				title: 'To Winter Quarters',
				map: 'tosaltlake',
				secs: 15
			},
			{
				description: 'You follow the leadership of the Church to the Salt Lake Valley...',
				title: 'To the Rockies',
				map: 'tosaltlake',
				secs: 10
			},
			{
				description: 'Brigham Young has called you to settle in ' + ending + '...',
				title: 'To ' + ending,
                map: 'tothewest',
				secs: 8
			},
			{
				description: 'You have been called to serve a mission to ' + mission + '...',
				title: 'To ' + mission,
                map: 'tothewest',
				secs: 5
			},
			{
				description: 'Answer these questions as you return back home again...',
				title: 'Returning Home',
                map: 'tothewest',
				secs: 3
			},
			{
				description: 'Home at last!  Congratulations, you have completed the quest!',
                map: 'tothewest',
				secs: 0
			}
		]


	function play() {

		if (interval) {
			clearInterval(interval)
			interval = false
		}

		timePast = levels[level].secs
		$('meter').val(timePast).attr('max', timePast)

        console.log('here', levels[level].map)

		if (levels[level].map) {
			$('body').attr('class', levels[level].map)
		}

		$('.title').text(levels[level].title || '')

		interval=setInterval(function() {
			$('progress, meter').val(--timePast);
			if (timePast<0) {
				if (interval) {
					clearInterval(interval)
					interval = false
				}
				Dialog.alert('Your times is up', {
					Restart: Quest.reset,
					Retry: function() {
						turn = 0
						play()
					}
				})
			}
		}, 1000)

		if (Object.keys(questions).length === 0) {
			questions = JSON.parse(questionsBackup)
		}

		var keys = Object.keys(questions)
		var question = keys[rnd(keys.length)];
		var answers = questions[question];

		delete questions[question];

		answer = answers[0];

		$('p').text(question)

		answers.sort((a, b) => { return rnd(2)-.5 })

		$('.buttonWrapper').css({fontSize:5})
		$('.buttonWrapper button').removeAttr('disabled').text('')

		var initWidth = 0;

		$('.buttonWrapper button').each(function(index) {
			initWidth = Math.max(initWidth, $(this).width())
			$(this).text(answers[index])
		})

		for(var i=10;i<40;i++) {
			$('.buttonWrapper').css({fontSize:i})

			//console.log($('.buttonWrapper').width(), buttonWidth, i)

			var buttonWidth = 0;
			$('.buttonWrapper button').each(function() {
				buttonWidth = Math.max(buttonWidth, $(this).width())
			})

			if (buttonWidth > initWidth) {
				$('.buttonWrapper').css({fontSize:(--i)})
				break;
			}
		}

		$('.shell').attr('open', 'open')

	}


} catch(e) { alert(e) }
