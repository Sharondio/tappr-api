var Hapi = require('hapi');
var server = new Hapi.Server();
server.connection({ port: 8001, labels: 'api' });

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
});


server.route({
	method: 'GET',
	path: '/beer/{beerId}',
	handler: function (request, reply) {

		var db = request.server.plugins['hapi-mongodb'].db;

		db.collection('beers').find({  "id" : request.params.beerId }, function(err, result) {
			if (err) return reply(Hapi.error.internal('Internal MongoDB error', err));
			console.log( result.toArray() );
			reply(result.toArray());
		});

	}
});



// Start the application after the database connection is ready
server.start(function () {

	console.log("Server started at " + server.info.uri + ' on port ' + server.info.port);
});

