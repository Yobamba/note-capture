const router = require("express").Router();

const trashController = require("../controllers/trash", () => {
  /**
   * #swagger.tags = ["Trash"]
   */
});

router.get("/:noteId", trashController.getTrashById, () => {
  /**
   * #swagger.tags = ["Trash"]
   */
});

router.get("/", trashController.getAllTrash, () => {
  /**
   * #swagger.tags = ["Trash"]
   */
});

router.post("/:noteId/trash", trashController.addToTrash, () => {
  /**
   * #swagger.tags = ["Trash"]
   */
});

router.delete("/deleteAllTrash", trashController.deleteAllTrash, () => {
  /**
   * #swagger.tags = ["Trash"]
   */
});

router.put("/:noteId/restore", trashController.restoreTrash, () => {
  /**
   * #swagger.tags = ["Trash"]
   */
});

router.delete("/:noteId", trashController.deleteSingleTrash, () => {
  /**
   * #swagger.tags = ["Trash"]
   */
});

module.exports = router;
