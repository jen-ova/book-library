const express = require('express');

const readerController = require('../controllers/reader.js');
const reader = require('../models/reader.js');

const router = express.Router();

router.post('/', readerController.create);

router.get('/', readerController.findAll);

router.get('/:id', readerController.findByPk);

router.patch('/:id', readerController.update);

router.delete('/:id', readerController.delete);

module.exports = router;
