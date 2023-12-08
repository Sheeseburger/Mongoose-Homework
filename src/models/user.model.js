import mongoose from 'mongoose';
import isEmail from 'validator/lib/isEmail.js';
const userSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: true,
		minlength: 4,
		maxlength: 50,
		trim: true,
	},
	lastName: {
		type: String,
		required: true,
		minlength: 3,
		maxlength: 60,
		trim: true,
	},
	fullName: String,
	email: {
		type: String,
		required: true,
		lowercase: true,
		validate: [isEmail, 'invalid email'],
	},
	role: {
		type: String,
		enum: ['admin', 'writer', 'guest'],
	},
	age: {
		type: Number,
		// min: 1,
		// max: 99,
	},
	numberOfArticles: {
		type: Number,
		default: 0,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
	articles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }],
	likedArticles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }],
});

userSchema.pre('save', function (next) {
	this.fullName = `${this.firstName} ${this.lastName}`;
	next();
});

userSchema.pre(['save', 'update'], function (next) {
	this.updatedAt = new Date();
	next();
});
userSchema.pre('save', function (next) {
	// console.log('hello!');
	if (this.age && this.age > 99) {
		this.age = 99;
	} else if (this.age <= 0 || !this.age) {
		this.age = 1;
	}

	next();
});
const User = mongoose.model('User', userSchema);

export default User;
