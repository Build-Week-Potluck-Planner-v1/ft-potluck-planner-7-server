const Users = require('./model');
const db = require('../data/db-config');

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

describe('getByUsername', () => {

  it('returns user when user exists', async () => {
    const user = await Users.getByUsername('test1');
    expect(user).toMatchObject({
      id: 1,
      username: 'test1',
    });
  });

  it('returns nothing when user doesnt', async () => {
    const user = await Users.getByUsername('NotInDatabase');
    expect(user).toBe(undefined);
  });

});

describe('add', () => {

  it('adds a user to the db', async () => {
    const before = await db('users')
          .where({
            username: 'test'
          })
          .first();
    expect(before).toBe(undefined);

    await Users.add({
      username: 'test',
      password: '1234'
    });

    const after = await db('users')
          .where({
            username: 'test'
          })
          .first();
    expect(after).toMatchObject({
      username: 'test'
    });
  });

  it('returns added user', async () => {
    const res = await Users.add({
      username: 'test5',
      password: '1234'
    });
    expect(res).toMatchObject({
      username: 'test5'
    });
  });

});
