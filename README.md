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


		method: 'GET'
		path: '/user'
		// Returns all users

		method: 'POST'
		path: '/user'
		// Creates a new user

		method: 'GET'
		path: '/user/{userName}'
		// Returns a single user object

		method: 'GET'
		path: '/user/{userName}/favorite/beer'
		// Returns a list of user favorites

		method: 'POST'
		path: '/user/{userName}/favorite/beer'
		// Adds a beer to favorites

		method: 'GET'
		path: '/user/{userName}/favorite/beer/{beerId}'
		// Returns the user favorite status of a single beer

		method: 'DELETE'
		path: '/user/{userName}/favorite/beer/{beerId}'
		// Deletes a beer from user favorites

		method: 'GET'
		path: '/user/{userName}/rating/beer'
		// Returns a list of all rated beers for a user

		method: 'POST'
		path: '/user/{userName}/rating/beer'
		// Adds a rating to a beer

		method: 'GET'
		path: '/user/{userName}/rating/beer/{beerId}'
		// Returns the user rating status and rating for a beer

		method: 'DELETE'
		path: '/user/{userName}/rating/beer/{beerId}'
		// Removes a user rating from a beer.


## License

MIT
