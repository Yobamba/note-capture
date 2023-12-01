const mongodb = require("../db/connect");
const server = require("../server.js");
const ObjectId = require("mongodb").ObjectId;
const dotenv = require("dotenv");
dotenv.config();
const MongoClient = require("mongodb").MongoClient;
const request = require("supertest");
const express = require("express");
const app2 = express();

// Mock authenticated user for testing
const authenticatedUser = {
  googleId: '114026477672450796016',
  // Other relevant user data
};

// Mock passport.authenticate middleware
const authenticateMock = (req, res, next) => {
  req.user = authenticatedUser;
  next();
};






describe("Testing the notes endpoints", function () {
  let connection;
  let db;
  let insertedNoteId;

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.MONGODB_URI);
    db = await connection.db(globalThis.__MONGO_DB_NAME__);
  });

  afterAll(async () => {
    await connection.close();
    await server.close();
  });

  describe("Insert a mock note to the collection", function () {
    it("should respond to a POST request", async () => {
      try {
        const newObjectId = new ObjectId();

        const mockNote = {
          _id: newObjectId,
          title: "Test Note",
          note: "This is a test note",
          noteTags: ["TestTag"],
          user: "testUser",
          googleId: "testGoogleId",
          pinStatus: false,
          attachments: [],
        };

        const notes = db.collection("notes");
        await notes.insertOne(mockNote);
        insertedNoteId = newObjectId;

        const insertedNote = await notes.findOne({ _id: newObjectId });
        expect(insertedNote).toEqual(mockNote);
      } catch (error) {
        console.error(error);
        throw error;
      }
    });

    afterEach(async () => {
      // Clean up: delete the inserted note after each test
      if (insertedNoteId) {
        const notes = db.collection("notes");
        await notes.deleteOne({ _id: insertedNoteId });
      }
    });
  });

  describe('Testing the notes endpoints', () => {
    // Apply the middleware to your route
    app2.get('/notes', authenticateMock, (req, res) => {
      // Your route logic here, which can now access req.user
      res.status(200).json({ message: 'Mocked response' });
    });
    it('should return a 200', async () => {
        const response = await request(app2)
            .get('/notes')
            .expect(200);
        // console.log('troubleshooting the GET', response.body);
        expect(response.status).toBe(200);
    });
  });

  describe("Get a specific note from the collection", function () {
    // Apply the middleware to the other route
    app2.get('/notes/6569dc75789506885c087ec6', authenticateMock, (req, res) => {
      // Your route logic here, which can now access req.user
      res.status(200).json({ message: 'Mocked response' });
    });

    it("should return a 200", async () => {
      try {
        const response = await request(app2).get('/notes/6569dc75789506885c087ec6');
        console.log(response.body);
        expect(response.status).toBe(200);
      } catch (error) {
        console.error(error);
        throw error;
      }
    });
  });
});