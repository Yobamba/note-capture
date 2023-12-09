const router = require("express").Router();
const tagsController = require("../controllers/tags");
const notesController = require("../controllers/notes");

// Define the ensureAuthenticated middleware
const ensureAuthenticated = process.env.TEST_MODE === 'true'
  ? (req, res, next) => next()
  : (req, res, next) => {
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
router.get("/", ensureAuthenticated, tagsController.getTags, () => {
  /**
   * #swagger.tags = ["Tags"]
   * #swagger.summary = "Find all of the tags created"
   * #swagger.description = "Returns all of tags created"
   */
});

// router.get("/:tagName/notes", ensureAuthenticated,  tagsController.getTag, () => { // This one is redundant

//   /**
//    * #swagger.tags = ["Tags"]
//    * #swagger.summary = "Find notes by tag"
//    * #swagger.description = "Returns all of the notes with the specified tag"
//    *
//    */
// });

router.post("/", ensureAuthenticated,  tagsController.createTag, () => {
  /**
   * #swagger.tags = ["Tags"]
   * #swagger.summary = "Create a tag"
   */
});

router.put("/:tagId", ensureAuthenticated,  tagsController.updateTag, () => {
  /**
   * #swagger.tags = ["Tags"]
   * #swagger.summary = "Modify the specified tag"
   */
});

router.delete("/:tagId", ensureAuthenticated,  tagsController.deleteTag, () => {
  /**
   * #swagger.tags = ["Tags"]
   * #swagger.summary = "Delete the specified tag"
   */
});

module.exports = router;
