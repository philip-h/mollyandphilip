module.exports = {
	globDirectory: 'public/',
	globPatterns: [
		'**/*.{css,ico,ttf,png,jpg,webp,svg,html,js,json}'
	],
	swDest: 'public/sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};