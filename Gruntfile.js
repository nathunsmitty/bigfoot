/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
module.exports = function(grunt) {
  const baseStyles = [
    'src/scss/foundation/bigfoot-variables.scss',
    'src/scss/foundation/bigfoot-mixins.scss',
    'src/scss/base/bigfoot-button.scss',
    'src/scss/base/bigfoot-popover.scss',
  ];
  const variants = ['bottom', 'number'];

  const concatSet = {
    options: {
      stripBanners: true,
      banner:
        "// <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today('yyyy.mm.dd') %>\n\n\n",
      separator: '\n\n\n// -----\n\n\n',
    },

    main: {
      src: baseStyles,
      dest: 'dist/bigfoot-default.scss',
    },
  };

  const sassSet = { 'dist/bigfoot-default.css': 'dist/bigfoot-default.scss' };
  const autoprefixSet = {
    'dist/bigfoot-default.css': 'dist/bigfoot-default.css',
  };

  variants.forEach(function(variant) {
    const css = `dist/bigfoot-${variant}.css`;
    const scss = css.replace('.css', '.scss');
    const src = scss.replace('dist/', 'src/scss/variants/');
    const conc = baseStyles.slice(0);
    conc.push(src);
    concatSet[variant] = {
      src: conc,
      dest: scss,
    };

    sassSet[css] = scss;
    return (autoprefixSet[css] = css);
  });

  // 1. CONFIG
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    uglify: {
      build: {
        src: 'dist/bigfoot.js',
        dest: 'dist/bigfoot.min.js',
      },
    },

    concat: concatSet,

    coffee: {
      dist: {
        src: 'src/coffee/bigfoot.coffee',
        dest: 'dist/bigfoot.js',
      },
    },

    sass: {
      dist: {
        options: {
          style: 'expanded',
        },

        files: sassSet,
      },
    },

    autoprefixer: {
      dist: {
        files: autoprefixSet,
      },
    },

    watch: {
      options: {
        livereload: false,
      },

      coffee: {
        files: ['src/coffee/bigfoot.coffee'],
        tasks: ['coffee', 'uglify'],
        options: {
          spawn: false,
        },
      },

      scss: {
        files: ['src/**/*.scss'],
        tasks: ['concat', 'sass', 'autoprefixer'],
        options: {
          spawn: false,
        },
      },
    },
  });

  // 2. TASKS
  require('load-grunt-tasks')(grunt);

  // 3. PERFORM
  grunt.registerTask('default', [
    'coffee',
    'uglify',
    'concat',
    'sass',
    'autoprefixer',
  ]);

  grunt.registerTask('styles', ['concat', 'sass', 'autoprefixer']);

  return grunt.registerTask('scripts', ['coffee', 'uglify']);
};
