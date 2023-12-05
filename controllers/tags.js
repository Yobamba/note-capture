const mongodb = require("../db/connect");
const ObjectId = require("mongodb").ObjectId;

const getTags = async (req, res) => {
  try{
    const db = await mongodb.getDb();
    const result = await db.db().collection("tags").find();
    result.toArray().then((tags) => {
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(tags);
    });
  }catch (error) {
    console.error(error);
    res.status(500).json({ error: "Sorry, an error occurred while getting tags." });
  }
};

const getTag = async (req, res) => {
  try{
    const tagName = req.params.tagName;
    const db = await mongodb.getDb();
    const result = await db.db().collection("notes").find({ noteTags: tagName });

    result.toArray().then((notes) => {
      res.status(200).json(notes);
    });
  }catch (error) {
    console.error(error);
    res.status(500).json({ error: "Sorry, an error occurred while getting tag." });
  }  
};
const createTag = async (req, res) => {
  try{
    const db = await mongodb.getDb();
    const tag = {
      name: req.body.name,
    };

    const response = await db.db().collection("tags").insertOne(tag);

    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      res
        .status(500)
        .json(
          response.error || "Sorry, an error occurred while creating the tag."
        );
    }
  }catch (error) {
    console.error(error);
    res.status(500).json({ error: "Sorry, an error occurred while creating tags." });
  }
};

const updateTag = async (req, res) => {
  try{
    console.log(req.body) // debugging the request sent in
    const tagId = new ObjectId(req.params.tagId);
    const db = await mongodb.getDb();
    const tag = {
      name: req.body.name,
    };

    const response = await db
      .db()
      .collection("tags")
      .replaceOne({ _id: tagId }, tag);

    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res
        .status(500)
        .json(
          response.error || "Sorry, an error occurred while updating the tag."
        );
    }
  }catch (error) {
    console.error(error);
    res.status(500).json({ error: "Sorry, an error occurred while updating the tag." });
  }
};

const deleteTag = async (req, res) => {
  try{
    const tagId = new ObjectId(req.params.tagId);
    const db = await mongodb.getDb();
    const response = await db.db().collection("tags").deleteOne({ _id: tagId });

    if (response.deletedCount > 0) {
      res.status(200).send();
    } else {
      res
        .status(500)
        .json(
          response.error || "Sorry, an error occurred while deleting the tag."
        );
    }
  }catch (error) {
    console.error(error);
    res.status(500).json({ error: "Sorry, an error occurred while deleting the tag." });
  }
};

module.exports = { getTags, getTag, createTag, updateTag, deleteTag };
