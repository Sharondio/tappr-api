exports.register = function (server, options, next) {

	var db = server.plugins['hapi-mongodb'].db;

	server.route({
		method: 'GET',
		path: '/beer/{beerId}',
		handler: function (request, reply) {

			db.collection('beers').find({id: parseInt(request.params.beerId) }, function(err, result) {
				if (err) return reply(Hapi.error.internal('Internal MongoDB error', err));
				reply(result.toArray());
			});

		}
	});


	next();
};

exports.register.attributes = {
	name: 'beer-routes'
};
