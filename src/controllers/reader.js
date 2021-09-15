const { Reader } = require('../models');

exports.create = async (req, res) => {
	const checkName = req.body.name;
	const checkEmail = req.body.email;
	const checkPassword = req.body.password;

	if (checkName == null || checkEmail == null || checkPassword == null) {
		return res
			.status(400)
			.send({ error: 'Please ensure all fields are completed.' });
	}

	const checkExisting = await Reader.findAll({
		where: {
			email: req.body.email,
		},
	});

	if (checkExisting[0]) {
		return res
			.status(409)
			.send({ error: `User with email ${req.body.email} already exists.` });
	}

	if (checkPassword.length < 8 || checkPassword.length > 16) {
		return res.status(422).send({
			error: 'Please enter a password between 8 - 16 characters long.',
		});
	}

	const newReader = await Reader.create(req.body);
	res.status(201).json(newReader);
};

exports.findAll = async (req, res) => {
	const readers = await Reader.findAll();
	res.status(200).json(readers);
};

exports.findByPk = async (req, res) => {
	const thisReader = await Reader.findByPk(req.params.id);
	if (!thisReader) {
		return res.status(404).send({ error: 'The reader could not be found.' });
	}
	res.status(200).json(thisReader);
};

exports.update = async (req, res) => {
	const thisReader = await Reader.findByPk(req.params.id);
	if (!thisReader) {
		return res.status(404).send({ error: 'The reader could not be found.' });
	}
	await Reader.update(req.body, { where: { id: req.params.id } });
	res.status(200).json(thisReader);
};

exports.delete = async (req, res) => {
	const thisReader = await Reader.findByPk(req.params.id);
	if (!thisReader) {
		return res.status(404).send({ error: 'The reader could not be found.' });
	}
	await Reader.destroy({ where: { id: req.params.id } });
	res.status(204).json(thisReader);
};
