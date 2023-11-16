const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;


const getNotes = async (req, res) => {
    const db = await mongodb.getDb()
    const result = await db.db("note_capture").collection("notes").find()
    result.toArray().then((lists) => {
      res.setHeader("Content-Type", "application/json")
      res.status(200).json(lists)
    })
  };
  
  const getNote = async (req, res) => {
    const noteid = new ObjectId(req.params.id)
    const db = await mongodb.getDb()
    const result = await db.db("note_capture").collection("notes").find({ _id: noteid })
    result.toArray().then((lists) => {
      res.setHeader("Content-Type", "application/json")
      res.status(200).json(lists[0])
    })
  };
const createNote = async (req, res) => {
    const db = await mongodb.getDb()
    const note = {
      title: req.body.title,
      note: req.body.note,
      noteTags: req.body.noteTags,
      user: req.body.user,
      pinStatus: req.body.pinStatus,
      attatchments:req.body.attatchments
    };
    const response = await db.db("note_capture").collection("notes").insertOne(note);
    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      res.status(500).json(response.error || 'Sorry, an error occured while creating note.');
    }
  };

  const updateNote = async (req, res) => {
    const db = await mongodb.getDb()
    const noteId = new ObjectId(req.params.id);
    const note = {
        title: req.body.title,
        note: req.body.note,
        noteTags: req.body.noteTags,
        user: req.body.user,
        pinStatus: req.body.pinStatus,
        attatchments:req.body.attatchments
      };
    const response = await db.db("note_capture").collection("notes").replaceOne({ _id: noteId },note);
    console.log(response);
    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json(response.error || 'Sorry, an error occured while updating note.');
    }
  };

  const deleteNote= async (req, res) => {
    const noteId = new ObjectId(req.params.id);
    const response = await db.db("note_capture").collection("notes").deleteOne({ _id: noteId }, true);
    console.log(response);
    if (response.deletedCount > 0) {
      res.status(200).send();
    } else {
      res.status(500).json(response.error || 'Sorry, an error occured while deleting note.');
    }
  };
  const findByTag = async (req, res) => {
    const noteTag = req.params.noteTag;
    const db = await mongodb.getDb();
    const result = await db
      .db("note_capture")
      .collection("notes")
      .find({ noteTags: noteTag });
  
    result.toArray().then((lists) => {
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(lists);
    });
  };
  
  const addTagToNote = async (req, res) => {
    const noteId = new ObjectId(req.params.noteId);
    const newTag = req.body.newTag;
  
    if (!newTag) {
      res.status(400).json({ error: "New tag is required" });
      return;
    }
  
    const db = await mongodb.getDb();
    const response = await db
      .db("note_capture")
      .collection("notes")
      .updateOne({ _id: noteId }, { $push: { noteTags: newTag } });
  
    if (response.modifiedCount > 0) {
      res.status(200).json({ message: `Tag '${newTag}' added to note with ID ${noteId}` });
    } else {
      res.status(500).json(response.error || "Sorry, an error occurred while adding the tag.");
    }
  };
  

  module.exports = { getNotes, getNote,createNote,updateNote,deleteNote,findByTag,addTagToNote};
