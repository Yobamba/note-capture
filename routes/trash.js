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
      "Authentication required. In the browser url remove doc and replace it with start_page/sign-in",
  });
};

router.get(
  "/:noteId",
  ensureAuthenticated,
  trashController.getTrashById,
  () => {
    /**
     * #swagger.tags = ["Trash"]
     */
  }
);

router.get("/", ensureAuthenticated, trashController.getAllTrash, () => {
  /**
   * #swagger.tags = ["Trash"]
   */
});

router.post(
  "/:noteId/trash",
  ensureAuthenticated,
  trashController.addToTrash,
  () => {
    /**
     * #swagger.tags = ["Trash"]
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
     */
  }
);

module.exports = router;
