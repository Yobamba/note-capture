const router = require("express").Router();
const trashController = require("../controllers/trash");

// Define the ensureAuthenticated middleware
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log("you're authenticated now!");
    return next(); // User is authenticated, proceed to the next middleware
  }

  res.status(401).json({
    message:
    "Authentication required. Copy and paste https://note-capture.onrender.com/sign-in into the browser and sign in. ",
  });
};

router.get(
  "/:noteId",
  ensureAuthenticated,
  trashController.getTrashById,
  () => {
    /**
     * #swagger.tags = ["Trash"]
     * #swagger.summary = "Get the specified note by noteId"
     * #swagger.description = "Searches the trash for the specified note"
     */
  }
);

router.get("/", ensureAuthenticated, trashController.getAllTrash, () => {
  /**
   * #swagger.tags = ["Trash"]
   * #swagger.summary = "Get all the notes from the trash"
   */
});

router.post(
  "/:noteId/trash",
  ensureAuthenticated,
  trashController.addToTrash,
  () => {
    /**
     * #swagger.tags = ["Trash"]
     * #swagger.summary = "Send the specified note to the trash"
     * #swagger.description = "Specify the note by noteId and it'll be sent to the trash"
     */
  }
);

router.delete(
  "/deleteAllTrash",
  ensureAuthenticated,
  trashController.deleteAllTrash,
  () => {
    /**
     * #swagger.tags = ["Trash"]
     * #swagger.summary = "Empty the trash"
     * #swagger.description = "Permanently delete all of the notes from the trash"
     */
  }
);

router.put(
  "/:noteId/restore",
  ensureAuthenticated,
  trashController.restoreTrash,
  () => {
    /**
     * #swagger.tags = ["Trash"]
     * #swagger.summary = "Restore the specified note from the trash to the notes"
     * #swagger.description = "Specify the note by noteId and it'll be restored to the notes"
     */
  }
);

router.delete(
  "/:noteId",
  ensureAuthenticated,
  trashController.deleteSingleTrash,
  () => {
    /**
     * #swagger.tags = ["Trash"]
     * #swagger.summary = "Permanently delete the specified note"
     * #swagger.description = "Specify the note by noteId and it'll be permanently deleted"
     */
  }
);

module.exports = router;
