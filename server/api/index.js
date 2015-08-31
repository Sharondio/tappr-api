


exports.register = function (server, options, next) {

    server.route({
        method: 'GET',
        path: '/',
        handler: function (request, reply) {

            reply({ message: 'Welcome to the plot device.' });
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

			db.collection("beers").findOne({"id": request.params.beerId}, function(err, beer) {
				reply( beer );
			});

        }
    });


    next();
};


exports.register.attributes = {
    name: 'api'
};
