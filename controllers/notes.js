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
  const googleId = req.user.googleId;
  const db = await mongodb.getDb();
  try {
    const result = await db.db().collection("notes").find({ _id: noteid, googleId });
    result.toArray().then((lists) => {
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(lists[0]);
    });

    if (!result) {
      res.status(404).json({ error: `Note with ID ${noteid} not found` });
      return;
    }
  } catch {
    res.status(500).json({ error: "Sorry, an error occurred while moving the note to trash." });
  }
  
};

const createNote = async (req, res) => {
  const db = await mongodb.getDb();

  // noteTags should be a list of tags
  const noteTags = Array.isArray(req.body.noteTags)
    ? req.body.noteTags
    : [req.body.noteTags];

  // Adding each tag to the tags collection if not already existing
  await Promise.all(
    noteTags.map(async (tag) => {
      await createTagIfNotExists(db, tag);
    })
  );

  const note = {
    title: req.body.title,
    note: req.body.note,
    noteTags: noteTags, //req.body.noteTags,
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
      .json(response.error || "Sorry, an error occurred while creating note.");
  }
};

const createTagIfNotExists = async (db, tagName) => {
  const existingTag = await db
    .db()
    .collection("tags")
    .findOne({ name: tagName });

  if (!existingTag) {
    const newTag = { name: tagName };
    await db.db().collection("tags").insertOne(newTag);
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

const deleteNote = async (req, res) => {
  const noteId = new ObjectId(req.params.id);
  const db = await mongodb.getDb();

  try {
    const originalNote = await db.db("note_capture").collection("notes").findOne({ _id: noteId });

    if (!originalNote) {
      res.status(404).json({ error: `Note with ID ${noteId} not found` });
      return;
    }

   await addToTrash(req, res, originalNote); 
   res.status(200).json({ message: `Note ${noteId} moved to trash` });
  } catch (error) {
    res.status(500).json({ error: "Sorry, an error occurred while moving the note to trash." });
  }
};

const findByTag = async (req, res) => {
  const noteTag = req.params.noteTag;
  const db = await mongodb.getDb();

  try {
    const result = await db.db().collection("notes").find({ noteTags: noteTag }).toArray();
   

    res.setHeader("Content-Type", "application/json");
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching notes by tag." });
  }
};

const addTagToNote = async (req, res) => {
  const noteId = new ObjectId(req.params.noteId);
  const newTag = req.body.newTag;
  console.log(newTag); // 
//
  if (!newTag) {
    res.status(400).json({ error: "New tag is required" });
    return;
  }

  const db = await mongodb.getDb();
  const existingNote = await db
    .db()
    .collection("notes")
    .findOne({ _id: noteId });

  if (!existingNote) {
    res.status(404).json({ error: `Note with ID ${noteId} not found` });
    return;
  }

  await createTagIfNotExists(db, newTag);

  const updatedNoteTags = Array.isArray(existingNote.noteTags)
    ? existingNote.noteTags
    : [existingNote.noteTags];
  updatedNoteTags.push(newTag);

  const response = await db
    .db()
    .collection("notes")
    .updateOne({ _id: noteId }, { $set: { noteTags: updatedNoteTags } });

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
