import express from "express";
import request from "supertest";
import db from "../src/database/db";
import { hashPassword } from "../src/utils/auth";
import Users from "../src/database/schemas/user";
import router from "../src/routes/account"
import { UserAccount, UserTypes } from "../types/users";

jest.mock("../src/database/db");
jest.mock("../src/utils/auth");

const app = express();
app.use(express.json());
app.use("/medical-professional/user/register", router);

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
        subSpecialisation: 'subspecialisation',
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
  it("should return 400 if request body is incomplete", async () => {
    const res = await request(app)
      .post("/medical-professional/user/register")
      .send({ email: "test@example.com", password: "password" });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error", true);
    expect(res.body).toHaveProperty(
      "message",
      "Request body incomplete, email, password, type, registration and clinic details are required"
    );
    
  });

  it("should return 400 if user already exists", async () => {
    (db.exists as jest.Mock).mockResolvedValue(true);

    const res = await request(app)
      .post("/medical-professional/user/register")
      .send(user);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error", true);
    expect(res.body).toHaveProperty("message", "Unable to store account");
  });

  it("should return 200 if user is successfully created", async () => {
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

  it("should return 400 if there is an error in storing the account", async () => {
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
