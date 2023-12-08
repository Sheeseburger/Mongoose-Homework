import User from './../models/user.model.js';
import Article from './../models/article.model.js';
import createError from 'http-errors';

export default async function authorized(req, res, next) {
	try {
		// console.log('!!!!!!!!!!!!!!!!!!!!!!!!');
		const article = await Article.findById(req.params.id);
		if (!article) {
			next(createError(400, 'Bad request: Cant find article :('));
		}
		const user = await User.findById(req.body.owner);
		if (req.body.owner !== String(article.owner._id)) {
			next(createError(403, 'Not authorized: only owner can manipulate article :('));
		}
		req.article = article;
		req.user = user;
		// console.log('123');
	} catch (e) {
		next(createError(500, 'Something went wrong!'));
	}

	next();
}
