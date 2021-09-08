const { expect } = require('chai');
const request = require('supertest');
const { Reader } = require('../src/models');
const app = require('../src/app');

describe('/readers', () => {
	before(async () => Reader.sequelize.sync());

	beforeEach(async () => {
		await Reader.destroy({ where: {} });
	});

	describe('with no records in the database', () => {
		describe('POST /readers', () => {
			it('creates a new reader in the database', async () => {
				const response = await request(app).post('/readers').send({
					name: 'Asuka Langley-Soryuu',
					email: 'eva-unit02-pilot@gmail.com',
				});

				const newReaderRecord = await Reader.findByPk(response.body.id, {
					raw: true,
				});

				expect(response.body.name).to.equal('Asuka Langley-Soryuu');
				expect(newReaderRecord.name).to.equal('Asuka Langley-Soryuu');
				expect(newReaderRecord.email).to.equal('eva-unit02-pilot@gmail.com');

				expect(response.status).to.equal(201);
			});
		});
	});
});
