exports.register = function (server, options, next) {

	var db = server.plugins['hapi-mongodb'].db;

	server.route({
		method: 'GET',
		path: '/user',
		handler: function (request, reply) {
			var args = {};
			var limit = request.query.limit || 20;
			limit = parseInt( limit );

			//TODO: Implement endpoint

		}
	});

	server.route({
		method: 'POST',
		path: '/user',
		handler: function (request, reply) {

			//TODO: Implement endpoint

		}
	});

	server.route({
		method: 'GET',
		path: '/user/{userId}',
		handler: function (request, reply) {

			//TODO: Implement endpoint

		}
	});

	server.route({
		method: 'GET',
		path: '/user/{userId}/favorite',
		handler: function (request, reply) {

			//TODO: Implement endpoint

		}
	});

	server.route({
		method: 'POST',
		path: '/user/{userId}/favorite',
		handler: function (request, reply) {

			//TODO: Implement endpoint

		}
	});

	server.route({
		method: 'DELETE',
		path: '/user/{userId}/favorite/{favoriteId}',
		handler: function (request, reply) {

			//TODO: Implement endpoint

		}
	});

	next();
};

exports.register.attributes = {
	name: 'user-routes'
};
