const router = require("express").Router();
const tagsController = require("../controllers/tags");
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

//
router.get("/", tagsController.getTags, () => {
  /**
   * #swagger.tags = ["Tags"]
   * #swagger.summary = "Find all of the tags created"
   * #swagger.description = "Returns all of tags created"
   */
});

router.get("/:tagName/notes", tagsController.getTag, () => {
  /**
   * #swagger.tags = ["Tags"]
   * #swagger.summary = "Find notes by tag"
   * #swagger.description = "Returns all of the notes with the specified tag"
   *
   */
});

router.post("/", tagsController.createTag, () => {
  /**
   * #swagger.tags = ["Tags"]
   * #swagger.summary = "Create a tag"
   */
});

router.put("/:tagId", tagsController.updateTag, () => {
  /**
   * #swagger.tags = ["Tags"]
   * #swagger.summary = "Modify the specified tag"
   */
});

router.delete("/:tagId", tagsController.deleteTag, () => {
  /**
   * #swagger.tags = ["Tags"]
   * #swagger.summary = "Delete the specified tag"
   */
});

module.exports = router;
