const request = require('supertest');
const server = require('./server');
const db = require('./data/db-config');
const bcrypt = require('bcryptjs');

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

beforeEach(async () => {
  await db.seed.run();
});

afterAll(async () => {
  await db.destroy();
});

it('sanity check', () => {
  expect(true).not.toBe(false);
});

describe('server.js', () => {
  it('is the correct testing environment', async () => {
    expect(process.env.NODE_ENV).toBe('testing');
  });

  describe('users', () => {

    describe('[POST] /api/auth/register', () => {

      it('Responds with a 400 and a message on missing password or username', async () => {
        const res = await request(server)
              .post('/api/auth/register')
              .send({});
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Please provide a username and password');
      });

      it('Responds with a 400 and a message on bad typing', async () => {
        const res = await request(server)
              .post('/api/auth/register')
              .send({
                username: 1,
                password: '1234'
              });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Username and password must both be strings');
      });

      it('Responds with a 400 and a message on existing username', async () => {
        const res = await request(server)
              .post('/api/auth/register')
              .send({
                username: 'test1',
                password: '1234'
              });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Username already exists');
      });

      it('Adds a new user to the system', async () => {
        await request(server)
              .post('/api/auth/register')
              .send({
                username: 'test',
                password: '1234'
              });
        const added = await db('users')
              .where({
                username: 'test'
              })
              .first();
        expect(added).toMatchObject({
          username: 'test',
        });
      });

      it('Hashes the password before saving', async () => {
        await request(server)
          .post('/api/auth/register')
          .send({
            username: 'test',
            password: '1234'
          });
        const { password } = await db('users')
              .where({id: 5})
              .first();
        expect(bcrypt.compareSync('1234', password)).toBe(true);
      });

      it('Responds with 201 on good register', async () => {
        const res = await request(server)
              .post('/api/auth/register')
              .send({
                username: 'test',
                password: '1234'
              });
        expect(res.status).toBe(201);
      });

      it.todo('Responds with user id and username on good register');
    });

  });
});
