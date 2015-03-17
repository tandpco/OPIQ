# OPIQ
### Basics
Opportunity IQ is built on [KeystoneJS](http://www.keystonejs.com) which runs on [Node](https://nodejs.org/) &amp; [Express](http://expressjs.com/), and uses [MongoDB](http://www.mongodb.org/) for storage.
### Primary Flows
#### Registration
``` /routes/views/register.js ``` This is where the registration / pricing logic is run.  
``` /routes/views/register_success.js ``` This file determines whether or not to redirect the user to the registration success page or to an analysis that they have already begun.  
#### Assessment
``` /routes/views/analysis.js ``` is the home page of the app, where the user either creates a new assessment or continues on an existing one.  
``` /routes/views/index.js ``` is the actual assessment.  
``` /routes/views/printable.js ``` is where the logic for rendering the printout is contained.
#### Password Reset
``` 