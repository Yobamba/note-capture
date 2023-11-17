const router = require('express').Router();
const trashController = require('../controllers/trash');

router.get('/:noteId', trashController.getTrashById);

router.get('/', trashController.getAllTrash);

router.post('/:noteId/trash', trashController.addToTrash);

router.delete('/deleteAllTrash', trashController.deleteAllTrash);

router.put('/:noteId/restore', trashController.restoreTrash);

router.delete('/:noteId', trashController.deleteSingleTrash);

module.exports = router;