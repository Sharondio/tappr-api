exports.register = function (server, options, next) {

	var _ = require('lodash');
	var db = server.plugins['hapi-mongodb'].db;

	server.route({
		method: 'GET',
		path: '/user',
		handler: function (request, reply) {
			var args = {};
			var limit = request.query.limit || 20;
			var skip = request.query.skip || 0;
			limit = parseInt( limit );
			skip = parseInt( skip );

			var result = db.collection('users').find( args ).limit(limit).skip(skip);
			reply(result.toArray());

		}
	});

	server.route({
		method: 'POST',
		path: '/user',
		handler: function (request, reply) {

			if(_.isNull( request.payload.username ) ){
				reply('Missing username').code(400);
			} else {
				//Look up requested username to see if it already exists
				var existingUser = db.collection('users').findOne({username: request.payload.username });

				if(existingUser._id){
					reply('Duplicate username').code(400);
				} else {

					db.collection('users').insert({'username': request.payload.username, 'favorites': [], 'ratings': []}, function(err, result) {
						if (err) return reply(Hapi.error.internal('Internal MongoDB error', err));
						reply().code(201);
					});

				}
			}
		}
	});

	server.route({
		method: 'GET',
		path: '/user/{username}',
		handler: function (request, reply) {

			db.collection('users').findOne({username: request.params.username }, {'username': 1}, function(err, result) {
				if (err) return reply(Hapi.error.internal('Internal MongoDB error', err)).code(500);

				var response;

				if( !result._id ){
					response = reply('Not Found').code(404);
				} else {
					response = reply(result).code(200).type('application/json').header('Location', '/user/' + result.username);
				}

				return response;
			});
		}
	});

	server.route({
		method: 'GET',
		path: '/user/{userId}/favorite',
		handler: function (request, reply) {

			db.collection('users').findOne({username: request.params.username }, {'favorites': 1}, function(err, result) {
				if (err) return reply(Hapi.error.internal('Internal MongoDB error', err)).code(500);

				var response,
					favorites;

				if( !result._id ){
					response = reply('Not Found').code(404);
				} else {
					favorites = result.favorites || [];
					response = reply(favorites).code(200).type('application/json').header('Location', '/user/' + result.username + '/favorite');
				}

				return response;
			});

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

	server.route({
		method: 'GET',
		path: '/user/{userId}/rating',
		handler: function (request, reply) {

			db.collection('users').findOne({username: request.params.username }, {'ratings': 1}, function(err, result) {
				if (err) return reply(Hapi.error.internal('Internal MongoDB error', err)).code(500);

				var response,
					ratings;

				if( !result._id ){
					response = reply('Not Found').code(404);
				} else {
					ratings = result.ratings || [];
					response = reply(ratings).code(200).type('application/json').header('Location', '/user/' + result.username + '/rating');
				}

				return response;
			});

		}
	});

	server.route({
		method: 'POST',
		path: '/user/{userId}/rating',
		handler: function (request, reply) {

			//First check to see if beerId and rating are present and valid in request payload
			if( !request.payload.beerId || !request.payload.rating || parseInt(request.payload.beerId)===NaN || parseInt(request.payload.rating)===NaN){
				return reply("Bad request").code(400);
			}

			//Get the current list of ratings for the requested user
			db.collection('users').findOne({username: request.params.username }, {'ratings': 1}, function(err, user) {
				if (err) return reply(Hapi.error.internal('Internal MongoDB error', err)).code(500);

				var response,
					ratings;

				if( !user._id ){
					response = reply('Not Found').code(404);
				} else {
					ratings = user.ratings || [];

					var existingRating = _.find(ratings, { 'beerId': parseInt(request.payload.beerId)});

					if( existingRating ){
						existingRating.rating = parseInt(request.payload.rating);
						existingRating.updated = new Date();

					} else {
						ratings.push({
							'beerId': parseInt(request.payload.beerId),
							'rating': parseInt(request.payload.rating),
							'added': new Date(),
							'updated': new Date()
						});
					}

					db.collection('users').update({'_id': user._id}, {$set: {'ratings': ratings}});
					response = reply().code(201).type('application/json');
				}

				return response;
			});

		}
	});

	next();
};

exports.register.attributes = {
	name: 'user-routes'
};
