const express = require("express");
const router = express.Router();
const notesController = require("../controllers/notes");

router.get("/", notesController.getNotes, () => {
  /**
   * #swagger.tags = ["Notes"]
   * #swagger.summary = "Get all of the notes in the database"
   * #swagger.description = "Endpoint to get all of the notes in the database"
   */
});

router.get("/:id", notesController.getNote, () => {
  /**
   * #swagger.tags = ["Notes"]
   * #swagger.summary = "Get a specific note by id"
   * #swagger.description = "Endpoint to get a specific note by id"
   */
});

router.post("/", notesController.createNote, () => {
  /**
   * #swagger.tags = ["Notes"]
   * #swagger.summary = "Create a note in the database"
   * #swagger.description = "Endpoint to create a note in the database"
   */
});

router.put("/:id", notesController.updateNote, () => {
  /**
   * #swagger.tags = ["Notes"]
   * #swagger.summary = "Modify the specified note"
   * #swagger.description = "Endpoint to modify the specified note"
   */
});

router.delete("/:id", notesController.deleteNote, () => {
  /**
   * #swagger.tags = ["Notes"]
   * #swagger.summary = "Delete the specified note"
   * #swagger.description = "Endpoint to delete the specified note"
   */
});

router.get("/note/:noteTag", notesController.findByTag, () => {
  /**
   * #swagger.tags = ["Tags"]
   * #swagger.summary = "Find notes by tag"
   * #swagger.description = "Endpoint to find notes by tag"
   */
});

router.put("/note/:noteId/addTag", notesController.addTagToNote, () => {
  /**
   * #swagger.tags = ["Tags"]
   * #swagger.summary = "Add a tag to the specified note"
   * #swagger.description = "Endpoint to add a tag to the specified note"
   */
});
router.put('/:noteId/tags/:tagId', notesController.updateNoteTag);

router.delete('/:noteId/tags/:tagId', notesController.deleteNoteTag);

module.exports = router;
