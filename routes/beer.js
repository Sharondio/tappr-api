exports.register = function (server, options, next) {

	var db = server.plugins['hapi-mongodb'].db;

	server.route({
		method: 'GET',
		path: '/beer',
		handler: function (request, reply) {
			var args = {};
			var limit = request.query.limit || 20;
			var skip = request.query.skip || 0;
			limit = parseInt( limit );
			skip = parseInt( skip );

			var result = db.collection('beers').find( args ).limit(limit).skip(skip);
			reply(result.toArray());

		}
	});

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

	server.route({
		method: 'GET',
		path: '/beer/{beerId}/rating',
		handler: function (request, reply) {

			//TODO: Implement endpoint

		}
	});

	server.route({
		method: 'POST',
		path: '/beer/{beerId}/rating',
		handler: function (request, reply) {

			//TODO: Implement endpoint

		}
	});

	server.route({
		method: 'PUT',
		path: '/beer/{beerId}/rating/{ratingId}',
		handler: function (request, reply) {

			//TODO: Implement endpoint

		}
	});


	next();
};

exports.register.attributes = {
	name: 'beer-routes'
};
