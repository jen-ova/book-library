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
					name: 'Rei Ayanami',
					email: 'eva_unit00_pilot@gmail.com',
					password: '12345678',
				});
				const newReaderRecord = await Reader.findByPk(response.body.id, {
					raw: true,
				});

				expect(response.status).to.equal(201);
				expect(response.body.name).to.equal('Rei Ayanami');
				expect(newReaderRecord.name).to.equal('Rei Ayanami');
				expect(newReaderRecord.email).to.equal('eva_unit00_pilot@gmail.com');
				expect(newReaderRecord.password).to.equal('12345678');
			});
			it('returns an error if a field is empty', async () => {
				const response = await request(app).post('/readers').send({
					name: 'Rei Ayanami',
					email: 'eva_unit00_pilot@gmail.com',
				});

				expect(response.status).to.equal(400);
				expect(response.body.error).to.equal(
					'Please ensure all fields are completed.'
				);
			});
			it('returns an error if the password is not the correct length', async () => {
				const response = await request(app).post('/readers').send({
					name: 'Rei Ayanami',
					email: 'eva_unit00_pilot@gmail.com',
					password: '123',
				});

				expect(response.status).to.equal(422);
				expect(response.body.error).to.equal(
					'Please enter a password between 8 - 16 characters long.'
				);
			});
		});
	});

	describe('with records in the database', () => {
		let readers;

		beforeEach(async () => {
			readers = await Promise.all([
				Reader.create({
					name: 'Rei Ayanami',
					email: 'rei_ayanami00@evapilot.com',
					password: '00000000',
				}),
				Reader.create({
					name: 'Shinji Ikari',
					email: 'shinji_ikari01@evapilot.com',
					password: '01010101',
				}),
				Reader.create({
					name: 'Asuka Langley-Soryuu',
					email: 'asuka_langley_soryuu02@evapilot.com',
					password: '02020202',
				}),
			]);
		});

		describe('POST /readers', () => {
			it('returns an error if the email address already exists', async () => {
				const response = await request(app).post('/readers').send({
					name: 'Rei Ayanami',
					email: 'rei_ayanami00@evapilot.com',
					password: '00000000',
				});

				expect(response.status).to.equal(409);
				expect(response.body.error).to.equal(
					'User with email rei_ayanami00@evapilot.com already exists.'
				);
			});
		});

		describe('GET /readers', () => {
			it('gets all readers records', async () => {
				const response = await request(app).get('/readers');

				expect(response.status).to.equal(200);
				expect(response.body.length).to.equal(3);

				response.body.forEach((reader) => {
					const expected = readers.find((a) => a.id === reader.id);

					expect(reader.name).to.equal(expected.name);
					expect(reader.email).to.equal(expected.email);
				});
			});
		});

		describe('GET /readers/:id', () => {
			it('gets readers record by id', async () => {
				const reader = readers[0];
				const response = await request(app).get(`/readers/${reader.id}`);

				expect(response.status).to.equal(200);
				expect(response.body.name).to.equal(reader.name);
				expect(response.body.email).to.equal(reader.email);
			});

			it('returns a 404 if the reader does not exist', async () => {
				const response = await request(app).get('/readers/12345');

				expect(response.status).to.equal(404);
				expect(response.body.error).to.equal('The reader could not be found.');
			});
		});

		describe('PATCH /readers/:id', () => {
			it('updates readers email by id', async () => {
				const reader = readers[0];
				const response = await request(app)
					.patch(`/readers/${reader.id}`)
					.send({ email: 'firstchild@evapilot.com' });
				const updatedReaderRecord = await Reader.findByPk(reader.id, {
					raw: true,
				});

				expect(response.status).to.equal(200);
				expect(updatedReaderRecord.email).to.equal('firstchild@evapilot.com');
			});

			it('returns a 404 if the reader does not exist', async () => {
				const response = await request(app)
					.patch('/readers/12345')
					.send({ email: 'nthchild@evapilot.com' });

				expect(response.status).to.equal(404);
				expect(response.body.error).to.equal('The reader could not be found.');
			});
		});

		describe('DELETE /readers/:id', () => {
			it('deletes reader record by id', async () => {
				const reader = readers[0];
				const response = await request(app).delete(`/readers/${reader.id}`);
				const deletedReader = await Reader.findByPk(reader.id, { raw: true });

				expect(response.status).to.equal(204);
				expect(deletedReader).to.equal(null);
			});

			it('returns a 404 if the reader does not exist', async () => {
				const response = await request(app).delete('/readers/12345');
				expect(response.status).to.equal(404);
				expect(response.body.error).to.equal('The reader could not be found.');
			});
		});
	});
});
