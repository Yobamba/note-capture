const mongodb = require("../db/connect");
const server = require("../server.js");
const passport = require("passport");
const express = require("express");

const ObjectId = require("mongodb").ObjectId;
const dotenv = require("dotenv");
dotenv.config();
const MongoClient = require("mongodb").MongoClient;
const request = require("supertest");

// Mock the user object for authentication
jest.mock("../user.js", () => ({
    findOrCreate: jest.fn(),
  }));
  
  // Mock the Google authentication strategy
  jest.mock("passport-google-oauth20", () => {
    const { Strategy } = jest.requireActual("passport-google-oauth20");
  
    return {
      Strategy: jest.fn(() => ({
        authenticate: jest.fn(),
      })),
    };
  });
  

  
  // Your passport configuration and route setup
  
  // Mock passport's authenticate method
  jest.spyOn(passport, 'authenticate').mockImplementation((strategy, options, callback) => {
    return (req, res, next) => {
      req.user = { /* Mocked user object */ };
      return callback(null, req.user);
    };
  });
  

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
                console.log(`Deleted test tag with ID: ${insertedTagId}`);
            }
        });
    });
    
    describe("Get all tags from the collection", function() {
        it("should return a 200", async () => {
            request(server)
            .get('/tags')
            // .expect('Content-Type', /json/)
            // .expect('Content-Length', '15')
            .expect(200)
            .end(function(err, res) {
                if (err) throw err;
            });
        });   
    }); 

    describe("Get all notes that have the specified tag", function() {
        it("should return a 200", async () => {
            request(server)
            .get('/tags/note/brandNew')
            // .get('api-docs/#/Tags/get_tags_note__noteTag_')
            // .get('api-docs/#/Tags/get_tags_note/brandNew')
            // .expect('Content-Type', /json/)
            // .expect('Content-Length', '15')
            .expect(200)
            .end(function(err, res) {
                if (err) throw err;
            });
        });   
    }); 

});

