exports.register = function (server, options, next) {

	var Joi = require('joi'),
		db = server.plugins['hapi-mongodb'].db;

	server.route({
		method: 'GET',
		path: '/brewery',
		handler: function (request, reply) {
			var result;

			if(request.query.q.length){
				var regex = new RegExp(".*" + request.query.q.toLowerCase() + ".*");
				result = db.collection('breweries').findOne({"id": regex});
			} else {
				result = db.collection('breweries').find({});
			}

			reply(result.toArray());

		},
		config: {
			tags: ['api'],
			description: 'Get all breweries',
			validate: {
				query: {
					q: Joi.string().min(0).default('')
				}
			}
		}
	});

    server.route({
        method: 'GET',
        path: '/brewery/{breweryId}',
        handler: function (request, reply) {
            console.log('GET breweries: ', request.params, reply);
            db.collection('breweries').find({id: parseInt(request.params.breweryId) }, function(err, result) {
                if (err) return reply(Hapi.error.internal('Internal MongoDB error', err));
                reply(result.toArray());
            });

        },
        config: {
            tags: ['api'],
            description: 'Get a specific brewery',
            validate: {
                params: {
                    breweryId: Joi.number().integer().description('The id of the brewery to retrieve.')
                }
            }
        }
    });

	next();
};

exports.register.attributes = {
	name: 'brewery-routes'
};
