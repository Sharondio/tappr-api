'use strict';

var Hapi = require('hapi'),
	Inert = require('inert'),
	Vision = require('vision');

var server = new Hapi.Server({debug: {request: ['info', 'error']}});

// Create server
server.connection({host: 'localhost', address: '0.0.0.0', port: 8001, routes: {cors: true}, labels: ['api']});

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
	{
		register: require('hapi-swaggered'),
		options: {
			info: {
				title: 'TAPPR API',
				description: 'Companion API to tappr-demo. Powered by node, hapi, joi, hapi-swaggered, hapi-swaggered-ui and swagger-ui',
				version: '1.0'
			}
		}
	},
	{
		register: require('hapi-swaggered-ui'),
		options: {
			title: 'TAPPR API',
			path: '/docs',
			authorization: false,
			swaggerOptions: {
				validatorUrl: null
			}
		}
	},
	{register: require('./routes/beer.js')},
    {register: require('./routes/brewery.js')},
	{register: require('./routes/user.js')},
    {register: require('./routes/category.js')}
];

server.route({
	path: '/',
	method: 'GET',
	handler: function (request, reply) {
		reply.redirect('/docs')
	}
});


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
