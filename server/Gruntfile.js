module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Project configuration.
  grunt.initConfig({
    nodeunit: ['test/**/*.js'],
    watch: {
      files: '<config:lint.files>',
      tasks: 'default timestamp'
    },
    jshint: {
      files: ['gruntFile.js', 'server.js', 'config.js', 'src/*.js', 'test/**/*.js'],
      options: {
        esversion: 6,
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        globals: { require: false, __dirname: false, console: false, module: false, exports: false }
      }
    }
  });

  // Default task.
  grunt.registerTask('default', ['jshint']);

  grunt.registerTask('timestamp', function() {
    grunt.log.subhead(Date());
  });
};
