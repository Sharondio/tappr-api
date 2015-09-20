//TODO: figure out how to sort this stuff

exports.register = function (server, options, next) {

	var db = server.plugins['hapi-mongodb'].db;

	server.route({
		method: 'GET',
		path: '/category',
		handler: function (request, reply) {
			var args = {
                'sortValue': 'cat_name'
            };
            var results = db.collection('categories').distinct('cat_name');
            reply(results);
		}
	});

	next();
};

exports.register.attributes = {
	name: 'category-routes'
};
