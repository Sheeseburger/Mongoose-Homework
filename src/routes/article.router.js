import { Router } from 'express';
import {
	createArticle,
	updateArticleById,
	deleteArticleById,
	getArticles,
	getArticleById,
	addLike,
	deleteLike,
} from '../controllers/article.controller.js';
import authorized from '../middleware/auth.middlware.js';
const articleRouter = Router();

articleRouter
	.get('/', getArticles)
	.get('/:id', getArticleById)
	.post('/', createArticle)
	.put('/:id', authorized, updateArticleById)
	.delete('/:id', authorized, deleteArticleById);

articleRouter.route('/:id/like').post(addLike).delete(deleteLike);

export default articleRouter;
