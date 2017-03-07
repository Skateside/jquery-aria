module.exports = function (grunt) {

    var pkgJson = require("./package.json");

    grunt.initConfig({

        pkg: pkgJson,

        concat: {
            options: {
                banner: (
                    "/*! <%= pkg.name %> (<%= pkg.homepage %>) - " +
                    "v<%= pkg.version %> - <%= pkg.license %> license - " +
                    "<%= grunt.template.today('yyyy-mm-dd') %> */\n" +
                    "(function ($) {\n" +
                    "    \"use strict\";\n\n"
                ),
                footer: "\n}(jQuery));",
                process: function (src, filename) {

                    return (
                        "// Source: " + filename + "\n" +
                        src
                            .replace(/(["'])use strict\1;?/g, "")
                            .replace(/\/\*jslint\s[\w\s,]+\s\*\//, "")
                            .replace(/\/\*global\s[\$\w\s,]+\s\*\//, "")
                            .replace(/<%=\s*(\w+)\s*%>/g, function (ignore, k) {

                                return typeof pkgJson[k] === "string"
                                    ? pkgJson[k]
                                    : k;

                            })

                    );

                }
            },
            dist: {
                src: [

                    // Documentation
                    "src/doc/file.js",
                    "src/doc/external/jQuery.js",
                    "src/doc/callback/Attribute_Callback.js",
                    "src/doc/typedef/ARIA_state.js",
                    "src/doc/typedef/ARIA_hook.js",
                    "src/doc/typedef/jQuery_param.js",

                    // Globals
                    "src/global/variables.js",
                    "src/global/identify.js",
                    "src/global/identity.js",
                    "src/global/interpretString.js",
                    "src/global/isElement.js",
                    "src/global/memoise.js",
                    "src/global/normalise.js",
                    "src/global/startsWith.js",
                    "src/global/toWords.js",
                    "src/global/handlers.js",
                    "src/global/handlers/property.js",
                    "src/global/handlers/reference.js",
                    "src/global/handlers/state.js",
                    "src/global/access.js",
                    "src/global/removeAttribute.js",

                    // Members
                    "src/member/normaliseAria.js",
                    "src/member/ariaFix.js",
                    "src/member/ariaHooks.js",

                    // Instances
                    "src/instance/identify.js",
                    "src/instance/aria.js",
                    "src/instance/ariaRef.js",
                    "src/instance/ariaState.js",
                    "src/instance/removeAria.js",
                    "src/instance/role.js",
                    "src/instance/addRole.js",
                    "src/instance/removeRole.js",
                    "src/instance/ariaFocusable.js"

                ],
                dest: "dist/jquery.aria.js"
            }
        },

        jsdoc: {
            dist: {
                src: ["dist/jquery.aria.js"],
                options: {
                    //private: true,
                    destination: "doc",
                    template: "node_modules/docdash"
                }
            }
        },

        // https://gist.github.com/maicki/7781943
        mocha: {
            all: {
                src: ["test/testrunner.html"]
            },
            options: {
                run: true
            }
        },

        uglify: {
            options: {
                banner: (
                    "/*! <%= pkg.name %> (<%= pkg.homepage %>) - " +
                    "v<%= pkg.version %> - <%= pkg.license %> license - " +
                    "<%= grunt.template.today('yyyy-mm-dd') %> */"
                ),
                sourceMap: true
            },
            dist: {
                files: {
                    "dist/jquery.aria.min.js": ["dist/jquery.aria.js"]
                }
            }
        },

        watch: {
            dist: {
                files: ["Gruntfile.js", "src/**/*.js"],
                tasks: ["concat", "uglify"]
            }
        }

    });

    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks("grunt-jsdoc");
    grunt.loadNpmTasks('grunt-mocha');
    grunt.loadNpmTasks('grunt-contrib-watch');

    //grunt.registerTask("default", ["concat", "uglify", "jsdoc"]);
    grunt.registerTask("default", ["watch"]);
    grunt.registerTask("compile", ["concat", "uglify"]);
    grunt.registerTask("doc", ["jsdoc"]);
    grunt.registerTask("test", ["mocha"]);

};
