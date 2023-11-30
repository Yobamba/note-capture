const mongodb = require("../db/connect");
const server = require("../server.js");
const ObjectId = require("mongodb").ObjectId;
const dotenv = require("dotenv");
dotenv.config();
const MongoClient = require("mongodb").MongoClient;
const request = require("supertest");


describe("Testing the tags endpoints", function() {
    describe("Insert a mock tag to the collection", function () {
        let connection;
        let db;
        let insertedTagId; // Store the ID of the inserted tag
    
        beforeAll(async () => {
            connection = await MongoClient.connect(process.env.MONGODB_URI);
            db = await connection.db(globalThis.__MONGO_DB_NAME__);
        });
    
        afterAll(async () => {
            await connection.close();
            await server.close();
        });
    
        it("responds to a POST on /", async () => {
            const newObjectId = new ObjectId();
            const theTagName = "Jest Test Tag";
    
            // the tag that will be inserted for the test
            const mockTag = {
                _id: newObjectId,
                name: theTagName
            };
    
            const tags = db.collection("tags");
    
            await tags.insertOne(mockTag);
            insertedTagId = newObjectId; // Store the ID for later cleanup
            const insertedTag = await tags.findOne({ _id: newObjectId });
    
            expect(insertedTag).toEqual(mockTag);
        });
    
        afterEach(async () => {
            // Clean up: delete the inserted tag after each test
            if (insertedTagId) {
                const tags = db.collection("tags");
                await tags.deleteOne({ _id: insertedTagId });
                // console.log(`Deleted test tag with ID: ${insertedTagId}`);  // to check the id of the tag we're deleting
            }
        });
    });
    
    describe("Get all tags from the collection", function() {
        beforeAll((done) => {
            mongodb.initDb((err, db) => {
              if (err) {
                console.error(err);
                done();
              } else {
                done();
              }
            });
          });
          
          it("should return a 200", async () => {
            try {
                const response = await request(server).get('/tags');
                // console.log(response.body); // Log the response body to see what the test is getting
                expect(response.status).toBe(200);
            } catch (error) {
                // Handle the error or log it
                console.error(error);
                throw error;
            }
        });
    }); 

    describe("Get all notes that have the specified tag", function() {
        it("should return a 200", async () => {
            try {
                const response = await request(server).get('/tags/note/brandNew');
                // console.log(response.body); // Log the response body to see what the test is getting
                expect(response.status).toBe(200);
            } catch (error) {
                // Handle the error or log it
                console.error(error);
                throw error;
            }
        });  
        
        afterAll(async () => {
            try {
              await mongodb.getDb().close();
            } catch (err) {
              console.error(err);
            }
          });
    }); 

});
