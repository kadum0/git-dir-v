module.exports = {
	globDirectory: './',
	globPatterns: [
		'**/*.{html,css,png,jpg,ico,jpeg,jfif,js}'
	],
	swDest: 'sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};