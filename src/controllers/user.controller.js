import User from '../models/user.model.js';

export const getUsers = async (req, res, next) => {
	try {
		const { age } = req.query;
		const sortCloud = age ? { age } : {};
		const users = await User.find({}, 'id fullName email age').sort(sortCloud);
		res.status(200).json(users);
	} catch (err) {
		next(err);
	}
};

export const getUserByIdWithArticles = async (req, res, next) => {
	const user = await User.findById(req.params.id).populate({
		path: 'articles',
		select: 'title subtitle createdAt updatedAt',
	});
	res.status(200).json(user);
	try {
	} catch (err) {
		next(err);
	}
};

export const createUser = async (req, res, next) => {
	try {
		const newUser = await User.create(req.body);
		res.status(201).json(newUser);
	} catch (err) {
		next(err);
	}
};

export const updateUserById = async (req, res, next) => {
	try {
		const id = req.params.id;
		const user = await User.findById(id);
		if (user) {
			user.firstName = req.body.firstName || user.firstName;
			user.lastName = req.body.lastName || user.lastName;
			user.age = req.body.age || user.age;
			const updatedUser = await user.save();
			res.json(updatedUser);
		} else {
			return res.status(400).json({ message: 'User not found' });
		}
	} catch (err) {
		next(err);
	}
};

export const deleteUserById = async (req, res, next) => {
	const deletedUser = await User.findByIdAndDelete(req.params.id);
	if (deletedUser) {
		return res.status(204).json();
	}
	res.status(400).json({ message: 'cant find user to delete!' });
	try {
	} catch (err) {
		next(err);
	}
};
