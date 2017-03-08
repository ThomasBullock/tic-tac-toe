

module.exports = {
	entry: './src/js/game.js',
	
	output: {
		path: './',
		filename: 'bundle.js'
	},
	
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			}, 
			{
				test: /\.scss$/,
				exclude: /node_modules/,	
				loader: 'style!css!sass'
			}
		]
	}
};