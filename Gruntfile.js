module.exports = function (grunt) {
	grunt.initConfig({
	  pkg: grunt.file.readJSON('package.json'),
  
	  // Minify JavaScript
	  uglify: {
		build: {
		  files: {
			'dist/js/block.min.js': ['src/js/block.js']
		  }
		}
	  },
  
	  // Minify CSS
	  cssmin: {
		build: {
		  files: {
			'dist/css/block.min.css': ['src/css/index.css']
		  }
		}
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