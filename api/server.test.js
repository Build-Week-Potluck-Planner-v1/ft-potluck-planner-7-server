const request = require('supertest');
const server = require('./server');
const db = require('./data/db-config');

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
        const users = await db('users');
        console.log(users);
      });

      it.todo('Adds a new user to the system');
      it.todo('Responds with 201 on good register');
      it.todo('Responds with user id and username on good register');
    });

  });
});
