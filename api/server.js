const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const db = require('./data/db-config');

const authRouter = require('./auth/router');
const potluckRouter = require('./potlucks/router');
const inviteRouter = require('./invites/router');
const foodRouter = require('./foods/router');
const {
  restricted
} = require('./middleware');
// function getAllUsers() { return db('users') }

// async function insertUser(user) {
//   // WITH POSTGRES WE CAN PASS A "RETURNING ARRAY" AS 2ND ARGUMENT TO knex.insert/update
//   // AND OBTAIN WHATEVER COLUMNS WE NEED FROM THE NEWLY CREATED/UPDATED RECORD
//   // UNLIKE SQLITE WHICH FORCES US DO DO A 2ND DB CALL
//   const [newUserObject] = await db('users').insert(user, ['user_id', 'username', 'password'])
//   return newUserObject // { user_id: 7, username: 'foo', password: 'xxxxxxx' }
// }

const server = express();
server.use(express.json());
server.use(helmet());
server.use(cors());

server.use('/api/auth', authRouter);
server.use('/api/potlucks', restricted, potluckRouter);
server.use('/api/invites', restricted, inviteRouter);
server.use('/api/foods', restricted, foodRouter);
// server.get('/api/users', async (req, res) => {
//   res.json(await getAllUsers())
// })

// server.post('/api/users', async (req, res) => {
//   res.status(201).json(await insertUser(req.body))
// })

server.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    message: err.message,
    stack: err.stack
  });
});

module.exports = server;
