const express = require('express');
const router = express.Router();

const notesController = require('../controllers/notes');

router.get('/', notesController.getNotes);

router.get('/:id', notesController.getNote);

router.post('/', notesController.createNote);

router.put('/:id', notesController.updateNote);

router.delete('/:id', notesController.deleteNote);

router.get('/note/:noteTag', notesController.findByTag);

router.put('/note/:noteId/addTag', notesController.addTagToNote);

module.exports = router;