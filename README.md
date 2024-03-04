# pontinet_api
Please install node first if you have not already
## Install MongoDB

To install Mongo DB go to the following site and follow the steps:

MongoDB: https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-windows/
MongoDB GUI & Shell: https://www.mongodb.com/try/download/shell

Might need this one too: https://www.mongodb.com/docs/mongodb-shell/install/#follow-the-prompts-to-install-mongosh
## Setup MongoDB

Once MongoDB is setup, open up any shell and type mongosh. This should connect you to mongoDB.

In the shell, type in 'use PontinetDB'. This should create a new database for you. 

## RUN THE APP

Enter the following into your command line. Wait for each one to complete before progressing to the next. 

Repeat steps 2-3 after a git pull. (Shouldn't have to always do this but just incase someone adds a library its a safe practice)

1. cp .env.development .env
2. yarn
3. yarn run dev

Reach out if there are any difficutlites 

## NOTICE

Please use yarn add instead of npm install to add packages to this repo
