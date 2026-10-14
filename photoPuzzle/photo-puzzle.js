
const PhotoPuzzle = {

	remotePath: 'https://lds-photo-puzzle.s3-us-west-1.amazonaws.com/',

	/* from local storage */
	games_completed: 0,

	photos: Object.keys(local.temples),
	names: local.temples,

	srcIndexes: JSON.parse(localStorage.getItem('srcIndexes') || '{}'),

	gridSizes: [3,4,5,6,7,8,9],
	gridSize: localStorage.getItem('gridSize') || 5,

	score: localStorage.getItem('score') || 0,
	high_score: localStorage.getItem('highScore') || 0,

	level: (localStorage.getItem('photoGame') || 1) * 1,

	init: function() {

		$('.pickLevel').val(PhotoPuzzle.level)

		switch(PhotoPuzzle.level) {
			case 2:
			$('.gameBoard').addClass('step-0')
			break

			case 1: default:
			$('.gameBoard').addClass('step-1')
			break
		}
		$('#high_score').text(this.high_score)
		$('#score').text(this.score)
		this.initSizes()
		this.initSources()

		this.srcIndexes.temples = this.srcIndexes.temples || 0
		var selected = this.srcIndexes.temples + 1

		$('.thumbs span:nth-child('+selected+')').addClass('selected')

		this.bindElements()

		if (localStorage.getItem('squares')) {
			$('.settingsDialog form').submit()
		} else {
			setTimeout(function() { $('.settingsDialog').attr('open', true) }, 1)
		}
	},


	initSizes: function() {
		this.gridSizes.forEach(function(gridSize) {
			$('.gridSizes').append(
				$('<option value="'+gridSize+'"/>').text(gridSize+'x'+gridSize + ['(easiest)','','(default)','','','','(hardest)'][gridSize-3])
			).val(PhotoPuzzle.gridSize)
		})
	},


	initSources: function() {
		$('.thumbs').empty().append($('<div />').addClass('folder-temples'))
		this.photos.forEach(function(src) {
			PhotoPuzzle.createSource(src)
		})
	},


	createSource: function(src) {
        var fullSrc = src
		if (src.slice(0, 4) == 'aws/') {
			fullSrc = src.replace('aws/', PhotoPuzzle.remotePath)
		}

		//add span
		var source = $('<span/>').append(
			$('<img/>').attr('src', fullSrc).contextmenu(function() {
					event.preventDefault()
					if (confirm('Remove this Photo?')) {
						PhotoPuzzle.photos = PhotoPuzzle.photos.filter(function(s) {
							return s !== src
						})
						source.empty().remove()
					}
					return false
			})
		).click(function() {
			$('.thumbs span').removeClass('selected')
			$(this).addClass('selected')
			return (function() {
				PhotoPuzzle.srcIndexes.temples = PhotoPuzzle.photos.indexOf(src) || 0

				localStorage.setItem('srcIndexes', JSON.stringify(PhotoPuzzle.srcIndexes))

			})()
		})
		$('.thumbs .folder-temples').append(source)

		var img = new Image
		$(img).on('error', function() {
			source.remove()
		})
		img.src = fullSrc
	},


	bindElements: function() {

		$('.newGame').click(function() {
			$('dialog button[type="reset"]').removeAttr('disabled')
			$('.settingsDialog').attr('open', true)
		})

		$('.playButton').click(function() {
			PhotoPuzzle.level = $('.pickLevel').val() * 1
			localStorage.setItem('photoGame', PhotoPuzzle.level)
			localStorage.setItem('squares', '[]')
			localStorage.setItem('score', 0)
			$('#score').text(0)
		})

		$('.settingsDialog form').submit(function(event) {
			event.preventDefault()

			$('dialog button[type="reset"]').removeAttr('disabled')

			$('.settingsDialog').removeAttr('open')
			$('.game-board').removeClass('puzzle-complete new-high')

			var gridSize = PhotoPuzzle.gridSize = $('[name=gridSize]').val()
			localStorage.setItem('gridSize', gridSize)
			var squareSize = Math.floor(768/PhotoPuzzle.gridSize);
			var fixed = 0
			var plays = 0
			var score = (localStorage.getItem('score') || 0)*1

			$('#fixed').text(fixed + ' / ' + (PhotoPuzzle.gridSize*PhotoPuzzle.gridSize))

			/* randomize squares */
			var squares = JSON.parse(localStorage.getItem('squares') || '[]')

			if (!squares.length) {

				squares = [];
				switch(PhotoPuzzle.level) {
					case 2: //case '2': //rotated
					for(i=0;i<(PhotoPuzzle.gridSize*PhotoPuzzle.gridSize); i++) squares[i] = Math.floor(Math.random()*4+1)
					break

					default: //retrofit
					case 1: //shuffled
					for(i=0;i<(PhotoPuzzle.gridSize*PhotoPuzzle.gridSize); i++) squares[i] = i;
					squares.sort(function() { return Math.floor(Math.random()*3-1); });
					var same = [], q = -1; for(var i=0;i<squares.length;i++) if (squares[i] == i) same.push(i);
					for(var i=0;i<same.length;i++) {
						if (q ==-1) {
							q = same[i];
						} else {
							squares[q] = same[i];
							squares[same[i]] = q;
							q = -1;
						}
					} //for
					if (q != -1) {
						for(i=0;i<same.length;i++) {
							if (squares[i] != q) {
								squares[i] = [squares[q], squares[q] = squares[i]][0];
								break;
							}
						}
					} //if
					break
				}

				localStorage.setItem('squares', JSON.stringify(squares))

			} //if

			var src = PhotoPuzzle.photos[PhotoPuzzle.srcIndexes.temples || 0]

			PhotoPuzzle.src = src;

			$('.game-board').attr('data-name', PhotoPuzzle.names[src] || '')

			if (src && src.slice(0, 4) == 'aws/') {
				src = src.replace('aws/', PhotoPuzzle.remotePath)
			}

			var encoded = (encodeURI(src) || '').replace(/\(/g, '%28').replace(/\)/g, '%29')

			var image = new Image()
			image.onerror = function() {
				alert('error loading image '+ src)
			}
			image.onload = function() {
				var offsetx = Math.floor(Math.random()*(this.width - 768))
				var offsety = Math.floor(Math.random()*(this.height - 768))
				$('#img').css({
					backgroundImage: "url("+encoded+")",
					backgroundPosition: -offsetx + 'px ' + -offsety + 'px'
				});

				$('#zoom_img').css({
					backgroundImage: "url("+encoded+")",
					backgroundPosition: -offsetx + 'px ' + -offsety + 'px'
				});

				/* build puzzle */
				$('#squares').empty();
				for(var i=0;i<squares.length;i++) {
					var classes = 'square broken'
					var l = Math.floor(i%gridSize) * squareSize
					var t = Math.floor(i/gridSize) * squareSize

					switch(PhotoPuzzle.level) {
						case 2: //case '2':
							var x = -(i%PhotoPuzzle.gridSize)*squareSize - offsetx;
							var y = -Math.floor(i/PhotoPuzzle.gridSize)*squareSize - offsety;
							if (0 == squares[i] % 4) {
								fixed++;
								score++;
							} else {
								score += (4 - (squares[i] % 4)) + 1;
							}
							classes += ' rotated-'+squares[i];
							var squareId = i;
						break

						case 1: default:
							var x = -(squares[i]%gridSize)*squareSize - offsetx
							var y = -Math.floor(squares[i]/gridSize)*squareSize - offsety
							if (i === squares[i]) {
								fixed++;
								classes = 'square'
							}
							var squareId = squares[i]
						break
					}
					$('#squares').append(
						$('<span class="'+classes+'" data-position_id="'+i+'" data-square_id="'+squareId+'"></span>').css(
							{ left:l,top:t,backgroundPosition:x+'px '+y+'px'}
						)
					)
				}

				var firstSquare = -1, secondSquare = -1;

				$('#fixed').text(fixed + ' / ' + (gridSize*gridSize));

				$('.square').width(squareSize)
				.height(squareSize)
				.css({backgroundImage: "url("+encoded+")"})
				.filter('.broken')
				.mousedown(function() {

					if ($('.gameBoard').hasClass('step-1')) {
						$('.gameBoard').removeClass('step-1')
						$('.gameBoard').addClass('step-2')
					} else if ($('.gameBoard').hasClass('step-2')) {
						$('.gameBoard').removeClass('step-2')
					} else if ($('.gameBoard').hasClass('step-0')) {
						$('.gameBoard').removeClass('step-0')
					}

					var squareId = $(this).data('square_id');
					var currentSquare = $('[data-square_id='+squareId+']');

					switch(PhotoPuzzle.level) {
						case 2: //case '2':
						var oldRotation = squares[squareId];

						if (oldRotation == 0) {
							return;
						}

						var newRotation = ((oldRotation + 1) % 8);
						squares[squareId] = newRotation;
						currentSquare.removeClass('rotated-'+oldRotation).addClass('rotated-'+newRotation);
						score--;
						if ((newRotation % 4) == 0) {
							fixed++;
						} else if ((newRotation % 4) == 1) {
							fixed--;
						}
						break

						case 1: default:

						$(this).addClass('selected');
						if (firstSquare == -1) {
							firstSquare = squareId;
							return;
						} else if (firstSquare == squareId) {
							$(this).removeClass('selected');
							firstSquare = -1;
							return;
						} else {
							var fS = $('[data-square_id='+firstSquare+']');
							pos1 = {
								left:fS.css('left'),
								top:fS.css('top')
							};
							pos2 = {
								left:$(this).css('left'),
								top:$(this).css('top')
							};

							pid1 = fS.data('position_id');
							pid2 = currentSquare.data('position_id');

							fS.data('position_id', pid2);
							currentSquare.data('position_id', pid1);

							squares[pid1] = squareId;
							squares[pid2] = firstSquare;

							$(this).animate({left:pos1.left,top:pos1.top}, 400, function() {
								$(this).removeClass('selected');
							});
							fS.animate({left:pos2.left,top:pos2.top}, 400, function() {
								$(this).removeClass('selected');
							});

							var number_fixed = 0;

							if (squareId == squares[squareId]) {
								currentSquare.removeClass('broken').unbind('mousedown');
								fixed++;
								number_fixed++;
							}
							if (firstSquare == squares[firstSquare]) {
								fS.removeClass('broken').unbind('mousedown');
								fixed++;
								number_fixed++;
							}

							switch(number_fixed) {
								case 0: score-=1; break;
								case 1: score+=2; break;
								case 2: score+=8; break;
							}

							firstSquare = -1;

							break

						}

					}

					localStorage.setItem('score', score)

					$('#score').text(score);
					$('#fixed').text(fixed + ' / ' + (gridSize*gridSize));

					plays++;

					localStorage.setItem('squares', JSON.stringify(squares))

					$('#plays').text(plays);

					if (fixed === gridSize*gridSize) {

						localStorage.removeItem('squares')
						localStorage.setItem('score', 0)

						$('.game-board').addClass(PhotoPuzzle.high_score < score ? 'new-high' : 'puzzle-complete')

						$('.square').removeClass('rotated-4 broken')

						$('[name=new_image]').prop('checked', true)

						PhotoPuzzle.high_score = Math.max(PhotoPuzzle.high_score, score)
						$('#high_score').text(PhotoPuzzle.high_score)
						localStorage.setItem('highScore', PhotoPuzzle.high_score)

						PhotoPuzzle.games_completed++;
						$('#games_completed').text(PhotoPuzzle.games_completed)
						localStorage.setItem('gamesCompleted', PhotoPuzzle.games_completed)
						PhotoPuzzle.srcIndexes.temples = (PhotoPuzzle.srcIndexes.temples + 1) % PhotoPuzzle.photos.length

						localStorage.setItem('srcIndexes', JSON.stringify(PhotoPuzzle.srcIndexes))

						$('.thumbs span').removeClass('selected')
						$('.thumbs span:nth-child('+(PhotoPuzzle.srcIndexes.temples+1)+')').addClass('selected')[0].scrollIntoView()

						var delay = 1000;

						setTimeout(function() {
							$('.settingsDialog').attr('open', true)
						}, delay);
					}

				})

			}
			image.src = encoded
			/* */
		})

		$('.settingsDialog  button[type="reset"]').click(function(event) {
			event.preventDefault()
			$('.settingsDialog').removeAttr('open')
		})

		$('.preview').click(function() {
			$(this).removeClass('tap')
			$('#zoom').fadeIn()
		})

		$('#zoom').click(function() {
			$('#zoom').fadeOut()
		})

		$(window).resize(function() {
			var ratio = (Math.max(10, (screen.width > screen.height) ? Math.min(window.innerWidth/4, window.innerHeight/3) : Math.min(window.innerHeight/4, window.innerWidth/3)))/256
			$('#squares').css({ webkitTransform:'scale('+ratio+')' })

			var w = $(document.body).outerWidth()
			var h = $(document.body).outerHeight()
			var w2 = Math.floor(w/2)
			var h2 = Math.floor(h/2)
			var wh = (w-h)

			if (Math.abs(wh) < 100) {
				if (w < h) {
					w -= 100;
					w2 = Math.floor(w/2),
					wh = (w-h)
				} else {
					h -= (100-Math.abs(wh));
					h2 = Math.floor(h/2),
					wh = (w-h)
				}
			}

			var m = Math.min(w2, -wh);
			$('#img_wrapper').css({ left:0, top:(-wh-m)/4 });
			$('#zoom_wrapper').css({ left:0, top:(-wh)/2 });

			var r2 = (Math.min($('#preview').width(), $('#preview').height())-8)/768;
			$('#img_wrapper').css({ transform:'scale('+r2+')' });

			$('#zoom_wrapper').css({ transform:'scale('+ratio+')' })

		}).trigger('resize')

	},

}

PhotoPuzzle.init()
