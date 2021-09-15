module.exports = (connection, DataTypes) => {
	const schema = {
		title: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: {
					args: true,
					msg: 'Please enter a title',
				},
			},
		},
		author: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: {
					args: true,
					msg: 'Please enter a title',
				},
			},
		},
		genre: DataTypes.STRING,
		ISBN: DataTypes.STRING,
	};

	const BookModel = connection.define('Book', schema);
	return BookModel;
};
