# Ribot
## Dev Challenge

Oh hi. [See the deployed version](http://ribot_challenge.eu01.aws.af.cm).

Alternatively, to install, run `npm install` to grab the dependencies. Start the express server on port 8008 with `node app.js`.

### Grunt tasks

To build the client JavaScript bundle, run `grunt build`, this will also precompile any handlebars templates within `/views/shared/` into a single AMD module for use on the client.

### LESS

Compile `/less/build.less` to `/public/css/` for the bundled stylesheet.

#### To do

* Section needs inner scrollpane for overflow content.
* Twitter needs authentication with API 1.1.
* Loader graphic (module is already complete).
* Don't instantiate a new section every time it's activated.
* Testing testing testing (currently only tested on iOS and Chrome).
* Burn SVGs into a webfont for Android <3 (that was most certainly not a heart) support.