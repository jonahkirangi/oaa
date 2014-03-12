'use strict';
module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-casper');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-express-server');


  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    simplemocha:{
      dev:{
        src:['test/*_test.js'],
        options:{
          reporter: 'spec',
          slow: 200,
          timeout: 1000
        }
      }
    },

    watch: {
      all: {
        files:['app.js', '**/*.js' ],
        tasks:['jshint']
      },
      express: {
        files:  [ 'app.js','models/**/*.js','routes/**/*.js','assets/**/*' ],
        tasks:  [ 'sass:dev', 'browserify:dev', 'express:dev' ],
        options: {
          // for grunt-contrib-watch v0.5.0+, "nospawn: true" for lower versions.
          // Without this option specified express won't be reloaded
          spawn: false
        }
      }
    },

    express: {
      options: {
        // Override defaults here
      },
      dev: {
        options: {
          script: 'app.js'
        }
      },
      prod: {
        options: {
          script: 'app.js',
          node_env: 'production'
        }
      },
      test: {
        options: {
          script: 'app.js'
        }
      }
    },

    browserify: {
      prod: {
        src: ['assets/js/*.js'],
        dest: 'dist/browser.js',
        options: {
          transform: ['debowerify'],
          debug: false
        }
      },
      dev: {
        src: ['assets/js/*.js'],
        dest: 'build/browser.js',
        options: {
          transform: ['debowerify'],
          debug: true
        }
      }
    },

    clean: {
      build: ['build'],
      dev: {
        src: ['build/**/*']
      },
      prod: ['dist']
    },

    copy: {
      prod: {
        expand: true,
        cwd: 'assets',
        src: ['css/*.css', '*.html', 'images/**/*' ],
        dest: 'dist/',
        flatten: true,
        filter: 'isFile'
      },
      dev: {
        expand: true,
        cwd: 'assets',
        src: ['css/*.css', '*.html', 'images/**/*' ],
        dest: 'build/',
        flatten: false,
        filter: 'isFile'
      }
    },

    sass: {
      dist: {
        files: {'build/css/styles.css': 'assets/scss/styles.scss'}
      },
      dev: {
        options: {
          includePaths: ['public/scss/'],
          sourceComments: 'map'
        },
        files: {'build/css/styles.css': 'assets/scss/styles.scss'}
      }
    },

    casper: {
      acceptance : {
        options : {
          test : true
        },
        files : {
          'test/acceptance/casper-results.xml' : ['test/acceptance/*_test.js']
        }
      }
    },

    jshint: {
      all: ['Gruntfile.js', 'app.js', 'models/**/*.js', 'test/**/*.js'],
      options: {
        jshintrc: true,
        globals: {
          console: true,
          module: true
        }
      }
    },
  });

  grunt.registerTask('default', ['test','watch:express']);
  grunt.registerTask('test', [ 'simplemocha:dev' ]);
  grunt.registerTask('watch', 'test, watch:all');
  grunt.registerTask('test:acceptance',['express:dev','casper']);
  grunt.registerTask('server', [ 'build:dev', 'express:dev','watch:express' ]);
  grunt.registerTask('build:dev',  [ 'clean:dev', 'sass:dev', 'browserify:dev', 'jshint:all', 'copy:dev' ]);

};
