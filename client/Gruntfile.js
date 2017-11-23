module.exports = (grunt) => {
  // Project configurations
  grunt.initConfig({
    distPath: 'dist',
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
    src: {
      js: ['app/**/*.js'],
      html: ['app/**/*.html'],
      less: ['app/stylesheets/stylesheets.less']
    },
    clean: ['<%= distPath %>/*'],
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    concat: {
      options: {
        seperator: '\n'
      },
      dist: {
        src: ['app/**/*.js'],
        dest: '<%= distPath %>/<%= pkg.name %>.js'
      },
      index: {
        src: ['app/index.html'],
        dest: '<%= distPath %>/index.html',
        options: {
          process: true
        }
      }
      // angular: {
      //   src: ['assets/angular.min.js'],
      //   dest: '<%= distPath %>/angular.js'
      // },
      // bootstrap: {
      //   src: ['assets/bootstrap.min.js'],
      //   dest: '<%= distPath %>/bootstrap.js'
      // },
      // jquery: {
      //   src: ['assets/jquery-3.2.1.min.js'],
      //   dest: '<%= distPath %>/jquery.js'
      // }
    },
    jshint:{
      files:['GruntFile.js', 'app/**/*.js'],
      options:{
        curly:true,
        eqeqeq:true,
        immed:true,
        latedef:true,
        newcap:true,
        noarg:true,
        sub:true,
        boss:true,
        eqnull:true,
        globals:{},
        esversion: 6,
      }
    },
    copy : {
      main : {
        files: [
          { expand: true, flatten: true, src: ['app/__header.html', 'app/stylesheets/stylesheets.less'], dest: 'dist/' },
        ]
      }
    },
    recess: {
      build: {
        files: {
          '<%= distPath %>/<%= pkg.name %>.css':
          ['<%= src.less %>'] },
        options: {
          compile: true
        }
      }
    },
  });

  // Load plugins to run tasks
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  //grunt.loadNpmTasks('grunt-contrib-qunit');;
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-recess');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Tasks
  grunt.registerTask('default', ['jshint', 'concat']);
  grunt.registerTask('build', ['clean', 'concat', 'copy', 'recess:build']);
};