exports.register = function (server, options, next) {

	var _ = require('lodash'),
		Joi = require('joi'),
		db = server.plugins['hapi-mongodb'].db;

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

            var existingUser;

			//Look up requested username to see if it already exists
			db.collection('users').findOne({username: request.payload.username }, function (err, data) {
                existingUser = data;
                console.log('USER: ', data);

                if (existingUser){
                    reply('Duplicate userName').code(400);
                } else {

                    db.collection('users').insert({'username': request.payload.username, 'favorites': [], 'ratings': []}, function(err, result) {
                        if (err) return reply(Hapi.error.internal('Internal MongoDB error creating the user', err));
                        reply().code(201);
                    });

                }

            });
		},
		config: {
			validate: {
				payload: {
					username: Joi.string().min(1).description('The name of the beer to login/create.')
				}
			}
		}
	});

	server.route({
		method: 'GET',
		path: '/user/{userName}',
		handler: function (request, reply) {

			db.collection('users').findOne({username: request.params.userName }, function(err, result) {
				if (err) return reply(Hapi.error.internal('Internal MongoDB error', err)).code(500);

				var response;

				if( !result ){
					response = reply('Not Found').code(404);
				} else {
					response = reply(result).code(200).type('application/json').header('Location', '/user/' + result.userName);
				}

				return response;
			});
		}
	});

	server.route({
		method: 'GET',
		path: '/user/{userName}/favorite/beer',
		handler: function (request, reply) {

			db.collection('users').findOne({username: request.params.userName }, {'favorites': 1}, function(err, result) {
				if (err) return reply(Hapi.error.internal('Internal MongoDB error', err)).code(500);

				var response,
					favorites;

				if( !result._id ){
					response = reply('Not Found').code(404);
				} else {
					favorites = result.favorites || [];
					response = reply(favorites).code(200).type('application/json').header('Location', '/user/' + result.userName + '/favorite');
				}

				return response;
			});

		},
		config: {
			validate: {
				params: {
					userName: Joi.string().min(1).description('The userName to retrieve favorites for.')
				}
			}
		}
	});

	server.route({
		method: 'POST',
		path: '/user/{userName}/favorite/beer',
		handler: function (request, reply) {

			//Load the specified user's list of favorites
			db.collection('users').findOne({'username': request.params.userName }, function(err, result){
				if (err) return reply(Hapi.error.internal('Internal MongoDB error finding favorites', err)).code(500);

				var favorites = result.favorites;

				if(_.findIndex(favorites, function(favorite){ return request.payload.id === favorite.id }) > -1){
					//We've found the beer already in the favorite list, return an error
					return reply('Duplicate favorite found').code(400);
				} else {
					//No duplicates found, let's add it
					favorites.push({
                        name: request.payload.name,
                        id: request.payload.id,
                        'added': new Date()
                    });
					db.collection('users').update(
						{'_id': result._id },
						{$set:
							{favorites: favorites}
						},
						function(err, result){
							if (err) return reply(Hapi.error.internal('Internal MongoDB error adding favorite', err)).code(500);
								return reply('Created').code(201);
							}
					);
				}
			});

		},
		config: {
			validate: {
				params: {
					userName: Joi.string().min(1).description('The userName to add a favorite to.')
				},
				payload: {
					name: Joi.string().min(1).description('The name of the beer to favorite.'),
					id: Joi.number().integer().description('The id of the beer to favorite')
				}
			}
		}
	});

	server.route({
		method: 'GET',
		path: '/user/{userName}/favorite/beer/{beerId}',
		handler: function (request, reply) {

			//Load the specified user's list of favorites
			db.collection('users').findOne({'username': request.params.userName }, {'favorites':1}, function(err, result){
				if (err) return reply(Hapi.error.internal('Internal MongoDB error finding favorites', err)).code(500);

				var favorites = result.favorites,
					favIndex = _.findIndex(favorites, function(favorite){ return request.params.beerId === favorite.id });

				if( favIndex === -1){
					//We didn't find the favorite beer that was requested
					return reply('Not Found').code(404);
				} else {
					//We found the requested favorite, return it
					return reply(favorites[ favIndex ]).code(200);
				}
			})
		},
		config: {
			validate: {
				params: {
					userName: Joi.string().min(1).description('The userName to search favorites for.'),
					beerId: Joi.number().integer().description('The id of the beer to search user favorites for.')
				}
			}
		}
	});

	server.route({
		method: 'DELETE',
		path: '/user/{userName}/favorite/beer/{beerId}',
		handler: function (request, reply) {

			//Load the specified user's list of favorites
			db.collection('users').findOne({'username': request.params.userName }, {'favorites':1}, function(err, result){
				if (err) return reply(Hapi.error.internal('Internal MongoDB error finding favorites', err)).code(500);

				var favorites = result.favorites,
					favIndex = _.findIndex(favorites, function(favorite){ return request.params.beerId === favorite.id });

				if( favIndex > -1){
					//We've found the beer that has been requested to be removed
					_.remove(favorites, function (favorite) {
						return request.params.beerId === favorite.id
					});

					db.collection('users').update(
						{'_id': result._id },
						{$set:
							{favorites: favorites}
						},
						function(err, result){
							if (err) return reply(Hapi.error.internal('Internal MongoDB error deleting favorite', err)).code(500);
							return reply('Success').code(200);
						}
					)

				} else {
					//We didn't find the beer that was requested to be removed so give a 404 response
					return reply('No favorite found with specified beerId').code(404);
				}
			})


		},
		config: {
			validate: {
				params: {
					userName: Joi.string().min(1).description('The userName to remove the favorite from.'),
					beerId: Joi.number().integer().description('The ID of the beer to remove from favorites.')
				}
			}
		}
	});

	server.route({
		method: 'GET',
		path: '/user/{userName}/rating/beer',
		handler: function (request, reply) {

			db.collection('users').findOne({username: request.params.userName }, {'ratings': 1}, function(err, result) {
				if (err) return reply(Hapi.error.internal('Internal MongoDB error', err)).code(500);

				var response,
					ratings;

				if( !result._id ){
					response = reply('Not Found').code(404);
				} else {
					ratings = result.ratings || [];
					response = reply(ratings).code(200).type('application/json').header('Location', '/user/' + result.userName + '/rating');
				}

				return response;
			});

		}
	});

	server.route({
		method: 'POST',
		path: '/user/{userName}/rating/beer',
		handler: function (request, reply) {

			//Get the current list of ratings for the requested user
			db.collection('users').findOne({username: request.params.userName }, {'ratings': 1}, function(err, user) {
				if (err) return reply(Hapi.error.internal('Internal MongoDB error', err)).code(500);

				var response,
					ratings;

				if( !user._id ){
					response = reply('Not Found').code(404);
				} else {
					ratings = user.ratings || [];

					var existingRating = _.find(ratings, function(rating){ return request.payload.id === rating.id });

					if( existingRating ){
						existingRating.rating = request.payload.rating;
						existingRating.updated = new Date();

					} else {
						ratings.push({
							'id': request.payload.id,
							'name': request.payload.name,
							'rating': request.payload.rating,
							'added': new Date(),
							'updated': new Date()
						});

					}

					db.collection('users').update({'_id': user._id}, {$set: {'ratings': ratings}});
					response = reply().code(200).type('application/json');
				}

				return response;
			});

		},
		config: {
			validate: {
				params: {
					userName: Joi.string().min(1).description('The userName for the user adding a rating.')
				},
				payload: {
					id: Joi.number().integer().description('The ID of the beer being rated'),
					name: Joi.string().min(1).description('The name of the beer being rated'),
					rating: Joi.number().integer().description('The rating given to the specified beer')
				}
			}
		}
	});

	server.route({
		method: 'GET',
		path: '/user/{userName}/rating/beer/{beerId}',
		handler: function (request, reply) {

			//Load the specified user's list of favorites
			db.collection('users').findOne({'username': request.params.userName }, {'ratings':1}, function(err, result){
				if (err) return reply(Hapi.error.internal('Internal MongoDB error finding ratings', err)).code(500);

				var ratings = result.ratings,
					favIndex = _.findIndex(ratings, function(rating){ return request.params.beerId === rating.id });

				if( favIndex === -1){
					//We didn't find the favorite beer that was requested
					return reply('Not Found').code(404);
				} else {
					//We found the requested favorite, return it
					return reply(ratings[ favIndex ]).code(200);
				}
			})
		},
		config: {
			validate: {
				params: {
					userName: Joi.string().min(1).description('The userName to search favorites for.'),
					beerId: Joi.number().integer().description('The id of the beer to search user favorites for.')
				}
			}
		}
	});

	server.route({
		method: 'DELETE',
		path: '/user/{userName}/rating/beer/{beerId}',
		handler: function (request, reply) {

			//Load the specified user's list of favorites
			db.collection('users').findOne({'username': request.params.userName }, {'ratings':1}, function(err, result){
				if (err) return reply(Hapi.error.internal('Internal MongoDB error finding favorites', err)).code(500);

				var ratings = result.ratings,
					ratingIndex = _.findIndex(ratings,
											  function(rating){
												  return rating.id == request.params.beerId
											  });

				if( ratingIndex > -1){
					//We've found the beer that has been requested to be removed
					_.remove(ratings, function (rating) {
						return rating.id == request.params.beerId
					});

					db.collection('users').update(
						{'_id': result._id },
						{$set:
							{ratings: ratings}
						},
						function(err, result){
							if (err) return reply(Hapi.error.internal('Internal MongoDB error deleting rating', err)).code(500);
							return reply('Success').code(200);
						}
					)

				} else {
					//We didn't find the beer that was requested to be removed so give a 404 response
					return reply('No rating found for that beer').code(404);
				}
			})


		},
		config: {
			validate: {
				params: {
					userName: Joi.string().min(1).description('The userName to remove the ratig from.'),
					beerId: Joi.number().integer().description('The ID of the beer to remove from ratings.')
				}
			}
		}
	});

	next();
};

exports.register.attributes = {
	name: 'user-routes'
};
