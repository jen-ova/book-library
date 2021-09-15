const { book, Book } = require('../models');

exports.create = async (req, res) => {
	const newBook = await Book.create(req.body);
	res.status(201).json(newBook);
};

exports.findAll = async (req, res) => {
	const books = await Book.findAll();
	res.status(200).json(books);
};

exports.findByPk = async (req, res) => {
	const thisBook = await Book.findByPk(req.params.id);
	if (!thisBook) {
		return res.status(404).send({ error: 'The book could not be found.' });
	}
	res.status(200).json(thisBook);
};

exports.update = async (req, res) => {
	const thisBook = await Book.findByPk(req.params.id);
	if (!thisBook) {
		return res.status(404).send({ error: 'The book could not be found.' });
	}
	await Book.update(req.body, { where: { id: req.params.id } });
	res.status(200).json(thisBook);
};

exports.delete = async (req, res) => {
	const thisBook = await Book.findByPk(req.params.id);
	if (!thisBook) {
		return res.status(404).send({ error: 'The book could not be found.' });
	}
	await Book.destroy({ where: { id: req.params.id } });
	res.status(204).json(thisBook);
};
