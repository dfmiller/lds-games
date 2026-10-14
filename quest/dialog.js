//try {

const Dialog = {

	element: function(tagName) {
		return document.createElement(tagName)
	},

	dialog: function(msg, title, buttons, className) {
		if (typeof title === 'object') {
			buttons = title
			title = ''
		}
		title = title || ''
		var dialog = document.createElement('dialog')
        dialog.setAttribute('class', className || '')
		document.getElementsByTagName('body')[0].appendChild(dialog)

		var form = document.createElement('form')
		dialog.appendChild(form)

		var header = document.createElement('header')
		header.innerHTML = title
		form.appendChild(header)

		var main = document.createElement('main')
		main.innerHTML = msg
		main.className = 'text-justify'
		form.appendChild(main)

		var footer = document.createElement('footer')

		Object.keys(buttons).forEach(function(buttonLabel, index) {
			var button = document.createElement('button')
			button.setAttribute('type', 'button')
			button.innerHTML = buttonLabel
			if (index === Object.keys(buttons).length-1) {
				button.tabIndex = "1"
			}
			button.addEventListener('click', function() {
				return (function(event) {
					buttons[buttonLabel] && buttons[buttonLabel]()
					document.getElementsByTagName('body')[0].removeChild(dialog)
				})()
			})
			footer.appendChild(button)
		})
		form.appendChild(footer)
		setTimeout(function() { dialog.open = 'open' }, 0)
		return dialog
	},

	alert: function(msg, title, buttons) {
		return this.dialog(msg, title, buttons || { OK: false }, 'alert')
	}

}

/*

console.log('dialog', Dialog)

Dialog.dialog("Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.", 'Permission', {
	decline: false,
	accept: false
})

Dialog.alert("Test")

/* */

//} catch(e) { alert(e) }
