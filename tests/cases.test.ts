import express from "express";
import bodyParser from 'body-parser';
import request from "supertest";
import db from "../src/database/db";
import router from "../src/routes/cases"
import mongoose from "mongoose";
import { PatientInformation } from "../types/cases";
import { verifyToken } from "../src/utils/auth";

jest.mock('mongoose', () => ({
  connect: jest.fn(),
  disconnect: jest.fn(),
  Schema: class {},
  model: jest.fn(),
}));
jest.mock("../src/database/db");
jest.mock("../src/utils/auth", () => {
    return {
      verifyToken: jest.fn((req, res, next) => next()),
    };
  });
jest.mock("../src/utils/casesUtils");

const app = express();
app.use(bodyParser.json());
app.use(router);

afterEach(() => {
  jest.clearAllMocks();
});
afterAll(async () => {
  await mongoose.disconnect();
});

describe('POST /recieve', () => {
    it('Return 200 status and a message if successful', async () => {
        const patientInformation: PatientInformation = {
        age: 18,  
        illnessDescription: {
            segment: 'segment',
            segmentDetails: 'segmentDetails',
            mechanism: 'mechanism',
            mechanismDetails: 'mechanismDetails',
        },
        gp: "generalPracticioner",
        referralDate: 'dateOfReferral'
        };

        const res = await request(app)
        .post('/recieve')
        .send(patientInformation);

        expect(res.status).toEqual(200);
    });
});

// describe('GET /retrieve', () => {
    
//     it('Return 200 status if retrieval was successful', async () => {
//         const res = await request(app).get('/retrieve');
//         expect(res.statusCode).toBe(200);
//     });

//     it('Return 400 if retrieval failed', async () => {
//         const errorMessage = 'Test error';
//         (db.getMany as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

//         const res = await request(app).get('/retrieve');

//         expect(res.statusCode).toBe(400);
//         expect(res.body).toEqual({
//         error: true,
//         message: `Unable to retrieve new cases due to ${errorMessage}`,
//         });
//     });
// });