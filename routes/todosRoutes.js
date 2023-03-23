const express = require('express');
const todosController = require('./../controllers/todosController');

const router = express.Router();

router.get('/', todosController.getAllTodos);
router.post('/', todosController.createTodo);
router.get('/:id', todosController.getTodo);
router.patch('/:id', todosController.updateTodo);
router.delete('/:id', todosController.deleteTodo);

module.exports = router;
