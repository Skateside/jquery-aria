// - concatenate JavaScript files
//     - supplant strings
//     - modify source (remove "use strict")
//     - add banner ( (function () { ... )
// - minify JavaScript files
//     - sourcefiles

// - compile JSDoc
//     - set template?
// - unit tests (mocha/chai)
// - watch for file changes
// - JSLint validation

// run-sequence to create tasks of tasks

var gulp = require("gulp");
var concat = require("gulp-concat-util");
var minify = require("gulp-minify");
var sourcemaps = require("gulp-sourcemaps");
var jsdoc =  require("gulp-jsdoc3");

var fs = require("fs");
var pkgJson = JSON.parse(fs.readFileSync("./package.json"))

function getToday() {

    var date = new Date();

    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

}

gulp.task("concat", function () {

    return gulp.src([

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

        ])
        .pipe(concat("jquery.aria.js", {
            process: function (source, filename) {

                return (
                    "// Source: " + filename.replace(__dirname, "") + "\n" +
                    source
                        .replace(/(["'])use strict\1;?\s*/g, "")
                        .replace(/\/\*jslint\s[\w\s,]+\s\*\//, "")
                        .replace(/\/\*global\s[\$\w\s,]+\s\*\//, "")
                        .replace(/<%=\s*(\w+)\s*%>/g, function (ignore, k) {

                            return typeof pkgJson[k] === "string"
                                ? pkgJson[k]
                                : k;

                        })
                );

            }
        }))
        .pipe(concat.header(
            `/*! ${pkgJson.name} (${pkgJson.homepage}) - ` +
            `v${pkgJson.version} - ${pkgJson.license} license - ` +
            `${getToday()} */\n` +
            `(function ($) {\n` +
            `    "use strict";\n\n`
        ))
        .pipe(concat.footer("\n}(jQuery));"))
        .pipe(gulp.dest("./dist/"));

});

gulp.task("minify", function () {

    gulp.src("./dist/jquery.aria.js")
        .pipe(sourcemaps.init())
        .pipe(minify({
            ext: {
                min: ".min.js"
            },
            preserveComments: function (node, comment) {
                return comment.value.startsWith("!");
            }
        }))
        .pipe(sourcemaps.write("./", {
            sourceMappingURL: function (file) {
                return file.relative + ".map";
            }
        }))
        .pipe(gulp.dest("./dist/"));

});

gulp.task("doc", function (cb) {

    var config = require("./jsdocConfig.json");

    gulp.src("./dist/jquery.aria.js")
        .pipe(jsdoc(config, cb));

});
