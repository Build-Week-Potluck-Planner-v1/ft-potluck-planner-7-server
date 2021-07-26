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

    describe('[GET] /api/potlucks', () => {

      it('Responds with a 401 and a message when given no token', async () => {
        const res = await request(server)
              .get('/api/potlucks');
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
              .get('/api/potlucks')
              .set('Authorization', badToken);
        expect(res.status).toBe(401);
        expect(res.body.message).toBe('Bad token given');
      });

      it.todo('Doesnt effect db');

      it('Responds with 200 on good get', async () => {
        const {body: {token}} = await request(server)
              .post('/api/auth/login')
              .send({
                username: 'test1',
                password: '1234'
              });
        const res = await request(server)
              .get('/api/potlucks')
              .set('Authorization', token);
        expect(res.status).toBe(200);
      });

      it('Responds with users potlucks on good get', async () => {
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
        await request(server)
          .post('/api/potlucks')
          .set('Authorization', token)
          .send(bigBonanza);
        const res = await request(server)
              .get('/api/potlucks')
              .set('Authorization', token);
        expect(res.body).toMatchObject([{
          ...bigBonanza,
          id: 1,
          owner_id: 1
        }]);
      });

      it('Doesnt show other users potlucks', async () => {
        {
          const bigBonanza = {
            name: 'big bonanza',
            date: 'July 26',
            time: '7pm',
            location: 'right here'
          };
          const {body: {token}} = await request(server)
              .post('/api/auth/login')
              .send({
                username: 'test2',
                password: '1234'
              });
          await request(server)
            .post('/api/potlucks')
            .set('Authorization', token)
            .send(bigBonanza);
        } // setup block keeps token in block scope

        const {body: {token}} = await request(server)
          .post('/api/auth/login')
          .send({
            username: 'test1',
            password: '1234'
          });
        const res = await request(server)
              .get('/api/potlucks')
              .set('Authorization', token);
        expect(res.body).toMatchObject([]);
      });

    }); // for a nicer splash/display screen

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
          'name, date, time and location should all be strings');
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

      it('Responds with created potluck on good post', async () => {
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
        expect(res.body).toMatchObject({
          ...bigBonanza,
          id: 1,
          owner_id: 1
        });
      });

    });

    describe('[PUT] /api/potlucks/:id', () => {

      it('Responds with a 401 and a message when given no token', async () => {
        const res = await request(server)
              .put('/api/potlucks/1')
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
              .put('/api/potlucks/1')
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
              .put('/api/potlucks/1')
              .set('Authorization', token)
              .send({});
        expect(res.status).toBe(400);
        expect(res.body.message).toBe(
          'Please provide a date, time and location for the potluck'
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
              .put('/api/potlucks/1')
              .set('Authorization', token)
              .send({
                date: 'next tuesday',
                time: 1,
                location: 'right here'
              });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe(
          'date, time and location should all be strings');
      });

      it('only allows owner to update', async () => {
        const bigBonanza = {
          name: 'big bonanza',
          date: 'July 26',
          time: '7pm',
          location: 'right here'
        };
        {
          const {body: {token}} = await request(server)
                .post('/api/auth/login')
                .send({
                  username: 'test1',
                  password: '1234'
                });
          await request(server)
            .post('/api/potlucks')
            .set('Authorization', token)
            .send(bigBonanza);
        }

        const {body: {token}} = await request(server)
              .post('/api/auth/login')
              .send({
                username: 'test2',
                password: '1234'
              });
        const newBonanza = {
          date: 'July 28',
          time: '9am',
          location: 'over there'
        };
        const res = await request(server)
              .put('/api/potlucks/1')
              .set('Authorization', token)
              .send(newBonanza);
        expect(res.status).toBe(401);
        expect(res.body.message).toBe('Only the owner of the potluck is allowed to update it');
      });

      it('only allows existing potlucks to be updated', async () => {
        const {body: {token}} = await request(server)
              .post('/api/auth/login')
              .send({
                username: 'test1',
                password: '1234'
              });
        const res = await request(server)
              .put('/api/potlucks/1')
              .set('Authorization', token)
              .send({
                date: 'next tuesday',
                time: '1pm',
                location: 'right here'
              });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe(
          'Potluck with given id does not exist');
      });

      it('Updates potluck in db', async () => {
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
        await request(server)
          .post('/api/potlucks')
          .set('Authorization', token)
          .send(bigBonanza);

        const newBonanza = {
          date: 'July 28',
          time: '9am',
          location: 'over there'
        };
        await request(server)
          .put('/api/potlucks/1')
          .set('Authorization', token)
          .send(newBonanza);
        const expected = [
          {...bigBonanza, ...newBonanza}
        ];
        const actual = await db('potlucks');
        expect(actual).toMatchObject(expected);
      });

      it('Responds with 200 on good post', async () => {
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
        await request(server)
          .post('/api/potlucks')
          .set('Authorization', token)
          .send(bigBonanza);
        const newBonanza = {
          date: 'July 28',
          time: '9am',
          location: 'over there'
        };
        const res = await request(server)
              .put('/api/potlucks/1')
              .set('Authorization', token)
              .send(newBonanza);
        expect(res.status).toBe(200);
      });

      it('Responds with created potluck on good post', async () => {
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
        await request(server)
          .post('/api/potlucks')
          .set('Authorization', token)
          .send(bigBonanza);
        const newBonanza = {
          date: 'July 28',
          time: '9am',
          location: 'over there'
        };
        const res = await request(server)
              .put('/api/potlucks/1')
              .set('Authorization', token)
              .send(newBonanza);
        expect(res.body).toMatchObject({
          ...bigBonanza,
          ...newBonanza,
          id: 1,
          owner_id: 1
        });
      });

    });

    describe('[DELETE] /api/potlucks/:id', () => {});

  });

  describe('invites', () => {

    describe('[GET] /api/invites', () => {

      it('Responds with a 401 and a message when given no token', async () => {
        const res = await request(server)
              .get('/api/invites');
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
              .get('/api/invites')
              .set('Authorization', badToken);
        expect(res.status).toBe(401);
        expect(res.body.message).toBe('Bad token given');
      });

      it.todo('Doesnt effect db');

      it('Responds with 200 on good get', async () => {
        const {body: {token}} = await request(server)
              .post('/api/auth/login')
              .send({
                username: 'test1',
                password: '1234'
              });
        const res = await request(server)
              .get('/api/invites')
              .set('Authorization', token);
        expect(res.status).toBe(200);
      });

      it('Responds with users invites on good get', async () => {
        {
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
          await request(server)
            .post('/api/potlucks')
            .set('Authorization', token)
            .send(bigBonanza);
          await request(server)
            .post('/api/invites')
            .set('Authorization', token)
            .send({
              potluck_id: 1,
              guest_id: 2
            });
        }

        const {body: {token}} = await request(server)
              .post('/api/auth/login')
              .send({
                username: 'test2',
                password: '1234'
              });
        const res = await request(server)
              .get('/api/invites')
              .set('Authorization', token);
        expect(res.body).toMatchObject([{
          potluck_id: 1,
          guest_id: 2
        }]);
      });

      it('Doesnt show other users invites', async () => {
        {
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
          await request(server)
            .post('/api/potlucks')
            .set('Authorization', token)
            .send(bigBonanza);
          await request(server)
            .post('/api/invites')
            .set('Authorization', token)
            .send({
              potluck_id: 1,
              guest_id: 2
            });
        }

        const {body: {token}} = await request(server)
              .post('/api/auth/login')
              .send({
                username: 'test3',
                password: '1234'
              });
        const res = await request(server)
              .get('/api/invites')
              .set('Authorization', token);
        expect(res.body).toMatchObject([]);
      });

    });

    describe('[GET] /api/invites/:id', () => {});
    describe('[POST] /api/invites', () => {

      it('Responds with a 401 and a message when given no token', async () => {
        const res = await request(server)
              .post('/api/invites')
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
              .post('/api/invites')
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
              .post('/api/invites')
              .set('Authorization', token)
              .send({});
        expect(res.status).toBe(400);
        expect(res.body.message).toBe(
          'Please provide a guest_id and potluck_id for the invite'
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
              .post('/api/invites')
              .set('Authorization', token)
              .send({
                potluck_id: 'not an integer',
                guest_id: 'also not an integer'
              });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe(
          'potluck_id and guest_id should be positive integers');
      });

      it('Only allows existing users to be invited', async () => {
        const {body: {token}} = await request(server)
              .post('/api/auth/login')
              .send({
                username: 'test1',
                password: '1234'
              });

        {
          const bigBonanza = {
            name: 'big bonanza',
            date: 'July 26',
            time: '7pm',
            location: 'right here'
          };
          await request(server)
            .post('/api/potlucks')
            .set('Authorization', token)
            .send(bigBonanza);
        }

        const newInvite = {
          guest_id: 25,
          potluck_id: 1
        };
        const res = await request(server)
              .post('/api/invites')
              .set('Authorization', token)
              .send(newInvite);
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Only existing users can be invited');
      });

      it('Only allows existing potlucks to be invited to', async () => {
        const {body: {token}} = await request(server)
              .post('/api/auth/login')
              .send({
                username: 'test1',
                password: '1234'
              });

        {
          const bigBonanza = {
            name: 'big bonanza',
            date: 'July 26',
            time: '7pm',
            location: 'right here'
          };
          await request(server)
            .post('/api/potlucks')
            .set('Authorization', token)
            .send(bigBonanza);
        }

        const newInvite = {
          guest_id: 2,
          potluck_id: 5
        };
        const res = await request(server)
              .post('/api/invites')
              .set('Authorization', token)
              .send(newInvite);
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Only existing potlucks can be invited to');
      });

      it('Only allows owner to invite guests', async () => {
        {
          const {body: {token}} = await request(server)
                .post('/api/auth/login')
                .send({
                  username: 'test2',
                  password: '1234'
                });
          const bigBonanza = {
            name: 'big bonanza',
            date: 'July 26',
            time: '7pm',
            location: 'right here'
          };
          await request(server)
            .post('/api/potlucks')
            .set('Authorization', token)
            .send(bigBonanza);
        }

        const {body: {token}} = await request(server)
              .post('/api/auth/login')
              .send({
                username: 'test1',
                password: '1234'
              });
        const newInvite = {
          guest_id: 3,
          potluck_id: 1
        };
        const res = await request(server)
              .post('/api/invites')
              .set('Authorization', token)
              .send(newInvite);
        expect(res.status).toBe(401);
        expect(res.body.message).toBe('Only the owner of the potluck can invite guests');
      });

      it('adding invites are idempotent', async () => {
        const {body: {token}} = await request(server)
              .post('/api/auth/login')
              .send({
                username: 'test1',
                password: '1234'
              });

        {
          const bigBonanza = {
            name: 'big bonanza',
            date: 'July 26',
            time: '7pm',
            location: 'right here'
          };
          await request(server)
            .post('/api/potlucks')
            .set('Authorization', token)
            .send(bigBonanza);
        }

        const newInvite = {
          guest_id: 2,
          potluck_id: 1
        };
        await request(server)
          .post('/api/invites')
          .set('Authorization', token)
          .send(newInvite);

        await request(server)
          .post('/api/invites')
          .set('Authorization', token)
          .send(newInvite);

        const expected = [
          newInvite
        ];
        const actual = await db('users_potlucks');
        expect(actual).toMatchObject(expected);
      });

      it('Adds invite to db', async () => {
        const {body: {token}} = await request(server)
              .post('/api/auth/login')
              .send({
                username: 'test1',
                password: '1234'
              });

        {
          const bigBonanza = {
            name: 'big bonanza',
            date: 'July 26',
            time: '7pm',
            location: 'right here'
          };
          await request(server)
            .post('/api/potlucks')
            .set('Authorization', token)
            .send(bigBonanza);
        } // adding potluck to invite test2 to

        const newInvite = {
          guest_id: 2,
          potluck_id: 1
        };
        const res = await request(server)
          .post('/api/invites')
          .set('Authorization', token)
          .send(newInvite);
        const expected = [
          newInvite
        ];
        const actual = await db('users_potlucks');
        expect(actual).toMatchObject(expected);
      });

      it('Responds with 201 on good post', async () => {
        const {body: {token}} = await request(server)
              .post('/api/auth/login')
              .send({
                username: 'test1',
                password: '1234'
              });

        {
          const bigBonanza = {
            name: 'big bonanza',
            date: 'July 26',
            time: '7pm',
            location: 'right here'
          };
          await request(server)
            .post('/api/potlucks')
            .set('Authorization', token)
            .send(bigBonanza);
        }

        const newInvite = {
          guest_id: 2,
          potluck_id: 1
        };
        const res = await request(server)
              .post('/api/invites')
              .set('Authorization', token)
              .send(newInvite);
        expect(res.status).toBe(201);
      });

      it('Responds with created invite on good post', async () => {
        const {body: {token}} = await request(server)
              .post('/api/auth/login')
              .send({
                username: 'test1',
                password: '1234'
              });
        const bigBonanza = {
          name: 'big bonanza',
          date: 'July 26',
          time: '7pm',
          location: 'right here'
        };
        await request(server)
          .post('/api/potlucks')
          .set('Authorization', token)
          .send(bigBonanza);

        const newInvite = {
          guest_id: 2,
          potluck_id: 1
        };
        const res = await request(server)
              .post('/api/invites')
              .set('Authorization', token)
              .send(newInvite);
        expect(res.body).toMatchObject(newInvite);
      });

    });

    describe('[PUT] /api/invites/:id', () => {});
    describe('[DELETE] /api/invites/:id', () => {});

  });

  describe('foods', () => {

    describe('[POST] /api/foods', () => {

      it('Responds with a 401 and a message when given no token', async () => {
        const res = await request(server)
              .post('/api/foods')
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
              .post('/api/foods')
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
              .post('/api/foods')
              .set('Authorization', token)
              .send({});
        expect(res.status).toBe(400);
        expect(res.body.message).toBe(
          'Please provide a name for the food'
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
              .post('/api/foods')
              .set('Authorization', token)
              .send({
                name: 1
              });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe(
          'name should be a string');
      });

      it('Adds food to db', async () => {
        const hotDogs = {
          name: 'hot dogs',
        };
        const {body: {token}} = await request(server)
              .post('/api/auth/login')
              .send({
                username: 'test1',
                password: '1234'
              });
        const res = await request(server)
              .post('/api/foods')
              .set('Authorization', token)
              .send(hotDogs);
        const expected = [
          hotDogs
        ];
        const actual = await db('foods');
        expect(actual).toMatchObject(expected);
      });

      it('Responds with 201 on good post', async () => {
        const hotDogs = {
          name: 'hot dogs',
        };
        const {body: {token}} = await request(server)
              .post('/api/auth/login')
              .send({
                username: 'test1',
                password: '1234'
              });
        const res = await request(server)
              .post('/api/foods')
              .set('Authorization', token)
              .send(hotDogs);
        expect(res.status).toBe(201);
      });

      it('Responds with created potluck on good post', async () => {
        const hotDogs = {
          name: 'hot dogs',
        };
        const {body: {token}} = await request(server)
              .post('/api/auth/login')
              .send({
                username: 'test1',
                password: '1234'
              });
        const res = await request(server)
              .post('/api/foods')
              .set('Authorization', token)
              .send(hotDogs);
        expect(res.body).toMatchObject(hotDogs);
      });

    });

  });

});
