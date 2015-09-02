var Composer = require('./index');

Composer(function (err, server) {

	if (err) {
		throw err;
	}

	var dbOpts = {
		"url": "mongodb://localhost:27017/ncdevcon",
		"settings": {
			"db": {
				"native_parser": false
			}
		}
	};

	server.register({
		register: require('hapi-mongodb'),
		options: dbOpts
	}, function (err) {
		if (err) {
			console.error(err);
			throw err;
		}

		server.start(function () {
			console.log("Server started at " + server.info.uri + ' on port ' + server.info.port);
		});

	});


});





/*



var Hapi = require('hapi');
var server = new Hapi.Server();
server.connection({ port: 8001, labels: 'api' });









// Start the application after the database connection is ready
server.start(function () {

	console.log("Server started at " + server.info.uri + ' on port ' + server.info.port);
});

*/