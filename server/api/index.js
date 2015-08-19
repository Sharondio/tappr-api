var Hoek = require('hoek');


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


    next();
};


exports.register.attributes = {
    name: 'api'
};
