'use strict';

var Hapi = require('hapi'),
	Inert = require('inert'),
	Vision = require('vision');

var server = new Hapi.Server({debug: {request: ['info', 'error']}});

// Create server
server.connection({host: 'localhost', address: '0.0.0.0' ,port: 8001, routes: {cors: true}});

// Add plugins
var plugins = [
	{
		register: require('hapi-mongodb'),
		options: {
			"url": "mongodb://localhost:27017/ncdevcon",
			"settings": {
				"db": {
					"native_parser": false
				}
			}
		}
	},
	{
		register: require('good'),
		options: {
			opsInterval: 1000,
			reporters: [{
				reporter: require('good-console'),
				events: { log: '*', response: '*' }
			}]
		}
	},
	Inert,
	Vision,
	{register: require('./routes/beer.js')},
	{register: require('./routes/user.js')},
    {register: require('./routes/category.js')}
];

server.register(plugins, function (err) {
	if (err) { throw err; }

	if (!module.parent) {
		server.start(function(err) {
			if (err) { throw err; }

			server.log('info', 'Server running at: ' + server.info.uri);
		});
	}
});

module.exports = server;
