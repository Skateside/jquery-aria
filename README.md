# jQuery WAI-ARIA

This is a jQuery plugin that adds methods for manipulating WAI-ARIA attributes. Unlike other plugins that do similar things, this plugin has been designed to match jQuery's style making it much easier to pick up.

Currently this project is still in the **alpha** stage meaning that it may get breaking changes regularly. Feel free to use this code in the mean time, but beware of future releases. I'll release a beta version once I'm satisfied with how it works.

## Full Documentation

[jQuery WAI-ARIA documentation](https://skateside.github.io/jquery-aria/doc/)

## License

This code has an MIT license. See the LICENSE file for full details.

## Change Log

You can see the change log in the root folder.

## Grunt tasks

There are a few grunt tasks to help with development:

- `grunt compile` will compile the JavaScript files based on the source.
- `grunt test` will run the unit tests.
- `grunt doc` will generate the documentation.
- `grunt lint` will pass the files through JSLint.
- `grunt` will start watching for changes to the source files, running `grunt compile` when a change occurs.

## Known issues

- Does not pass JSLint because `grunt-lint` needs updating ([pull request](https://github.com/stephenmathieson/grunt-jslint/pull/59)) and `node-jslint` is not up-to-date ([issue](https://github.com/reid/node-jslint/issues/161)).
- `grunt test` fails, probably due to a bug in PhantomJS. More testing is needed to identify the issue, but if the tests are run in a browser then they all pass.
