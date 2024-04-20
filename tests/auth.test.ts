import { generateToken, verifyToken, verifyPassword, hashPassword } from '../src/utils/auth';
import db from '../src/database/db';
import Users from '../src/database/schemas/user';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

jest.mock('mongoose', () => ({
    connect: jest.fn(),
    disconnect: jest.fn(),
    Schema: class {},
    model: jest.fn(),
}));
jest.mock('../src/database/db');
jest.mock('jsonwebtoken');
jest.mock('bcrypt');

describe('generateToken', () => {

    afterEach(async () => {
        await mongoose.disconnect();
    });

    it('Throw an error if user is not found', async () => {
        (db.getOne as jest.Mock).mockResolvedValue(null);
        await expect(generateToken('test@example.com')).rejects.toThrow('Unable to generate token');
    });

    it('Return token if user is found', async () => {
        const mockUser = {
            _id: '123',
            type: 'user'
        };
        (db.getOne as jest.Mock).mockResolvedValue(mockUser);
        (jwt.sign as jest.Mock).mockReturnValue('token');

        const token = await generateToken('test@example.com');

        expect(db.getOne).toHaveBeenCalledWith(Users, { email: 'test@example.com' }, 'type');
        expect(jwt.sign).toHaveBeenCalledWith(
            {
                sub: mockUser._id.toString(),
                username: 'test@example.com',
                role: mockUser.type,
                iat: expect.any(Number)
            },
            process.env.SECRET!,
            { expiresIn: '1d' }
        );
        expect(token).toBe('token');
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });
});

describe('verifyToken', () => {
    let mockRequest: any;
    let mockResponse: any;
    let mockNext: any;

    beforeEach(() => {
        mockRequest = {
            headers: {
                authorization: 'Bearer token'
            }
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        mockNext = jest.fn();
    });

    it('Return 403 if no token is provided', () => {
        mockRequest.headers.authorization = '';
        verifyToken(mockRequest, mockResponse, mockNext);
        expect(mockResponse.status).toHaveBeenCalledWith(403);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Access denied. No token provided.' });
    });

    it('Return 403 if token is invalid', () => {
        (jwt.verify as jest.Mock).mockImplementation(() => {
            throw new Error('Invalid token');
        });
        verifyToken(mockRequest, mockResponse, mockNext);
        expect(mockResponse.status).toHaveBeenCalledWith(403);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Invalid token.' });
    });

    it('Call next if token is valid', () => {
        const decodedToken = { sub: '123', username: 'test@example.com', role: 'user' };
        (jwt.verify as jest.Mock).mockReturnValue(decodedToken);
        verifyToken(mockRequest, mockResponse, mockNext);
        expect(mockRequest.user).toEqual(decodedToken);
        expect(mockNext).toHaveBeenCalled();
    });
});

describe('verifyPassword', () => {
    const password = 'password';
    const hashedPassword = 'hashedPassword';

    it('Throw an error is not password is provided', async () => {
        await expect(verifyPassword('', hashedPassword)).rejects.toThrow('verifyPassword is missing parameters');
    });

    it('Throw an error if no hashed password is provided', async () => {
        await expect(verifyPassword(password, '')).rejects.toThrow('verifyPassword is missing parameters');
    });

    it('Return true if the password is correct', async () => {
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);
        const result = await verifyPassword(password, hashedPassword);
        expect(result).toBe(true);
    });

    it('Return false if the password is incorrect', async () => {
        (bcrypt.compare as jest.Mock).mockResolvedValue(false);
        const result = await verifyPassword(password, hashedPassword);
        expect(result).toBe(false);
    });

    it('Return false if an error occurs', async () => {
        (bcrypt.compare as jest.Mock).mockImplementation(() => {
            throw new Error('An error occurred');
        });
        const result = await verifyPassword(password, hashedPassword);
        expect(result).toBe(false);
    });
});

describe('hashPassword', () => {
    const password = 'password';

    it('Throw an error if no password is provided', async () => {
        await expect(hashPassword('')).rejects.toThrow('Password unable to be stored');
    });

    it('Return a hashed password if a password is provided', async () => {
        const hashedPassword = 'hashedPassword';
        (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
        const result = await hashPassword(password);
        expect(result).toBe(hashedPassword);
    });

    it('Call bcrypt.hash with the correct parameters', async () => {
        const saltRounds = 10;
        await hashPassword(password);
        expect(bcrypt.hash).toHaveBeenCalledWith(password, saltRounds);
    });
});