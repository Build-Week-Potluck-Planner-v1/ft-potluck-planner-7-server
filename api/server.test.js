const request = require('supertest');
const server = require('./server');
const db = require('./data/db-config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
  jwtSecret
} = require('./auth/secret');

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

  it('is the correct jwt secret', () => {
    expect(process.env.JWT_SECRET).toBe('testSecret');
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

      it('Responds with user id and username on good register', async () => {
        const res = await request(server)
              .post('/api/auth/register')
              .send({
                username: 'test',
                password: '1234'
              });
        expect(res.body).toMatchObject({
          id: 5,
          username: 'test'
        });
      });
    });

    describe('[POST] /api/auth/login', () => {

      it('Responds with a 400 and a message on missing password or username', async () => {
        const res = await request(server)
              .post('/api/auth/login')
              .send({});
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Please provide a username and password');
      });

      it('Responds with a 400 and a message on bad typing', async () => {
        const res = await request(server)
              .post('/api/auth/login')
              .send({
                username: 1,
                password: '1234'
              });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Username and password must both be strings');
      });

      it('Responds with a 400 and a message on nonexistent username', async () => {
        const res = await request(server)
              .post('/api/auth/login')
              .send({
                username: 'test8',
                password: '1234'
              });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Username doesn't exist");
      });

      it('Responds with a 400 and a message on invalid credentials', async () => {
        const res = await request(server)
              .post('/api/auth/login')
              .send({
                username: 'test1',
                password: '1235'
              });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Invalid Credentials');
      });

      it('Doesnt effect db', async () => {
        const before = await db('users');

        await request(server)
              .post('/api/auth/login')
              .send({
                username: 'test1',
                password: '1234'
              });

        const after = await db('users');

        expect(before).toMatchObject(after);
      });

      it('Responds with 200 on good login', async () => {
        const res = await request(server)
              .post('/api/auth/login')
              .send({
                username: 'test1',
                password: '1234'
              });
        expect(res.status).toBe(200);
      });

      it('Responds with message and token on good register', async () => {
        const res = await request(server)
              .post('/api/auth/login')
              .send({
                username: 'test1',
                password: '1234'
              });
        const decoded = jwt.decode(res.body.token);
        expect(res.body.message).toBe('Welcome back, test1!');
        expect(decoded).toMatchObject({
          id: 1,
          username: 'test1'
        });
      });
    });

  });

  describe('users', () => {

    describe('[GET] /api/users', () => {}); // for a nicer invite list
    describe('[PUT] /api/users', () => {
    }); // literally just for updating passwords
    describe('[DELETE] /api/users', () => {}); // only a user should be able to delete their own account and maybe an admin

  });

  describe('potlucks', () => {

    describe('[GET] /api/potlucks', () => {}); // for a nicer splash/display screen
    describe('[GET] /api/potlucks/:id', () => {});
    describe('[POST] /api/potlucks', () => {

      it('Responds with a 401 and a message when given no token', async () => {
        const res = await request(server)
              .post('/api/potlucks')
              .send({});
        expect(res.status).toBe(401);
        expect(res.body.message).toBe('No token given');
      });

      it('Responds with a 401 when given bad token', async () => {
        const {body: {token}} = await request(server)
              .post('/api/auth/login')
              .send({
                username: 'test1',
                password: '1234'
              });
        const badToken = token.substring(0,15) + 'a' + token.substring(16);
        const res = await request(server)
              .post('/api/potlucks')
              .set('Authorization', badToken)
              .send({});
        expect(res.status).toBe(401);
        expect(res.body.message).toBe('Bad token given');
      });

      it('Responds with 400 and a message on missing information', async () => {
        const {body: {token}} = await request(server)
              .post('/api/auth/login')
              .send({
                username: 'test1',
                password: '1234'
              });
        const res = await request(server)
              .post('/api/potlucks')
              .set('Authorization', token)
              .send({});
        expect(res.status).toBe(400);
        expect(res.body.message).toBe(
          'Please provide a name, date, time and location for the potluck'
        );
      });

      it('Responds with 400 and a message when data is incorrectly typed', async () => {
        const {body: {token}} = await request(server)
              .post('/api/auth/login')
              .send({
                username: 'test1',
                password: '1234'
              });
        const res = await request(server)
              .post('/api/potlucks')
              .set('Authorization', token)
              .send({
                name: 'big bonanza',
                date: 'next tuesday',
                time: 1,
                location: 'right here'
              });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe(
          'Name and location should be strings, date should be an iso date string');
      });

      it('Adds potluck to db', async () => {
        const bigBonanza = {
          name: 'big bonanza',
          date: 'July 26',
          time: '7pm',
          location: 'right here'
        };
        const {body: {token}} = await request(server)
              .post('/api/auth/login')
              .send({
                username: 'test1',
                password: '1234'
              });
        const res = await request(server)
              .post('/api/potlucks')
              .set('Authorization', token)
              .send(bigBonanza);
        const expected = [
          bigBonanza
        ];
        const actual = await db('potlucks');
        expect(actual).toMatchObject(expected);
      });

      it('Correctly associates potluck with user specified in token', async () => {
        const bigBonanza = {
          name: 'big bonanza',
          date: 'July 26',
          time: '7pm',
          location: 'right here'
        };
        const {body: {token}} = await request(server)
              .post('/api/auth/login')
              .send({
                username: 'test1',
                password: '1234'
              });
        const res = await request(server)
              .post('/api/potlucks')
              .set('Authorization', token)
              .send(bigBonanza);
        const expected = [
          { owner_id: 1 }
        ];
        const actual = await db('potlucks')
              .select('owner_id');
        expect(actual).toMatchObject(expected);
      });

      it('Responds with 201 on good post', async () => {
        const bigBonanza = {
          name: 'big bonanza',
          date: 'July 26',
          time: '7pm',
          location: 'right here'
        };
        const {body: {token}} = await request(server)
              .post('/api/auth/login')
              .send({
                username: 'test1',
                password: '1234'
              });
        const res = await request(server)
              .post('/api/potlucks')
              .set('Authorization', token)
              .send(bigBonanza);
        expect(res.status).toBe(201);
      });

      it.todo('Responds with created potluck on good post');

    });
    describe('[PUT] /api/potlucks/:id', () => {});
    describe('[DELETE] /api/potlucks/:id', () => {});

  });

  describe('invites', () => {

    describe('[GET] /api/invites', () => {});
    describe('[GET] /api/invites/:id', () => {});
    describe('[POST] /api/invites', () => {});
    describe('[PUT] /api/invites/:id', () => {});
    describe('[DELETE] /api/invites/:id', () => {});

  });
});
