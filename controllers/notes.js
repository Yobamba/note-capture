const mongodb = require("../db/connect");
const ObjectId = require("mongodb").ObjectId;
const tagsController = require("../controllers/tags");
const addToTrash = require('./trash').addToTrash;
const getNotes = async (req, res) => {
  const googleId = req.user.googleId;
  const db = await mongodb.getDb();
  const result = await db.db().collection("notes").find({ googleId }); // only get notes by the authenticated user
  result.toArray().then((lists) => {
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(lists);
  });
};

const getNote = async (req, res) => {
  const noteid = new ObjectId(req.params.id);
  const db = await mongodb.getDb();
  const result = await db.db().collection("notes").find({ _id: noteid });
  result.toArray().then((lists) => {
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(lists[0]);
  });
};

const createNote = async (req, res) => {
  const db = await mongodb.getDb();

  //noteTags should be a list of tags
  const noteTags = Array.isArray(req.body.noteTags)
  ? req.body.noteTags
  : [req.body.noteTags];

  // Adding to tags collection if not already existing
  for (const tag of noteTags) {
    const existingTag = await db
      .db()
      .collection("tags")
      .findOne({ name: tag });

    if (!existingTag) {
      const newTag = { name: tag };
      await db.db().collection("tags").insertOne(newTag);
    }
  }

  const note = {
    title: req.body.title,
    note: req.body.note,
    noteTags: req.body.noteTags,
    user: req.user.username, // gets the authenticated username
    googleId: req.user.googleId, // gets the authenticated googleId
    pinStatus: req.body.pinStatus,
    attatchments: req.body.attatchments,
  };
  const response = await db.db().collection("notes").insertOne(note);
  if (response.acknowledged) {
    res.status(201).json(response);
  } else {
    res
      .status(500)
      .json(response.error || "Sorry, an error occured while creating note.");
  }
};

const updateNote = async (req, res) => {
  const db = await mongodb.getDb();
  const noteId = new ObjectId(req.params.id);
  const note = {
    title: req.body.title,
    note: req.body.note,
    noteTags: req.body.noteTags,
    user: req.body.user,
    pinStatus: req.body.pinStatus,
    attatchments: req.body.attatchments,
  };
  const response = await db
    .db()
    .collection("notes")
    .replaceOne({ _id: noteId }, note);
  console.log(response);
  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res
      .status(500)
      .json(response.error || "Sorry, an error occured while updating note.");
  }
};

//const deleteNote = async (req, res) => {
 // const noteId = new ObjectId(req.params.id);
  //const response = await db
    //.db()
    //.collection("notes")
    //.deleteOne({ _id: noteId }, true);
  //console.log(response);
  //if (response.deletedCount > 0) {
    //res.status(200).send();
 // } else {
   // res
     // .status(500)
      //.json(response.error || "Sorry, an error occured while deleting note.");
 // }
//};

const deleteNote = async (req, res) => {
  const noteId = new ObjectId(req.params.id);
  const db = await mongodb.getDb();

  try {
    const originalNote = await db
      .db()
      .collection("notes")
      .findOne({ _id: noteId });

    if (!originalNote) {
      res.status(404).json({ error: `Note with ID ${noteId} not found` });
      return;
    }

    await addToTrash(req, res);  // Call the addToTrash function from trash.js

    res.status(200).json({ message: `Note ${noteId} moved to trash` });
  } catch (error) {
    res.status(500).json({ error: "Sorry, an error occurred while moving the note to trash." });
  }
};

const findByTag = async (req, res) => {
  const noteTag = req.params.noteTag;
  const db = await mongodb.getDb();
  const result = await db.db().collection("notes").find({ noteTags: noteTag });

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
    .db()
    .collection("notes")
    .updateOne({ _id: noteId }, { $push: { noteTags: newTag } });

  if (response.modifiedCount > 0) {
    res
      .status(200)
      .json({ message: `Tag '${newTag}' added to note with ID ${noteId}` });
  } else {
    res
      .status(500)
      .json(response.error || "Sorry, an error occurred while adding the tag.");
  }
};

const createUser = async (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
    username: req.body.userName,
  };
  const db = await mongodb.getDb();
  const response = await db.db().collection("users").insertOne(user);
  if (response.acknowledged) {
    res.redirect("https://note-capture.onrender.com/start_page/login");
  } else {
    res
      .status(500)
      .json(response.error || "Some error occurred while creating the user.");
    console.log("Erro!");
  }
};

module.exports = {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  findByTag,
  addTagToNote,
  createUser,
};
