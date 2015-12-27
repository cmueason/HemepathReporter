all:
	haml index.haml > index.html
	coffee --bare -p coffeescript/index.coffeescript > js/index.js
	open index.html
