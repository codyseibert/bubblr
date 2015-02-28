module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt, {pattern: ['grunt-*']});

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        bowerInstall: {
            target: {
                src: [
                    'src/public/index.html'
                ],
                cwd: 'src/public',
                dependencies: true,
                exclude: [],
                fileTypes: {},
                ignorePath: '',
                overrides: {}
            }
        },

        coffee: {
            compile: {
                files: {
                    'src/public/js/app.js': [
                        'src/public/coffee/*.coffee',
                        'src/public/coffee/controllers/*.coffee',
                        'src/public/coffee/services/*.coffee',
                        'src/public/coffee/helpers/*.coffee'
                    ]
                }
            }
        },

        concat: {
            options: {
                separator: ';',
            },
            prod: {
                src: ['src/public/js/**/*.js'],
                dest: 'build/tmp/app.js',
            },
        },

        copy: {
            prod: {
                files: [
                    {
                        expand: true,
                        flatten: false,
                        cwd: 'src',
                        src: [
                            'public/templates/**',
                            'public/bower_components/**',
                            'public/css/**',
                            '*.js'
                        ],
                        dest: 'build/app',
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        flatten: false,
                        cwd: '.',
                        src: [
                            'package.json'
                        ],
                        dest: 'build/app',
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        flatten: false,
                        cwd: 'src/public',
                        src: [
                            'index.html'
                        ],
                        dest: 'build/app/public',
                        filter: 'isFile'
                    }
                ]
            }
        },

        cssmin: {
            prod: {
                options: {
                    banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
                },
                files: {
                    'build/app/public/css/app.min.css': ['src/public/css/app.css']
                }
            }
        },

        htmlmin: {
            prod: {
                options: {
                    collapseWhitespace: true
                },
                files: {
                    'build/app/public/index.html': 'build/app/public/index.html'
                }
            }
        },

        preprocess:{
            prod: {
                src: './build/app/public/index.html',
                dest: './build/app/public/index.html'
            }
        },

        processhtml: {
            prod: {
                files: {
                    'build/app/public/index.html' : 'build/app/public/index.html'
                }
            }
        },

        replace: {
            index: {
                src: 'build/app/public/index.html',
                dest: 'build/app/public/index.html',
                replacements: [{
                    from: 'js/app.js',
                    to: 'js/app.min.js'
                }]
            },
            css: {
                src: 'build/app/public/index.html',
                dest: 'build/app/public/index.html',
                replacements: [{
                    from: 'css/app.css',
                    to: 'css/app.min.css'
                }]
            }
        },

        stylus: {
            prod: {
                files: {
                    'src/public/css/app.css': 'src/public/styl/app.styl'
                }
            }
        },

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            prod: {
                src: 'build/tmp/app.js',
                dest: 'build/app/public/js/app.min.js'
            }
        }
    });

    grunt.registerTask('build', [
        'bowerInstall',
        'stylus',
        'coffee',
        'copy',
        'concat',
        'uglify',
        'cssmin',
        'replace:index',
        'replace:css',
        'preprocess',
        'processhtml',
        'htmlmin'
    ]);
};
