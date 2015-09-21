exports.register = function (server, options, next) {

	var Joi = require('joi'),
		db = server.plugins['hapi-mongodb'].db;

	server.route({
		method: 'GET',
		path: '/beer',
		handler: function (request, reply) {
			var result,
				limit = request.query.limit ? request.query.limit : 10000,
				skip = request.query.skip ? request.query.skip : 0;

			if(request.query.q.length){
				var regex = new RegExp(".*" + request.query.q.toLowerCase() + ".*");
				result = db.collection('beers').find({"_index": regex}).limit(limit).skip(skip);
			} else {
				result = db.collection('beers').find({}).limit(limit).skip(skip);
			}

			reply(result.toArray());

		},
		config: {
			validate: {
				query: {
					q: Joi.string().min(0).default(''),
					limit: Joi.number().integer().default(10000).description('The number of records to return (default=20).'),
					skip: Joi.number().integer().default(0).description('The number of records to skip for pagination purposes (default=0)')
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
