module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('bower.json'),
    uglify: {
      options: {
        banner: '/*!  <%= pkg.name %> - <%= pkg.homepage %> - <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          '<%= pkg.name %>.min.js': ['<%= pkg.main %>']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');

};