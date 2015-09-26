exports.register = function (server, options, next) {

	var Joi = require('joi'),
		db = server.plugins['hapi-mongodb'].db;

	server.route({
		method: 'GET',
		path: '/beer',
		handler: function (request, reply) {
			var result;

			if (request.query.q.length) {
				var regex = new RegExp(".*" + request.query.q.toLowerCase() + ".*");
				result = db.collection('beers').find({"_index": regex});
			} else if( request.query.brewery.length ) {
				var regex = new RegExp(".*" + request.query.brewery.toLowerCase() + ".*", "i");
				result = db.collection('beers').find({"brewery": regex});
			} else {
				result = db.collection('beers').find({});
			}

			reply(result.toArray());

		},
		config: {
			tags: ['api'],
			description: 'Get all beers',
			validate: {
				query: {
					q: Joi.string().min(0).default(''),
					brewery: Joi.string().min(0).default('')
				}
			}
		}
	});

	server.route({
		method: 'GET',
		path: '/beer/{beerId}',
		handler: function (request, reply) {
            console.log('GET beers: ', request.params, reply);
			db.collection('beers').find({id: parseInt(request.params.beerId) }, function(err, result) {
				if (err) return reply(Hapi.error.internal('Internal MongoDB error', err));
				reply(result.toArray());
			});

		},
		config: {
			tags: ['api'],
			description: 'Get a specific beer',
			validate: {
				params: {
					beerId: Joi.number().integer().description('The id of the beer to retrieve.')
				}
			}
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
