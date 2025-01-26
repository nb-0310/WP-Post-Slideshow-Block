module.exports = function (grunt) {
	grunt.initConfig({
	  pkg: grunt.file.readJSON('package.json'),
  
	  // Minify JavaScript
	  uglify: {
		js: {
			options: {
				compress: {
					drop_console: true, // <-
				},
			},
			files: [
				{
					expand: true,
					cwd: 'dist/js',
					src: [ '*.js', '!*.min.js' ],
					dest: 'dist/js',
					ext: '.min.js',
				},
			],
		},
	},
  
	  // Minify CSS
	  cssmin: {
		options: {
			keepSpecialComments: 0,
		},
		css: {
			files: [
				{
					expand: true,
					cwd: 'dist/css',
					src: [ '*.css', '!*.min.css', '!blocks/*.css' ],
					dest: 'dist/css',
					ext: '.min.css',
				},
			],
		},
	},
  
	  // Watch files for changes
	  watch: {
		js: {
		  files: ['src/js/**/*.js'],
		  tasks: ['uglify']
		},
		css: {
		  files: ['src/css/**/*.css'],
		  tasks: ['cssmin']
		}
	  },
  
	  // Clean dist folder
	  clean: {
		build: ['dist/']
	  }
	});
  
	// Load tasks
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-clean');
  
	// Register tasks
	grunt.registerTask('default', ['uglify', 'cssmin']);
	grunt.registerTask('minify', ['clean', 'uglify', 'cssmin']);
  };