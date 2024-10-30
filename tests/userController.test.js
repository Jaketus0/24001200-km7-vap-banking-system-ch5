const request = require('supertest');
const { PrismaClient } = require('@prisma/client');
const app = require('../app'); 
const prisma = new PrismaClient();

describe('AuthControllers', () => {
    beforeAll(async () => {
        await prisma.user.deleteMany(); 
        await prisma.profile.deleteMany(); 
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    describe('POST /api/v1/auth/register', () => {
        test('should register a new user', async () => {
            const response = await request(app)
                .post('/api/v1/auth/register')
                .send({
                    name: 'Wahyu',
                    email: 'wahyu@mail.com',
                    password: "$2b$10$fB2rcCXx.rZf.dwdv6qfxuF7GB2NLE4VkB3YxeDG7KqY8na32oHX6",
                    identityType: 'National ID',
                    identityNumber: 'N123456744',
                    address: '876 qqq'
                });

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('Berhasil ditambahkan');
            expect(response.body.data).toHaveProperty('name', 'Wahyu');
            expect(response.body.data).toHaveProperty('email', 'wahyu@mail.com');
            expect(response.body.data).toHaveProperty('profiles');
        });

        test('should return an error for duplicate email', async () => {
            await request(app)
                .post('/api/v1/auth/register')
                .send({
                    name: 'Wahyu',
                    email: 'wahyu@mail.com', // Email yang sama
                    password: "$2b$10$fB2rcCXx.rZf.dwdv6qfxuF7GB2NLE4VkB3YxeDG7KqY8na32oHX6",
                    identityType: 'National ID',
                    identityNumber: 'N123456744',
                    address: '876 qqq'
                });

            const response = await request(app)
                .post('/api/v1/auth/register')
                .send({
                    name: 'Wahyu Duplicate',
                    email: 'wahyu@mail.com',
                    password: "$2b$10$fB2rcCXx.rZf.dwdv6qfxuF7GB2NLE4VkB3YxeDG7KqY8na32oHX6",
                    identityType: 'National ID',
                    identityNumber: 'N123456744',
                    address: '876 qqq'
                });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Email sudah terdaftar. Silakan gunakan email lain.');
        });
    });

    describe('POST /api/v1/auth/login', () => {
        test('should login a user with valid credentials', async () => {
            const response = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'wahyu@mail.com',
                    password: "$2b$10$fB2rcCXx.rZf.dwdv6qfxuF7GB2NLE4VkB3YxeDG7KqY8na32oHX6"
                });

            expect(response.status).toBe(200);
            expect(response.body.status).toBe(true);
            expect(response.body.data).toHaveProperty('token');
            expect(response.body.data.user.email).toBe('wahyu@mail.com');
        });

        test('should return an error for invalid credentials', async () => {
            const response = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'wrong@mail.com',
                    password: 'wrongpassword'
                });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('invalid email or password');
        });
    });

    describe('GET /api/v1/auth/authenticate', () => {
        let token;

        beforeAll(async () => {
            const response = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'wahyu@mail.com',
                    password: "$2b$10$fB2rcCXx.rZf.dwdv6qfxuF7GB2NLE4VkB3YxeDG7KqY8na32oHX6"
                });
            // token = response.body.data.token; 
        });

        test('should authenticate a user with a valid token', async () => {
            const response = await request(app)
                .get('/api/v1/auth/authenticate')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.status).toBe(true);
            expect(response.body.data).toHaveProperty('email', 'wahyu@mail.com');
        });
    });
});
