const Users = require('./model');
const db = require('../data/db-config');

describe('getByUsername', () => {

  it('returns user when user exists', async () => {
    const user = await Users.getByUsername('test1');
    expect(user).toMatchObject({
      id: 1,
      username: 'test1',
      password: '1234',
    });
  });

  it.todo('returns nothing when user doesnt');
});
