const router = require('express').Router();
const tagsController = require('../controllers/tags');

router.get('/', tagsController.getTags);

router.get('/:tagName/notes', tagsController.getTag);

router.post('/', tagsController.createTag);

router.put('/:tagId', tagsController.updateTag);

router.delete('/:tagId', tagsController.deleteTag);



module.exports = router;