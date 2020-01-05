require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const User = require('../lib/models/User');

describe('app routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('creates a user', () => {
    return request(app)
      .post('/api/v1/auth/signup')
      .send({ username: 'treemo', password: 'hello' })
      .then(res => {
        
        expect(res.body).toEqual({
          _id: expect.any(String),
          username: 'treemo',
          __v: 0
        });
      });
  });

  it('lets a user login', async() => {
    const user = await User.create({ username: 'treemo', password: 'hello' });
    return request(app)
      .post('/api/v1/auth/login')
      .send({ username: 'treemo', password: 'hello' })
      .then(res => {
        expect(res.body).toEqual({
          _id: user.id,
          username: 'treemo',
          __v: 0
        });
      });
  });
  it('fails if a user puts in wrong username', async() => {
    await User.create({ username: 'treemo', password: 'hello' });
    return request(app)
      .post('/api/v1/auth/login')
      .send({ username: 'treemomoney', password: 'hello' })
      .then(res => {
        expect(res.body).toEqual({
          message: 'Invalid Username/Password',
          status: 401
        });
      });
  });
  it('fails if a user puts in wrong password', async() => {
    await User.create({ username: 'treemo', password: 'hello' });
    return request(app)
      .post('/api/v1/auth/login')
      .send({ username: 'treemo', password: 'hellotreemo' })
      .then(res => {
        expect(res.body).toEqual({
          message: 'Invalid Username/Password',
          status: 401
        });
      });
  });
});