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
      it.todo('Responds with a 400 and a message on missing password or username');
      it.todo('Responds with a 400 and a message on bad typing');
      it.todo('Responds with a 400 and a message on existing username');
      it.todo('Adds a new user to the system');
      it.todo('Responds with 201 on good register');
      it.todo('Responds with user id and username on good register');
    });

  });
});
