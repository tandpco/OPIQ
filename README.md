# OPIQ
### Basics
Opportunity IQ is built on [KeystoneJS](http://www.keystonejs.com) which runs on [Node](https://nodejs.org/) &amp; [Express](http://expressjs.com/), and uses [MongoDB](http://www.mongodb.org/) for storage.
### Primary Flows
#### Registration
``` register.js ```
This is where the registration / pricing logic is run.
``` register_success.js ```
This file determines whether or not to redirect the user to the registration success page or to an analysis that they have already begun.
#### Assessment
``` analysis.js ```
+ -- This is the home page of the app, where the user either creates a new assessment or continues on an existing one.
+ index.js
+ -- This is the actual assessment.
+ printable.js
+ -- This is where the logic for rendering the printout is contained.