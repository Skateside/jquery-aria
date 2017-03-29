# Changelog

## Alpha Version

### 0.7.0a
_2017-03-29_
- Converting Grunt to gulp.
- Adding unit tests for private functions.

### 0.6.1a
_2017-03-23_
- Adding JSLint validation and updated all source files to validate.

### 0.6.0a
_2017-03-04_
- Modified `jQuery.ariaHooks` to work more like `jQuery.attrHooks`.
- Renamed `jQuery.ariaMap` to `jQuery.ariaFix` in keeping with `jQuery.propFix`.
- Added tests for the code, fixing bugs where found.
- Exposed `jQuery.normaliseAria.cache`

### 0.5.0a
_2017-03-01_
- Added `jQuery.ariaMap` and `jQuery.ariaHooks`.
- Added caching to `jQuery.normaliseAria`.
- Corrected documentation to include aliases in the list of functions.
- Removed `jQuery#ariaVisible` since `jQuery.ariaHooks` will handle `aria-hidden` the same way.

### 0.4.0a
_2017-02-27_
- Fixed references to handler properties.
- **Breaking change**: Adjusted the way that `jQuery#identify` works based on [issue #3](https://github.com/Skateside/jquery-aria/issues/3).

### 0.3.0a
_2017-02-25_
- Split main file into smaller chunks.
- Couple of amends to documentation to reflect new files.
- Added a build process.

### 0.2.0a
_2017-02-24_
- Converted documentation to use JSDoc.
- Added `jQuery#addRole` and modified `jQuery#removeRole` to allow an argument to be passed based on [issue #1](https://github.com/Skateside/jquery-aria/issues/1).

### 0.1.0a
_2016-12-17_
- Initial version.
