'use strict';

var Hapi = require('hapi');

var server = new Hapi.Server({debug: {request: ['info', 'error']}});


// Create server
server.connection({
	host: 'localhost',
	port: 8001
});

//MongoDB connection info
var dbOpts = {
	"url": "mongodb://localhost:27017/ncdevcon",
	"settings": {
		"db": {
			"native_parser": false
		}
	}
};


// Add routes
var plugins = [
	{
		register: require('hapi-mongodb'),
		options: dbOpts
	},
	{
		register: require('./routes/beer.js')
	}
];

server.register(plugins, function (err) {
	if (err) { throw err; }

	//if (!module.parent) {
		server.start(function(err) {
			if (err) { throw err; }

			server.log('info', 'Server running at: ' + server.info.uri);
		});
	//}
});

module.exports = server;