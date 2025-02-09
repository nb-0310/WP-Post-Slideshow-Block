const config = require('@wordpress/prettier-config');

config.overrides = [
	{
		files: ['*.scss', '*.css', '*.js'],
		options: {
			printWidth: 120,
			singleQuote: true,
		},
	},
];

module.exports = config;
