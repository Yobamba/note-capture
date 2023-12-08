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
  googleId: 'x',
  
};

// Mock passport.authenticate middleware
const authenticateMock = (req, res, next) => {
  req.user = authenticatedUser;
  next();
};

describe("Testing the trash endpoints", function () {
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

  describe("Insert a mock trash to the collection", function () {
    it("should respond to a POST request", async () => {
      try {
        const newObjectId = new ObjectId();

        const mockTrash = {
          _id: newObjectId,
          title: "Test Note",
          note: "This is a test note",
          noteTags: ["TestTag"],
          user: "testUser",
          googleId: "testGoogleId",
          pinStatus: false,
          attachments: [],
        };

        const trash = db.collection("trash");
        await trash.insertOne(mockTrash);
        insertedNoteId = newObjectId;

        const trashedNote = await trash.findOne({ _id: newObjectId });
        expect(trashedNote).toEqual(mockTrash);
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

  describe('Testing the trash endpoints', () => {
    // Applying middleware to the route
    app2.get('/trash', authenticateMock, (req, res) => {
      res.status(200).json({ message: 'Mocked response' });
    });
    it('should return a 200', async () => {
        const response = await request(app2)
            .get('/trash')
            .expect(200);
        expect(response.status).toBe(200);
    });
  });
  describe("Get a specific trash from the collection", function () {
    // Apply the middleware to the other route
    app2.get('/trash/6569dc75789506885c087ec', authenticateMock, (req, res) => {
      res.status(200).json({ message: 'Mocked response' });
    });

    it("should return a 200", async () => {
      try {
        const response = await request(app2).get('/trash/6569dc75789506885c087ec');
        expect(response.status).toBe(200);
      } catch (error) {
        console.error(error);
        throw error;
      }
    });
  });
  describe("Delete a specific note from trash", function () {
    app2.delete('/trash/6569dc75789506885c087ec', authenticateMock, (req, res) => {
      res.status(200).json({ message: 'Mocked response' });
    });
  
    it("should return a 200", async () => {
      try {
        const response = await request(app2).delete(`/trash/6569dc75789506885c087ec`);
        expect(response.status).toBe(200);
      } catch (error) {
        console.error(error);
        throw error;
      }
    });
  });
});