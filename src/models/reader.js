module.exports = (connection, DataTypes) => {
	const schema = {
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: {
					args: true,
					msg: 'Please enter a name',
				},
			},
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				notEmpty: {
					args: true,
					msg: 'Please enter a valid email',
				},
				isEmail: {
					args: true,
					msg: 'Please enter a valid email',
				},
			},
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: {
					args: true,
					msg: 'Please enter a valid password',
				},
				len: {
					args: [8, 16],
					msg: 'Please enter a password between 8 - 16 characters long',
				},
			},
		},
	};

	const ReaderModel = connection.define('Reader', schema);
	return ReaderModel;
};
