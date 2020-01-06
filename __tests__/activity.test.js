require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Activity = require('../lib/models/Activity');
const User = require('../lib/models/User');

describe('app routes', () => {
    let agent
    beforeAll(async() => {
        connect();

        agent = request.agent(app);

        await User
        .create({
            username: 'treesus',
            password: 'hello'
        });

        await agent
        .post('/api/v1/auth/login')
        .send({
            username: 'treesus',
            password: 'hello'
        });
    });
    beforeEach(() => {
        return mongoose.connection.dropDatabase()
    });

    let activity;

    beforeEach(async() => {
        activity = await Activity
        .create({
            name: 'Snowboarding',
            description: 'Shreddin the gnar at shreddows.',
            duration: '5 hours',
            date: '2020-01-04'
        });
    });

    afterAll(() => {
        return mongoose.connection.close();
    });

    it('requires authorization to post', () => {
        return request(app)
        .post('/api/v1/activities')
        .send({
            name: 'Hiking',
            description: 'Hiked around Silver State Falls',
            duration: 'About 4 hours',
            date: '2019-12-29T00:00:00.000Z'
        })
        .then(res => {
            expect(res.statusCode).toEqual(500);
        });
    })

    it('creates an activity', async() => {
        return agent
        .post('/api/v1/activities')
        .send({
            name: 'Hiking',
            description: 'Hiked around Silver State Falls',
            duration: 'About 4 hours',
            date: '2019-12-29'
        })
        .then(res => {
            expect(res.body).toEqual({
                _id: expect.any(String),
                name: 'Hiking',
                description: 'Hiked around Silver State Falls',
                duration: 'About 4 hours',
                date: '2019-12-29T00:00:00.000Z',
                userId: expect.any(String),
                __v: 0
            })
        })
    })

    it('requires authorization to get all', () => {
        return request(app)
        .get('/api/v1/activities')
        .then(res => {
            expect(res.statusCode).toEqual(500);
        })
    })

    it('finds all activities', async() => {
        return agent
        .post('/api/v1/activities')
        .send({
            name: 'Snowboarding',
            description: 'Shreddin the gnar at shreddows.',
            duration: '5 hours',
            date: '2020-01-04'
        })
        .then(() => {
            return agent
            .get('/api/v1/activities')
            .then(res => {
                expect(res.body).toEqual([{
                    _id: expect.any(String),
                    name: 'Snowboarding',
                    description: 'Shreddin the gnar at shreddows.',
                    duration: '5 hours',
                    date: '2020-01-04T00:00:00.000Z',
                    userId: expect.any(String),
                    __v: 0
                }]);
            });
        }); 
    });

    it('finds an activity by id', () => {
        return request(app)
        .get(`/api/v1/activities/${activity.id}`)
        .then(res => {
            expect(res.body).toEqual({
                _id: activity.id,
                name: 'Snowboarding',
                description: 'Shreddin the gnar at shreddows.',
                duration: '5 hours',
                date: '2020-01-04T00:00:00.000Z',
                __v: 0
            })
        })
    })

    it('updates an activity by id', () => {
        return request(app)
        .patch(`/api/v1/activities/${activity.id}`)
        .send({ description: 'Shreddin the gnar at Meadows.' })
        .then(res => {
            expect(res.body).toEqual({
                _id: activity.id,
                name: 'Snowboarding',
                description: 'Shreddin the gnar at Meadows.',
                duration: '5 hours',
                date: '2020-01-04T00:00:00.000Z',
                __v: 0
            })
        })
    })

    it('deletes an activity by id', () => {
        return request(app)
        .delete(`/api/v1/activities/${activity.id}`)
        .then(res => {
            expect(res.body).toEqual({
                _id: activity.id,
                name: 'Snowboarding',
                description: 'Shreddin the gnar at shreddows.',
                duration: '5 hours',
                date: '2020-01-04T00:00:00.000Z',
                __v: 0
            })
        })
    })

})