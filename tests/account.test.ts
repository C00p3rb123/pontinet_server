import express from "express";
import bodyParser from 'body-parser';
import request from "supertest";
import db from "../src/database/db";
import { generateToken, verifyPassword, hashPassword } from "../src/utils/auth";
import router from "../src/routes/account"
import { UserAccount, UserTypes } from "../types/users";
import mongoose from "mongoose";


jest.mock('mongoose', () => ({
  connect: jest.fn(),
  disconnect: jest.fn(),
  Schema: class {},
  model: jest.fn(),
}));
jest.mock("../src/database/db");
jest.mock("../src/utils/auth");

const app = express();
app.use(bodyParser.json());
app.use(router);

afterEach(() => {
  jest.clearAllMocks();
});
afterAll(async () => {
  await mongoose.disconnect();
});

describe("POST /medical-professional/user/register", () => {

  let user: UserAccount;
  
  beforeEach(async () => {
    user = {
      email: 'test@example.com',
      password: 'hashedPassword',
      type: UserTypes.SP,
      registrationDetails: {
        name: 'test',
        dateOfBirth: '1/1/24',
        specialisation: 'specialisation',
        subSpecialisation: 'subSpecialisation',
        registrationId: '123',
        registrationCouncil: 'registrationCouncil',
        mobileNumber: 61412345678
    },
      clinicDetails: {
        clinicName: 'clinicName',
        clinicCountry: 'clinicCountry',
        clinicState: 'clinicState',
        clinicSuburb: 'clinicSuburb'
    }
    };
  });
  it("Return 400 if request body is incomplete", async () => {
    console.error = jest.fn();
    const res = await request(app)
      .post('/medical-professional/user/register')
      .send({ email: "test@example.com", password: "password" });
    
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error", true);
    expect(res.body).toHaveProperty(
      "message",
      "Request body incomplete, email, password, type, registration and clinic details are required"
    );
    expect(console.error).toHaveBeenCalledWith("Request body incomplete, email, password, type, registration and clinic details are required");
  });

  it("Return 400 if user already exists", async () => {
    (db.exists as jest.Mock).mockResolvedValue(true);

    const res = await request(app)
      .post("/medical-professional/user/register")
      .send(user);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error", true);
    expect(res.body).toHaveProperty("message", "Unable to store account");
  });

  it("Return 200 if user is successfully created", async () => {
    (db.exists as jest.Mock).mockResolvedValue(false);
    (hashPassword as jest.Mock).mockResolvedValue("hashedPassword");
    (db.set as jest.Mock).mockResolvedValue(undefined);

    const res = await request(app)
      .post("/medical-professional/user/register")
      .send(user);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty(
      "Message",
      `User with email ${user.email} has been successfully created`
    );
  });

  it("Return 400 if there is an error in storing the account", async () => {
    (db.exists as jest.Mock).mockResolvedValue(false);
    (hashPassword as jest.Mock).mockResolvedValue("hashedPassword");
    (db.set as jest.Mock).mockRejectedValue(new Error("DB Error"));

    const res = await request(app)
      .post("/medical-professional/user/register")
      .send(user);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error", true);
    expect(res.body).toHaveProperty(
      "message",
      "Unable to store account due to DB Error"
    );
  });
});

describe('POST /login', () => {
  it('Return 400 if email or password is missing', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: 'test@example.com' });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error', true);
    expect(res.body).toHaveProperty('message', 'Request body incomplete, email and password required');
  });

  it('Return 400 if email is not found in the database', async () => {
    (db.getOne as jest.MockedFunction<typeof db.getOne>).mockResolvedValue(null);

    const res = await request(app)
      .post('/login')
      .send({ email: 'test@example.com', password: 'password' });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error', true);
    expect(res.body).toHaveProperty('message', 'Invalid email or password');
  });

  it('Return 400 if password is incorrect', async () => {
    (db.getOne as jest.MockedFunction<typeof db.getOne>).mockResolvedValue({ password: 'hashedPassword' });
    (verifyPassword as jest.MockedFunction<typeof verifyPassword>).mockResolvedValue(false);

    const res = await request(app)
      .post('/login')
      .send({ email: 'test@example.com', password: 'password' });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error', true);
    expect(res.body).toHaveProperty('message', 'Invalid email or password');
  });

  it('Return 200 and a token if login is successful', async () => {
    (db.getOne as jest.MockedFunction<typeof db.getOne>).mockResolvedValue({ password: 'hashedPassword' });
    (verifyPassword as jest.MockedFunction<typeof verifyPassword>).mockResolvedValue(true);
    (generateToken as jest.MockedFunction<typeof generateToken>).mockResolvedValue('token');

    const res = await request(app)
      .post('/login')
      .send({ email: 'test@example.com', password: 'password' });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token', 'token');
  });
});