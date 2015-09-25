# tappr-api

API for Tappr AngularJS demo app

## Usage
This is the companion document for the tappr-demo repo.

## Installation
This application requires MongoDB as a data store and node.js to run the API server. It is currently tested and run under node 0.10.22. If you're running a different version of node, install (Node Version Manager - 'nvm')[https://github.com/creationix/nvm] and set your version to 0.10.22.

    > git clone git@github.com:Sharondio/tappr-api.git
    > cd tappr-api/data
    > mongoimport --db ncdevcon --collection beers --host 127.0.0.1 beers.json
    > mongoimport --db ncdevcon --collection users --host 127.0.0.1 users.json
    > mongoimport --db ncdevcon --collection breweries --host 127.0.0.1 breweries.json
    > mongoimport --db ncdevcon --collection categories --host 127.0.0.1 categories.json
    > mongoimport --db ncdevcon --collection styles --host 127.0.0.1 styles.json
    > cd ..
    > node ./index.js

The application is setup to run on port 8001, which is the port that the companion app is setup to find.

## API

The API uses the excellent Swagger library for automatically creating documentation. Once the API is running, browse to the (API Home Page)[http://localhost:8001] and you'll see the Swagger documentation interface.
You can then click the route groups and browse through and even test the endpoints.

## License

MIT
