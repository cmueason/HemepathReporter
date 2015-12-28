all:
	haml index.haml > index.html
	sass sass/style.sass > css/style.css
	coffee --bare -p coffeescript/index.coffeescript > js/index.js
	open index.html
