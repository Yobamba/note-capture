const express = require("express");
const router = express.Router();

const notesController = require("../controllers/notes");

// Define the ensureAuthenticated middleware
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log("you're authenticated now!");
    return next(); // User is authenticated, proceed to the next middleware
  }

  res.status(401).json({
    message:
      "Authentication required. In the browser url remove doc and replace it with start_page/sign-in",
  });
};

router.get("/", ensureAuthenticated, notesController.getNotes, () => {
  /**
   * #swagger.tags = ["Notes"]
   * #swagger.summary = "Get all of the notes in the database"
   * #swagger.description = "Endpoint to get all of the notes in the database"
   */
});

router.get("/:id", ensureAuthenticated, notesController.getNote, () => {
  /**
   * #swagger.tags = ["Notes"]
   * #swagger.summary = "Get a specific note by id"
   * #swagger.description = "Endpoint to get a specific note by id"
   */
});

router.post("/", ensureAuthenticated, notesController.createNote, () => {
  /**
   * #swagger.tags = ["Notes"]
   * #swagger.summary = "Create a note in the database"
   * #swagger.description = "Endpoint to create a note in the database"
   */
});

router.put("/:id", ensureAuthenticated, notesController.updateNote, () => {
  /**
   * #swagger.tags = ["Notes"]
   * #swagger.summary = "Modify the specified note"
   * #swagger.description = "Endpoint to modify the specified note"
   */
});

router.delete("/:id", ensureAuthenticated, notesController.deleteNote, () => {
  /**
   * #swagger.tags = ["Notes"]
   * #swagger.summary = "Delete the specified note"
   * #swagger.description = "Endpoint to delete the specified note"
   */
});

router.get(
  "/note/:noteTag",
  ensureAuthenticated,
  notesController.findByTag,
  () => {
    /**
     * #swagger.tags = ["Tags"]
     * #swagger.summary = "Find notes by tag"
     * #swagger.description = "Endpoint to find notes by tag"
     */
  }
);

router.put(
  "/note/:noteId/addTag",
  ensureAuthenticated,
  notesController.addTagToNote,
  () => {
    /**
     * #swagger.tags = ["Tags"]
     * #swagger.summary = "Add a tag to the specified note"
     * #swagger.description = "Endpoint to add a tag to the specified note"
     */
  }
);

module.exports = router;
