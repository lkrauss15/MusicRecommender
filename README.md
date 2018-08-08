# MusicRecommender

//////////////INSTALLATION INSTRUCTIONS//////////////

This web application requires npm (https://www.npmjs.com) for dependency management as well as some unix-based shell.

This web application also requires Node.js (https://nodejs.org/en/) version 8.11.3 LTS

Once npm and node.js are installed, navigate to the MusicRecommender root directory inside a unix shell. From there, type "npm install" (this will install all of the packages listed in package.json)

This should install the requisite libraries and other code required to run the app (such as express, Handlebars.js, jQuery, etc). 

Once npm has installed all dependencies successfully, the application can be run via "node server.js <database_password>". 

Then, simply navigate to localhost:4000 to view the application.

//////////////File Documentation//////////////
QueryStrings.js:
    Contains functions that generate SQL Query Strings
server.js:
    Initializes server and connects to database.
    Routes Traffic.
    Processes Query Requests.
    Processes/Formats returned tuples and sends them to Handlebars.js
style:
    Contains CSS files for Styling hbs files
javascript:
    Contains front-end javascript code (jQuery requests, ajax, organizing data)
views:
    Contains hbs files that Handlebars.js uses to render the HTML

