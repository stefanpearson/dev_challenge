# Ribot
## Dev Challenge

Oh hi. Do `npm install` to grab the dependencies. Run the express server on port 8008 with `node app.js`.

### Grunt tasks

To build the client JavaScript bundle, run `grunt build`, this will also precompile any handlebars templates within `/views/shared/` into a single AMD module for use on the client.

#### To do

* Remove ability to scroll entire viewport when section is focussed, instead, add scroll pane to inner area of each section.
* Twitter needs authentication.
* Loader graphic (module is already complete).
* Don't instantiate a new section every time it's activated.
* Testing testing testing (currently only tested on iOS and Chrome).
