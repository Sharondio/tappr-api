exports.register = function (server, options, next) {

    server.route({
        method: 'GET',
        path: '/',
        handler: function (request, reply) {

            reply({ message: 'Welcome to the Tappr API.' });
        }
    });

    server.route({
        method: 'GET',
        path: '/users',
        handler: function (request, reply) {

            reply([
            	{ firstName: 'Dan', lastName: 'Skaggs' },
            	{ firstName: 'Sharon', lastName: 'DiOrio' }
            ]);
        }
    });


	server.route({
		method: 'GET',
		path: '/beer/{beerId}',
		handler: function (request, reply) {

			var db = request.server.plugins['hapi-mongodb'].db;

			db.collection('beers').find({id: parseInt(request.params.beerId) }, function(err, result) {
				if (err) return reply(Hapi.error.internal('Internal MongoDB error', err));
				reply(result.toArray());
			});

		}
	});


	next();
};


exports.register.attributes = {
    name: 'api'
};
