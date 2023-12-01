const mongodb = require("../db/connect");
const server = require("../server.js");
const ObjectId = require("mongodb").ObjectId;
const dotenv = require("dotenv");
dotenv.config();
const MongoClient = require("mongodb").MongoClient;
const request = require("supertest");

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

  describe("Get all notes from the collection", function () {
    it("should return a 200", async () => {
      try {
        const response = await request(server).get('/notes');
        console.log("troubleshooting the GET " + response.body);
        expect(response.status).toBe(200);
      } catch (error) {
        console.error(error);
        throw error;
      }
    });
  });

  describe("Get a specific note from the collection", function () {
    it("should return a 200", async () => {
      try {
        const response = await request(server).get(`/notes/${insertedNoteId}`);
        expect(response.status).toBe(200);
      } catch (error) {
        console.error(error);
        throw error;
      }
    });
  });
});