const router = require("express").Router();
const tagsController = require("../controllers/tags");
const ensureAuthenticated = require("./notes");

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
//
router.get("/", tagsController.getTags);

router.get("/:tagName/notes", tagsController.getTag);

router.post("/", tagsController.createTag);

router.put("/:tagId", tagsController.updateTag);

router.delete("/:tagId", tagsController.deleteTag);

module.exports = router;
