# jQuery WAI-ARIA

This is a jQuery plugin that adds methods for manipulating WAI-ARIA attributes. Unlike other plugins that do similar things, this plugin has been designed to match jQuery's style making it easy to pick up and allows for a lot of flexibility with hooks and fixes that can adjust the way attribute are applied without having to modify the plugin itself. There are also helper methods to reference elements and set states.

Currently this project is still in the **alpha** stage meaning that it may get breaking changes regularly. Feel free to use this code in the mean time, but beware of future releases. I'll release a beta version once I'm satisfied with how it works.

## Full Documentation

Full [jQuery WAI-ARIA plugin documentation](https://skateside.github.io/jquery-aria/doc/) including all methods and examples of usage, hooks and fixes.

## Gulp tasks

There are a few gulp tasks to aid development. These are the main processes:

| Command | Tasks run | Description |
| --- | --- | --- |
| `dev` | <ul><li><code>watch</code></li></ul> | This watches for changes and creates development files. |
| `prod` | <ul><li><code>lint</code></li><li><code>concat:test</code></li><li><code>test</code></li><li><code>concat:prod</code></li><li><code>minify</code></li></ul> | This creates the final files and minifies them. Unit tests and linting is also run. |
| `doc` | | Creates the documentation based on the files created using `prod`. |

There are also a few sub tasks that can be run in order to do specific tasks.

| Command | Description |
| --- | --- |
| `concat:test` | Creates the "tmp/jquery.aria.js" file. This is the same as "dist/jquery.aria.js" except that the file isn't committed to Git and the other processes ignore it. This is mainly useful for testing changes. |
| `concat:dev` | Creates the file "tmp/jquery.aria-open.js" which is the same as the "tmp/jquery.aria.js" file but without the IIFE wrapper, allowing all private methods to be tested. |
| `concat:prod` | Creates the "dist/jquery.aria.js" file. |
| `lint` | Validates all the files in the "src" folder using JSLint. |
| `minify` | Creates the "dist/jquery.aria.min.js" "dist/jquery.aria.min.js.map" files, based on the "dist/jquery.aria.js" file. |
| `test` | Runs all the unit tests on the "tmp/jquery.aria-open.js" file. |
| `watch` | This watches for changes to specific files. When the gulpfile or a file in the "src" folder changes, `concat:dev` and `concat:test` are run and changing a file in the "test" folder will run `concat:test` then `test`. |

## License

This code has an MIT license. See the [LICENSE](https://github.com/Skateside/jquery-aria/blob/master/LICENSE) file for full details.

## Change Log

You can see the change log in the [CHANGELOG](https://github.com/Skateside/jquery-aria/blob/master/CHANGELOG.md) file in the root folder.
