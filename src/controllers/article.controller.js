import Article from '../models/article.model.js';
import User from '../models/user.model.js';
export const getArticles = async (req, res, next) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const pageSize = parseInt(req.query.pageSize) || 10;

		const searchCloud = req.query.title ? { title: { $regex: req.query.title, $options: 'i' } } : {};

		const articles = await Article.find(searchCloud)
			.populate({ path: 'owner', select: 'fullName -_id' })
			.limit(pageSize)
			.skip((page - 1) * pageSize);

		res.json({ page, pageSize, articles });
	} catch (err) {
		next(err);
	}
};

export const getArticleById = async (req, res, next) => {
	try {
		const article = await Article.findById(req.params.id);
		if (!article) res.status(404).json({ message: 'cant find article' });
		else res.status(200).json(article);
	} catch (err) {
		next(err);
	}
};

export const createArticle = async (req, res, next) => {
	try {
		const article = new Article(req.body);

		const user = await User.findById(req.body.owner);
		if (!user) return res.status(404).json({ message: 'Owner not found' });

		const savedArticle = await article.save();
		user.numberOfArticles += 1;
		user.articles.push(savedArticle._id);
		await user.save();
		res.status(201).json(article);
	} catch (err) {
		next(err);
	}
};

export const updateArticleById = async (req, res, next) => {
	try {
		const updatedArticle = await Article.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
		res.json(updatedArticle);
	} catch (err) {
		next(err);
	}
};

export const deleteArticleById = async (req, res, next) => {
	try {
		await Article.findOneAndDelete(req.article._id);
		req.user.numberOfArticles -= 1;
		req.user.save();
		res.status(204).json();
	} catch (err) {
		next(err);
	}
};

export const addLike = async (req, res, next) => {
	try {
		const articleId = req.params.id;
		const userId = req.body.userId;

		const article = await Article.findById(articleId);
		const user = await User.findById(userId);

		if (!article || !user) return res.status(404).json({ message: 'Article or User not found' });

		if (article.likes.includes(userId)) return res.status(400).json({ message: 'User already liked this article' });

		article.likes.push(userId);
		user.likedArticles.push(articleId);

		await Promise.all([article.save(), user.save()]);

		res.status(200).json({ message: 'Article liked successfully' });
	} catch (err) {
		next(create);
	}
};

export const deleteLike = async (req, res, next) => {
	try {
		const articleId = req.params.id;
		const userId = req.body.userId;

		const article = await Article.findById(articleId);
		const user = await User.findById(userId);

		if (!article || !user) return res.status(404).json({ message: 'Article or User not found' });

		if (!article.likes.includes(userId))
			return res.status(400).json({ message: 'User has not liked this article' });

		article.likes = article.likes.filter((id) => id !== userId);
		user.likedArticles = user.likedArticles.filter((id) => id !== articleId);

		await Promise.all([article.save(), user.save()]);

		res.status(200).json({ message: 'Like removed successfully' });
	} catch (err) {
		next(err);
	}
};
