# OPIQ
### Basics
Opportunity IQ is built on [KeystoneJS](http://www.keystonejs.com) which runs on [Node](https://nodejs.org/) &amp; [Express](http://expressjs.com/), and uses [MongoDB](http://www.mongodb.org/) for storage. The templating language is [Jade](jade-lang.com).
### Primary Flows
#### Registration
``` /routes/views/register.js ``` is where the registration / pricing logic is run.  
``` /routes/views/register_success.js ``` determines whether or not to redirect the user to the registration success page or to an analysis that they have already begun.  
#### Assessment
``` /routes/views/analysis.js ``` is the home page of the app, where the user either creates a new assessment or continues on an existing one.  
``` /routes/views/index.js ``` is the actual assessment.  
``` /routes/views/printable.js ``` is where the logic for rendering the printout is contained.
#### Password Reset
``` /routes/views/password/forgotPass.js ``` is the password reset form, where the user requests a reset email.
``` /routes/views/password/resetPass.js ``` is where the user enters a new password and the users token is checked for authenticity.
``` /models/users.js ``` has the resetPassword method which is where the reset token is generated and stored to the users account.
``` /templates/emails/forgotten-password.js ``` is the template for the email sent out to the user that requested a password reset token.
### Assessments
Assessments are stored in a few seperated models. ```analysis.js``` is the main assessment model. This stores two primary fields, "user", and "title", as well as the database "_id". Using these fields we load the related records for each answer (```answer.js```). Each record in ```pages.js``` is a question in the assessment flow.
### Environments
OPIQ is currently hosted on Heroku.

The staging environment can always be found with the latest code at ```http://opiq-stage.herokuapp.com/```

The live environment can be found at ```http://opiq.opportunityiq.com/```, which functions as a CNAME for ```http://opportunityiq.herokuapp.com/```