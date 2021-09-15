const express = require('express');
const app = require('../app');

const bookController = require('../controllers/book');
const book = require('../models/book');

const router = express.Router();

router.post('/', bookController.create);

router.get('/', bookController.findAll);

router.get('/:id', bookController.findByPk);

router.patch('/:id', bookController.update);

router.delete('/:id', bookController.delete);

module.exports = router;
