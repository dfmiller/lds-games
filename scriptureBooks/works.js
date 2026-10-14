var rnd = function (n) {
	return Math.floor(Math.random() * n)
}

function supports_html5_storage(){
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch(e) {
        return false;
    }
}

if (!supports_html5_storage()) {
localStorage =  {
	setItem: function(){},
	getItem: function(){ return null }
}
}


var Game = {

	milliseconds: 0,
    startTime: null,
	best: JSON.parse(localStorage.getItem('bestTime') || 5940 * 60 * 1000),

	init() {

		$('.best').text(new Date(Game.best).toISOString().substr(14, 9))

		$('.volume').click(function () {
			if ($(this).text() == Game.volume) {
				$(this).addClass('right')
				Game.showBook()
			} else if (Game.interval) {
				Game.errors++
					$('.errors').text(Game.errors)
				$(this).addClass('wrong')
			}
		})

		$('.restart').click(function () {
			$('.startDialog').attr('open', true)
		})

		$('.startDialog').attr('open', true)

		$('.startDialog button').click(function () {
			$('.startDialog').removeAttr('open')
			Game.run()
		})

	},

	showBook() {
		$('.wrong').removeClass('wrong')
		setTimeout(() => {
			$('.right').removeClass('right')
		}, 500)
		$('.level').text(this.total - this._books.length + '/' + this.total)

		var book = Game._books.pop()
		if (book) {
			Game.volume = books[book]
			$('.book, .instructions em').text(book)
			$('.book, .instructions').css({ visibility: 'visible' })
		} else {
			$('.book, .instructions').css({ visibility: 'hidden' })
			clearInterval(Game.interval)
			Game.interval = null
			Game.best = Math.min(Game.best, Game.milliseconds)
			localStorage.setItem('bestTime', JSON.stringify(Game.best))
			$('.best').text(new Date(Game.best).toISOString().substr(14, 9))
		}
	},


	run() {

		clearInterval(Game.interval)

		this._books = Object.keys(books)
		this._books.sort(function (a, b) {
			return rnd(9) - 4
		})

		this.total = this._books.length

		this.errors = 0
		$('.errors').text(Game.errors)

		Game.milliseconds = 0
        Game.startTime = Date.now()
		Game.interval = setInterval(function () {
			Game.milliseconds = Date.now() - Game.startTime
			$('.timer').text(new Date(Game.milliseconds)
				.toISOString().substr(14, 9)
			)
		}, 1)

		Game.showBook()

	}


}


Game.init()
